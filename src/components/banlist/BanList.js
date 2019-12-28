import React, { useState, useEffect } from 'react'

import { Dialog, Paper, Chip, Typography, List, ListItem, ListItemText, Collapse } from '@material-ui/core'
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded'

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Grid from '@material-ui/core/Grid'

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CardDetail from '../card/CardDetail'

import Styled from 'styled-components'

import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'
import {MainContentContainer} from '../MainContent'


/*
	Custom Components
*/
import BanListSection from './BanListSection'
import BreadCrumb from '../Breadcrumb.js'
import TabbedView from './TabbedView'
import { handleFetch } from '../../helper/FetchHandler'


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CardDialog = Styled(Dialog)`
	.MuiDialog-paper
	{
		background-color: transparent;
	}

	.MuiDialog-paperWidthSm
	{
		max-width: 350px;
		min-width: 350px;
	}
`

const BanDatesExpansionSummary = Styled(ExpansionPanelSummary)`
	&&
	{
		@media only screen and (min-width: 0px)
		{
			padding-left: .85rem;
			padding-right: .85rem;
		}
		@media only screen and (min-width: 600px)
		{
			padding-left: .95rem;
			padding-right: .95rem;
		}
		@media only screen and (min-width: 800px)
		{
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
	}
`

const BanDatesExpansionDetail = Styled(ExpansionPanelDetails)`
	&&
	{
		@media only screen and (min-width: 0px)
		{
			padding: .85rem;
		}
		@media only screen and (min-width: 600px)
		{
			padding: .95rem;
		}
		@media only screen and (min-width: 800px)
		{
			padding: 1.25rem;
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



function BanList(props)
{
	const [banListStartDates, setBanListStartDates] = useState([])
	const [banListGrid, setBanListGrid] = useState([])
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

	const [newForbiddenCards, setNewForbiddenCards] = useState({})
	const [newLimitedCards, setNewLimitedCards] = useState({})
	const [newSemiLimitedCards, setNewSemiLimitedCards] = useState({})

	const [isShowingNewCards, setIsShowingNewCards] = useState(false)
	const [isShowingNewForbiddenCards, setIsShowingNewForbiddenCards] = useState(false)
	const [isShowingNewLimitedCards, setIsShowingNewLimitedCards] = useState(false)
	const [isShowingNewSemiLimitedCards, setIsShowingNewSemiLimitedCards] = useState(false)

	const [removedCardsList, setRemovedCardsList] = useState({})

	const [isShowingRemovedCards, setIsShowingRemovedCards] = useState(false)

	const [newForbiddenCardsList, setNewForbiddenCardsList] = useState([])
	const [newLimitedCardsList, setNewLimitedCardsList] = useState([])
	const [newSemiLimitedCardsList, setNewSemiLimitedCardsList] = useState([])

	const showNewCards = () => {
		setIsShowingNewCards(!isShowingNewCards)
	}

	const showNewForbiddenCards = () => {
		setIsShowingNewForbiddenCards(!isShowingNewForbiddenCards)
	}

	const showNewLimitedCards = () => {
		setIsShowingNewLimitedCards(!isShowingNewLimitedCards)
	}

	const showNewSemiLimitedCards = () => {
		setIsShowingNewSemiLimitedCards(!isShowingNewSemiLimitedCards)
	}

	const showRemovedCards = () => {
		setIsShowingRemovedCards(!isShowingRemovedCards)
	}



	useEffect(() => {
		handleFetch(NAME_maps_ENDPOINT['banListsUrl'], props.history, (resultJson) => {
			setBanListStartDates(resultJson.banListStartDates)
			setSelectedBanList(resultJson.banListStartDates[0])
		})
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
	}, [isSettingUpDates])


	useEffect( () => {
		if ( !isFetchingBanList && !isFetchingNewCards )	setIsDataLoaded(true)
		else	setIsDataLoaded(false)
	}, [isFetchingBanList, isFetchingNewCards])


	useEffect(() => {
		if (selectedBanList !== '')
		{
			let banListGrid = []
			banListStartDates.forEach((item, ind) => {
				banListGrid.push(<Grid key={ind} item xs={6} sm={4} md={2} lg={2} xl={1} >
					<Chip color='secondary' variant={ (item === selectedBanList)? 'default' : 'outlined' } label={getDateString(months, new Date(item))}
						icon={<DateRangeRoundedIcon />}
						onClick={ () => setSelectedBanList(banListStartDates[ind]) } />
				</Grid>
				)
			})

			setBanListGrid(banListGrid)


			setIsSettingUpDates(false)
			setIsFetchingBanList(true)
			setIsFetchingNewCards(true)

			setIsShowingNewForbiddenCards(false)
			setIsShowingNewLimitedCards(false)
			setIsShowingNewSemiLimitedCards(false)

			setIsShowingRemovedCards(false)

			setTimeout(() => {
				handleFetch(`${NAME_maps_ENDPOINT['banListInstanceUrl']}${selectedBanList}`, props.history, (resultJson) => {
					setForbidden(resultJson.bannedCards.forbidden)
					setLimited(resultJson.bannedCards.limited)
					setSemiLimited(resultJson.bannedCards.semiLimited)

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
						<CardDetail key={999} fullDetails cardID={chosenCard.cardID} cardName={chosenCard.cardName} monsterType={chosenCard.monsterType} cardColor={chosenCard.cardColor} cardEffect={chosenCard.cardEffect} cardClicked={props.cardClicked} monsterAtk={chosenCard.monsterAttack} monsterDef={chosenCard.monsterDefense} />
						: undefined
				}
			</CardDialog>

			<BanContentParent style={ (isSettingUpDates)? {display: 'none'}: {display: 'block' }  } >
				<ExpansionPanel elevation={0}  >
					<BanDatesExpansionSummary  style={{padding: '0rem'}} expandIcon={<ExpandMoreIcon />}>
						<Chip color='primary' label={getCurrentBanListDate(months, selectedBanList, banListStartDates)} icon={<DateRangeRoundedIcon />} />
					</BanDatesExpansionSummary>

					<BanDatesExpansionDetail style={{padding: '.5rem'}} unmountOnExit >
						<Grid container spacing={1} >
							{banListGrid}
						</Grid>
					</BanDatesExpansionDetail>
				</ExpansionPanel>

				<div style={{padding: '.75rem'}} >
					<Typography variant='h4'>
						List Stats
					</Typography>
					<List style={{ width: '100%', maxWidth: '400px' }}
						component="nav"
						aria-labelledby="nested-list-subheader">
						<ListStatItem >
							<ListItemText primary="Total Cards" secondary={forbidden.length + limited.length + semiLimited.length} />
						</ListStatItem>

						<ListStatItem button onClick={showNewCards}>
							<ListItemText primary="Newly Added (Compared To Previous)" />
								{isShowingNewCards ? <ExpandLess /> : <ExpandMore />}
						</ListStatItem>

						<Collapse in={isShowingNewCards} timeout="auto" unmountOnExit>
							<List component="div" disablePadding>
								<ListStatItem button onClick={showNewForbiddenCards} style={{paddingLeft: '2.5rem'}}  >
									<ListItemText primary="Forbidden" secondary={newForbiddenCards.length} />
									{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
								</ListStatItem>
								<Collapse in={isShowingNewForbiddenCards} timeout="auto" unmountOnExit>
									<List component="div" disablePadding>
										{newForbiddenCardsList}
									</List>
								</Collapse>

								<ListStatItem button onClick={showNewLimitedCards} style={{paddingLeft: '2.5rem'}}  >
									<ListItemText primary="Limited" secondary={newLimitedCards.length} />
									{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
								</ListStatItem>
								<Collapse in={isShowingNewLimitedCards} timeout="auto" unmountOnExit>
									<List component="div" disablePadding>
										{newLimitedCardsList}
									</List>
								</Collapse>

								<ListStatItem button onClick={showNewSemiLimitedCards} style={{paddingLeft: '2.5rem'}}  >
									<ListItemText primary="Semi-Limited" secondary={newSemiLimitedCards.length} />
									{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
								</ListStatItem>
								<Collapse in={isShowingNewSemiLimitedCards} timeout="auto" unmountOnExit>
									<List component="div" disablePadding>
										{newSemiLimitedCardsList}
									</List>
								</Collapse>
							</List>
						</Collapse>

						<ListStatItem button onClick={showRemovedCards}>
							<ListItemText primary="Removed (Compared To Previous)" />
								{isShowingRemovedCards ? <ExpandLess /> : <ExpandMore />}
						</ListStatItem>
						<Collapse in={isShowingRemovedCards} timeout="auto" unmountOnExit>
							<List component="div" disablePadding>
								{removedCardsList}
							</List>
						</Collapse>

					</List>
				</div>
			</BanContentParent>


			<BanContentParent style={ (isSettingUpDates)? {display: 'none'}: {display: 'block', paddingTop: '0rem' }  } >
				<TabbedView
					numForbidden={forbidden.length} numLimited={limited.length} numSemiLimited={semiLimited.length}
					forbiddenContent={<BanListSection sectionName={'Forbidden'}
					sectionExplanation={"Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format"}
					sectionExplanationBackground='#ff4557' cards={forbidden} newCards={newForbiddenCards} isDataLoaded={isDataLoaded}
					cardClicked={(cardID) => setChosenCardID(cardID)} />}

					limitedContent={<BanListSection sectionName={'Limited'}
					sectionExplanation="Limited cards can be included in Deck/Side deck - max 1"
					sectionExplanationBackground='#ff6c12' cards={limited} newCards={newLimitedCards} isDataLoaded={isDataLoaded}
					cardClicked={(cardID) => setChosenCardID(cardID)} />}

					semiLimitedContent={<BanListSection sectionName={'Semi-Limited'} sectionExplanation="Semi-Limited cards can be included in Deck/Side deck - max 2"
					sectionExplanationBackground='#f0c620' cards={semiLimited} newCards={newSemiLimitedCards} isDataLoaded={isDataLoaded}
					cardClicked={(cardID) => setChosenCardID(cardID)} />}
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
			const removedCardsList = []
			if (json != null)
			{
				for (let card of json.removedCards)
				{
					handleFetchCardInfo(card.id, (cardResult) => {
						removedCardsList.push(
							<ListStatItem key={card.id} button onClick={ () => setChosenCardID(card.id) } style={{paddingLeft: '3rem'}}  >
								<ListItemText primary={cardResult.cardName} />
							</ListStatItem>)
					})
				}
				setRemovedCardsList(removedCardsList)
			}
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
				const newForbiddenCardsList = []
				const newLimitedCardsList = []
				const newSemiLimitedCardsList = []

				for (let card of json.newCards.forbidden)
				{
					handleFetchCardInfo(card.id, (cardResult) => {
						card.name = cardResult.cardName
						newForbiddenCardsList.push(
							<ListStatItem key={card.id} button onClick={ () => setChosenCardID(card.id) } style={{paddingLeft: '3rem'}}  >
								<ListItemText primary={card.name} />
							</ListStatItem>)
					})
				}
				setNewForbiddenCards(json.newCards.forbidden)
				setNewForbiddenCardsList(newForbiddenCardsList)

				for (let card of json.newCards.limited)
				{
					handleFetchCardInfo(card.id, (cardResult) => {
						card.name = cardResult.cardName
						newLimitedCardsList.push(
							<ListStatItem key={card.id} button onClick={ () => setChosenCardID(card.id) } style={{paddingLeft: '3rem'}}  >
								<ListItemText primary={card.name} />
							</ListStatItem>)
					})
				}
				setNewLimitedCards(json.newCards.limited)
				setNewLimitedCardsList(newLimitedCardsList)

				for (let card of json.newCards.semiLimited)
				{
					handleFetchCardInfo(card.id, (cardResult) => {
						card.name = cardResult.cardName
						newSemiLimitedCardsList.push(
							<ListStatItem key={card.id} button onClick={ () => setChosenCardID(card.id) } style={{paddingLeft: '3rem'}}  >
								<ListItemText primary={card.name} />
							</ListStatItem>)
					})
				}
				setNewSemiLimitedCards(json.newCards.semiLimited)
				setNewSemiLimitedCardsList(newSemiLimitedCardsList)
			}
			setIsFetchingNewCards(false)
		})
	}
}

const getCurrentBanListDate = (months, selectedBanList, banListStartDates) =>
{
	const banListPos = banListStartDates.findIndex(item => {
		if (item === selectedBanList)	return true

		return false
	})

	switch (banListPos) {
		case 0:
			return getDateString(months, new Date(selectedBanList)) + " - Present"
		default:
			return getDateString(months, new Date(selectedBanList)) + " - " + getDateString(months, new Date(banListStartDates[banListPos - 1]))
	}

}

const getDateString = (months, date) => `${months[date.getMonth()]} ${date.getDate() + 1}, ${date.getFullYear()}`

export default BanList