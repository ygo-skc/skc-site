import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react'
import Styled from 'styled-components'
import throttle from 'lodash/throttle'

import { Dialog, Paper, Grid } from '@material-ui/core'

/*
	Supplement styles
*/
import cardStyles from '../card/CardDetailStyle'

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



const CardDetail = lazy( () => import('../card/CardDetail') )
const BreadCrumb = lazy( () => import('../Breadcrumb') )
const BanListStats = lazy( () => import('./BanListStats') )

const CardDialog = Styled(Dialog)`
	&&
	{
		.MuiDialog-paper
		{
			background-color: transparent;
		}

		.MuiDialog-paperWidthSm
		{
			max-width: 350px;
			min-width: 350px;
		}
	}
`

const BanContentParent = Styled(Paper)`
	&&
	{
		padding: .85rem;
		border-radius: .5rem;
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
	const [isFetchingNewCards, setIsFetchingNewCards] = useState(true)
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
		if ( !isFetchingBanList && !isFetchingNewCards )	setIsDataLoaded(true)
		else	setIsDataLoaded(false)
	}, [isFetchingBanList, isFetchingNewCards])


	useEffect(() => {
		if (selectedBanList !== '')
		{
			setIsSettingUpDates(false)
			setIsFetchingBanList(true)
			setIsFetchingNewCards(true)

			handleFetch(`${NAME_maps_ENDPOINT['banListInstanceUrl']}/${selectedBanList}?saveBandwidth=true`, props.history, (resultJson) => {
				setForbidden( resultJson.bannedCards.forbidden )
				setLimited( resultJson.bannedCards.limited )
				setSemiLimited( resultJson.bannedCards.semiLimited )

				setNumForbidden( resultJson.bannedCards.numForbidden )
				setNumLimited( resultJson.bannedCards.numLimited )
				setNumSemiLimited( resultJson.bannedCards.numSemiLimited )

				setIsFetchingBanList(false)
			})

			fetchNewCards()
			fetchRemovedCards()

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
		<MainContentContainer >
			<BreadCrumb crumbs={['Home', 'Ban List']} />

			<CardDialog open={showingCardDetail} unmountOnExit onClose={() => setShowingCardDetail(false)} >
				{
					(showingCardDetail) ?
						<Suspense fallback={ <SuspenseFallback /> } >
							<CardDetail
								key={999}
								fullDetails
								cardID={chosenCard.cardID}
								cardName={chosenCard.cardName}
								monsterType={chosenCard.monsterType}
								cardColor={chosenCard.cardColor}
								cardEffect={chosenCard.cardEffect}
								cardClicked={props.cardClicked}
								monsterAtk={chosenCard.monsterAttack}
								monsterDef={chosenCard.monsterDefense}
								cardStyles={cardStyles} />
						</Suspense>
						: undefined
				}
			</CardDialog>

			<Grid container spacing={1} style={{margin: 0, width: '100%'}} >

			<Grid item xs={12} sm={12} md={3} lg={2} xl={2} >
			<BanContentParent
				style={ (isSettingUpDates)? {display: 'none'}: {display: 'block' }  } >

				{(isSettingUpDates)? undefined
					: <BanListDates
					selectedBanList={selectedBanList}
					banListStartDates={banListStartDates}
					setSelectedBanList={ (ind) => setSelectedBanList(banListStartDates[ind]) } />}

			</BanContentParent>

			<br />

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

			</Grid>


			<Grid item xs={12} sm={12} md={9} lg={10} xl={10} >
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

			<BanContentParent
				style={ (isSettingUpDates)? {display: 'none'}: {display: 'block', paddingTop: '0rem' }  } >
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
				</BanContentParent>
				</Grid>

			</Grid>
		</MainContentContainer>
	)


	function handleFetchCardInfo(cardId, callback)
	{
		handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}/${cardId}`, props.history, callback)
	}


	function fetchRemovedCards()
	{
		const url = `${NAME_maps_ENDPOINT.removedCardsInBanList}/${selectedBanList}`
		fetch(url)
		.then( (res) => {
			if (res.status === 200)	return res.json()
			else if (res.status === 204)	return null
			else	throw new Error()
		})
		.then(json => {
			if (json != null)
			{
				setRemovedCards(json.removedCards)
				setNumRemoved(json.numRemoved)
			}
		})
	}


	function fetchNewCards()
	{
		setIsFetchingNewCards(true)
		const url = `${NAME_maps_ENDPOINT.newCardsInBanList}/${selectedBanList}`

		fetch(url)
		.then(res => {
			if (res.status === 200)	return res.json()
			else if (res.status === 204)	return null
			else	throw new Error()
		})
		.then(json => {
			if (json == null)
			{
				setNewForbiddenCards([])
				setNewLimitedCards([])
				setNewSemiLimitedCards([])
			}
			else
			{
				setNewForbiddenCards(json.newCards.forbidden)
				setNewLimitedCards(json.newCards.limited)
				setNewSemiLimitedCards(json.newCards.semiLimited)

				setNumNewForbidden(json.newCards.numForbidden)
				setNumNewLimited(json.newCards.numLimited)
				setNumNewSemiLimited(json.newCards.numSemiLimited)
			}
			setIsFetchingNewCards(false)
		})
	}
}
