import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react'
import Styled from 'styled-components'
import throttle from 'lodash/throttle'

import { Dialog, Paper, Grid, Button, Box } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

/*
	Supplement styles
*/
import cardStyles from '../card/YGOCardStyles'

/*
	Custom Components
*/
import { BanListSection } from './BanListSection'
import { TabbedView } from './TabbedView'
import { handleFetch } from '../../helper/FetchHandler'
import SuspenseFallback from '../../SuspenseFallback'
import { BanListDates } from './BanListDates'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'
import { MainContentContainer } from '../MainContent'
import BanListTable from './BanListTable'
import {YGOCard} from '../card/YGOCard'



const BreadCrumb = lazy( () => import('../Breadcrumb') )
const BanListStats = lazy( () => import('./BanListStats') )

const CardDialog = Styled(Dialog)`
	&&
	{
		width: 100%;
		max-width: 380px;
		margin: 0 auto;
		background: transparent;
	}
`

const BanContentParent = Styled(Paper)`
	&&
	{
		border-radius: .5rem;

		@media screen and (min-width: 0px)
		{
			padding: .67rem;
			margin-bottom: 1.5rem;
		}
		@media screen and (min-width: 600px)
		{
			padding: 1rem;
			margin-bottom: 1.5rem;
		}
		@media screen and (min-width: 960px)
		{
			padding: .5rem;
			margin-bottom: 1.5rem;
		}
		@media screen and (min-width: 2200px)
		{
			padding: 1.5rem;
			margin-bottom: 1.5rem;
		}
	}
`

const BannedContentContainer = Styled(Paper)`
	&&
	{
		border-radius: 0rem;

		@media screen and (min-width: 960px)
		{
			margin-right: 2rem;
		}
	}
`



export default function BanList(props)
{
	const [banListStartDates, setBanListStartDates] = useState([])
	const [selectedBanList, setSelectedBanList] = useState('')

	const [forbidden, setForbidden] = useState([])
	const [limited, setLimited] = useState([])
	const [semiLimited, setSemiLimited] = useState([])

	const [numForbidden, setNumForbidden] = useState(undefined)
	const [numLimited, setNumLimited] = useState(undefined)
	const [numSemiLimited, setNumSemiLimited] = useState(undefined)

	const [isSettingUpDates, setIsSettingUpDates] = useState(true)
	const [isFetchingBanList, setIsFetchingBanList] = useState(true)
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	const [showingCardDetail, setShowingCardDetail] = useState(false)
	const [chosenCardID, setChosenCardID] = useState(undefined)
	const [chosenCard, setChosenCard] = useState(undefined)

	const [newForbiddenCards, setNewForbiddenCards] = useState([])
	const [newLimitedCards, setNewLimitedCards] = useState([])
	const [newSemiLimitedCards, setNewSemiLimitedCards] = useState([])

	const [numNewForbidden, setNumNewForbidden] = useState(undefined)
	const [numNewLimited, setNumNewLimited] = useState(undefined)
	const [numNewSemiLimited, setNumNewSemiLimited] = useState(undefined)

	const [removedCards, setRemovedCards] = useState([])
	const [numRemoved, setNumRemoved] = useState(undefined)

	useEffect(() => {
		handleFetch(NAME_maps_ENDPOINT['banListsUrl'], props.history, (resultJson) => {
			setBanListStartDates(resultJson.banListStartDates)
			setSelectedBanList(resultJson.banListStartDates[0])
		})
		// eslint-disable-next-line
	}, [])


	useEffect( () => {
		if ( !isFetchingBanList )	setIsDataLoaded(true)
		else	setIsDataLoaded(false)
	}, [isFetchingBanList])


	useEffect(() => {
		if (selectedBanList !== '')
		{
			setIsSettingUpDates(false)
			setIsFetchingBanList(true)

			handleFetch(`${NAME_maps_ENDPOINT['banListInstanceUrl']}/${selectedBanList}?saveBandwidth=true&allInfo=true`, props.history, (resultJson) => {

				setForbidden( resultJson.banListInstance.forbidden )
				setLimited( resultJson.banListInstance.limited )
				setSemiLimited( resultJson.banListInstance.semiLimited )

				setNumForbidden( resultJson.banListInstance.numForbidden )
				setNumLimited( resultJson.banListInstance.numLimited )
				setNumSemiLimited( resultJson.banListInstance.numSemiLimited )

				// Removed cards compared to previous ban list
				setRemovedCards(resultJson.banListInstance.removedContent.removedCards)
				setNumRemoved(resultJson.banListInstance.removedContent.numRemoved)

				// Newly added cads compared to previous ban list
				setNewForbiddenCards(resultJson.banListInstance.newContent.newCards.forbidden)
				setNewLimitedCards(resultJson.banListInstance.newContent.newCards.limited)
				setNewSemiLimitedCards(resultJson.banListInstance.newContent.newCards.semiLimited)

				setNumNewForbidden(resultJson.banListInstance.newContent.newCards.numForbidden)
				setNumNewLimited(resultJson.banListInstance.newContent.newCards.numLimited)
				setNumNewSemiLimited(resultJson.banListInstance.newContent.newCards.numSemiLimited)

				setIsFetchingBanList(false)
			})

		}
		// eslint-disable-next-line
	}, [selectedBanList])


	useEffect(() => {
		if (chosenCardID !== undefined)
		{
			handleFetchCardInfo(chosenCardID, (resultJson) => {
				setChosenCard(resultJson)
				setShowingCardDetail(true)
			})
		}
		// eslint-disable-next-line
	}, [chosenCardID])


	useEffect(() => {
		if (showingCardDetail === false) setChosenCardID(undefined)
	}, [showingCardDetail])


	return (
		<Box >
			<BreadCrumb crumbs={['Home', 'Ban List']} />

			<CardDialog open={showingCardDetail} unmountOnExit onClose={() => setShowingCardDetail(false)} >
				{
					(showingCardDetail) ?
						<Suspense style={{background: 'transparent'}} fallback={ <SuspenseFallback /> } >
								<YGOCard
									key={999}
									fullDetails
									cardID={chosenCard.cardID}
									cardName={chosenCard.cardName}
									monsterType={chosenCard.monsterType}
									cardColor={chosenCard.cardColor}
									cardEffect={chosenCard.cardEffect}
									monsterAtk={chosenCard.monsterAttack}
									monsterDef={chosenCard.monsterDefense}
									cardStyles={cardStyles} />

								<Button onClick={ () => window.location.assign(`/card/${chosenCard.cardID}`) } variant='contained' style={{ marginTop: '1rem' }} endIcon={ <ArrowForwardIcon /> } >Info</Button>
						</Suspense>
						: undefined
				}
			</CardDialog>

			<Grid container spacing={0} style={{ width: '100%' }} >

				<Grid item xs={12} sm={12} md={3} lg={2} xl={2}
						style={{ paddingLeft: '2rem', paddingRight: '2rem', width: '100%' }} >
					<BanContentParent
						style={ (isSettingUpDates)? {display: 'none'}: {display: 'block' }  } >

						{(isSettingUpDates)? undefined
							: <BanListDates
							selectedBanList={selectedBanList}
							banListStartDates={banListStartDates}
							setSelectedBanList={ (ind) => setSelectedBanList(banListStartDates[ind]) } />}

					</BanContentParent>

					<BanContentParent
						style={ (isSettingUpDates)? {display: 'none'}: {display: 'block' }  } >
						<BanListStats
							totalCardsInSelectedList={numForbidden + numLimited + numSemiLimited}
							selectedBanList={selectedBanList}
							newForbiddenCards={newForbiddenCards}
							newLimitedCards={newLimitedCards}
							newSemiLimitedCards={newSemiLimitedCards}
							numNewForbidden={numNewForbidden}
							numNewLimited={numNewLimited}
							numNewSemiLimited={numNewSemiLimited}
							removedCards={removedCards}
							numRemoved={numRemoved}
							handleFetchCardInfo={handleFetchCardInfo}
							cardClicked={ (cardID) => setChosenCardID(cardID) }
						/>
					</BanContentParent>

					<br />
				</Grid>


			<Grid item xs={12} sm={12} md={9} lg={10} xl={10}
						style={{ width: '100%' }} >
				{/* <BanListTable
					isDataLoaded={ isDataLoaded }
					bannedContent={ forbidden }
					contentTitle='Forbidden'
					contentExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format'
					contentColor='#ff4557'
					cardClicked={ cardID => setChosenCardID(cardID) }
				/>
				<br />
				<BanListTable
					isDataLoaded={ isDataLoaded }
					bannedContent={ limited }
					contentTitle='Limited'
					contentExplanation='Limited cards can be included in Deck/Side deck - max 1'
					contentColor='#ff6c12'
					cardClicked={ cardID => setChosenCardID(cardID) }
				/>
				<br />
				<BanListTable
					isDataLoaded={ isDataLoaded }
					bannedContent={ semiLimited }
					contentTitle='Semi-Limited'
					contentExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2'
					contentColor='#f0c620'
					cardClicked={ cardID => setChosenCardID(cardID) }
				/> */}

			<BannedContentContainer >
				<TabbedView
					numForbidden={numForbidden}
					numLimited={numLimited}
					numSemiLimited={numSemiLimited}
					banList={selectedBanList}
					forbiddenContent={
						useMemo( () =>
						{
							return <BanListSection
								sectionName='Forbidden'
								sectionExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format'
								sectionExplanationBackground='rgba(255, 69, 87, .17)'
								cards={forbidden}
								newCards={newForbiddenCards}
								isDataLoaded={isDataLoaded}
								cardClicked={(cardID) => setChosenCardID(cardID)}
								banList={selectedBanList}
							/>
						}
						, [isDataLoaded])
					}

					limitedContent={
						useMemo( () => {
							return <BanListSection
								sectionName='Limited'
								sectionExplanation='Limited cards can be included in Deck/Side deck - max 1'
								sectionExplanationBackground='rgba(255, 108, 18, .17)'
								cards={limited}
								newCards={newLimitedCards}
								isDataLoaded={isDataLoaded}
								cardClicked={(cardID) => setChosenCardID(cardID)}
								banList={selectedBanList}
							/>
						}
						, [isDataLoaded])
					}

					semiLimitedContent={
						useMemo( () => {
							return <BanListSection
								sectionName='Semi-Limited'
								sectionExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2'
								sectionExplanationBackground='rgba(240, 198, 32, .17)'
								cards={semiLimited}
								newCards={newSemiLimitedCards}
								isDataLoaded={isDataLoaded}
								cardClicked={(cardID) => setChosenCardID(cardID)}
								banList={selectedBanList}
							/>
						}
						, [isDataLoaded])
					}
				/>
				</BannedContentContainer>
				</Grid>

			</Grid>
		</Box>
	)


	function handleFetchCardInfo(cardId, callback)
	{
		handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}/${cardId}`, props.history, callback)
	}
}
