import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react'
import Styled from 'styled-components'

import { Dialog, Paper, ListItem } from '@material-ui/core'

/*
	Supplement styles
*/
import cardStyles from '../card/CardDetailStyle'

/*
	Custom Components
*/
import { BanListSection } from './BanListSection'
import BreadCrumb from '../Breadcrumb.js'
import { TabbedView } from './TabbedView'
import { handleFetch } from '../../helper/FetchHandler'
import SuspenseFallback from '../../SuspenseFallback'
import { BanListDates } from './BanListDates'
import { BanListStats } from './BanListStats'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'
import { MainContentContainer } from '../MainContent'



const CardDetail = lazy( () => import('../card/CardDetail') )

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
		margin-bottom: 2.75rem;
		border-radius: .5rem;
	}

`

const ListStatItem = Styled(ListItem)`
	&&
	{
		padding: .25rem;
	}
`



export default function BanList(props)
{
	const [banListStartDates, setBanListStartDates] = useState([])
	const [selectedBanList, setSelectedBanList] = useState('')

	const [forbidden, setForbidden] = useState([])
	const [limited, setLimited] = useState([])
	const [semiLimited, setSemiLimited] = useState([])

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

	const [removedCards, setRemovedCards] = useState([])


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

			setTimeout(() => {
				handleFetch(`${NAME_maps_ENDPOINT['banListInstanceUrl']}${selectedBanList}?saveBandwidth=true`, props.history, (resultJson) => {
					setForbidden( resultJson.bannedCards.forbidden )
					setLimited( resultJson.bannedCards.limited )
					setSemiLimited( resultJson.bannedCards.semiLimited )

					setIsFetchingBanList(false)
					fetchNewCards()
					fetchRemovedCards()
				})
			}, 250);

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

			<BanContentParent
				style={ (isSettingUpDates)? {display: 'none'}: {display: 'block' }  } >

				{(isSettingUpDates)? undefined:  <BanListDates
					selectedBanList={selectedBanList}
					banListStartDates={banListStartDates}
					setSelectedBanList={ (ind) => setSelectedBanList(banListStartDates[ind]) } />}

				<BanListStats
					numForbidden={forbidden.length}
					numLimited={limited.length}
					numSemiLimited={semiLimited.length}
					selectedBanList={selectedBanList}
					newForbiddenCards={newForbiddenCards}
					newLimitedCards={newLimitedCards}
					newSemiLimitedCards={newSemiLimitedCards}
					removedCards={removedCards}
					handleFetchCardInfo={handleFetchCardInfo}
					cardClicked={ (cardID) => setChosenCardID(cardID) }
				/>
			</BanContentParent>


			<BanContentParent
				style={ (isSettingUpDates)? {display: 'none'}: {display: 'block', paddingTop: '0rem' }  } >
				<TabbedView
					numForbidden={forbidden.length}
					numLimited={limited.length}
					numSemiLimited={semiLimited.length}
					banList={selectedBanList}
					forbiddenContent={
						useMemo( () =>
						{
							return <BanListSection
								sectionName='Forbidden'
								sectionExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format'
								sectionExplanationBackground='#ff4557'
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
								sectionExplanationBackground='#ff6c12'
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
								sectionExplanationBackground='#f0c620'
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
		</MainContentContainer>
	)


	function handleFetchCardInfo(cardId, callback)
	{
		handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}${cardId}`, props.history, callback)
	}


	function fetchRemovedCards()
	{
		const url = `${NAME_maps_ENDPOINT.removedCardsInBanList}${selectedBanList}`
		fetch(url)
		.then( (res) => {
			if (res.status === 200)	return res.json()
			else if (res.status === 204)	return null
			else	throw new Error()
		})
		.then( (json) => {
			if (json != null)	setRemovedCards(json.removedCards)
		} )
	}


	function fetchNewCards()
	{
		setIsFetchingNewCards(true)
		const url = `${NAME_maps_ENDPOINT.newCardsInBanList}${selectedBanList}`

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
			}
			setIsFetchingNewCards(false)
		})
	}
}
