import React, { useState, useEffect } from 'react'

import { Dialog, Paper, Chip } from '@material-ui/core'
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded'

import Grid from '@material-ui/core/Grid'

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, CircularProgress } from '@material-ui/core';
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
		let banListGrid1 = []
		banListStartDates.forEach((item, ind) => {
			banListGrid1.push(<Grid key={ind} item xs={6} sm={4} md={2} lg={2} xl={1} >
				<Chip id={ind} color='secondary' variant={ (item === selectedBanList)? 'default' : 'outlined' } label={getDateString(months, new Date(item))}
					icon={<DateRangeRoundedIcon />}
					onClick={ (button) => setSelectedBanList(banListStartDates[button.currentTarget.id]) } />
			</Grid>
			)
		})

		setBanListGrid(banListGrid1)
		// eslint-disable-next-line
	}, [selectedBanList])


	useEffect(() => {
		if (selectedBanList !== '')
		{
			setIsSettingUpDates(false)
			testing()

			setIsFetchingBanList(true)
			handleFetch(`${NAME_maps_ENDPOINT['banListInstanceUrl']}${selectedBanList}`, props.history, (resultJson) => {
				setForbidden(resultJson.bannedCards.forbidden)
				setLimited(resultJson.bannedCards.limited)
				setSemiLimited(resultJson.bannedCards.semiLimited)

				setIsFetchingBanList(false)
			})
		}
		// eslint-disable-next-line
	}, [selectedBanList])


	useEffect(() => {
		if (chosenCardID !== undefined)
		{
			handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}${chosenCardID}`, props.history, (resultJson) => {
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

			<CardDialog open={showingCardDetail} keepMounted onClose={() => setShowingCardDetail(false)} >
				{
					(showingCardDetail) ?
						<CardDetail key={999} fullDetails cardID={chosenCard.cardID} cardName={chosenCard.cardName} monsterType={chosenCard.monsterType} cardColor={chosenCard.cardColor} cardEffect={chosenCard.cardEffect} cardClicked={props.cardClicked} monsterAtk={chosenCard.monsterAttack} monsterDef={chosenCard.monsterDefense} />
						: <CircularProgress />
				}
			</CardDialog>

			<Paper style={ (isSettingUpDates)? {display: 'none'}: {display: 'block' }  } >
				<ExpansionPanel elevation={0}>
					<BanDatesExpansionSummary expandIcon={<ExpandMoreIcon />}>
						<Chip color='primary' label={getCurrentBanListDate(months, selectedBanList, banListStartDates)} icon={<DateRangeRoundedIcon />} />
					</BanDatesExpansionSummary>

					<BanDatesExpansionDetail>
						<Grid container spacing={1} >
							{banListGrid}
						</Grid>
					</BanDatesExpansionDetail>
				</ExpansionPanel>

				<TabbedView
					numForbidden={forbidden.length} numLimited={limited.length} numSemiLimited={semiLimited.length}
					content={
						[
							<BanListSection sectionName={'Forbidden'}
							sectionExplanation={"Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format"}
							sectionExplanationBackground='#ff4557' cards={forbidden} newCards={newForbiddenCards} isDataLoaded={isDataLoaded}
							cardClicked={(cardID) => setChosenCardID(cardID)} />,
							<BanListSection sectionName={'Limited'}
							sectionExplanation="Limited cards can be included in Deck/Side deck - max 1"
							sectionExplanationBackground='#ff6c12' cards={limited} newCards={newLimitedCards} isDataLoaded={isDataLoaded}
							cardClicked={(cardID) => setChosenCardID(cardID)} />,
							<BanListSection sectionName={'Semi-Limited'} sectionExplanation="Semi-Limited cards can be included in Deck/Side deck - max 2"
							sectionExplanationBackground='#f0c620' cards={semiLimited} newCards={newSemiLimitedCards} isDataLoaded={isDataLoaded}
							cardClicked={(cardID) => setChosenCardID(cardID)} />
						]
					}
				/>
			</Paper>
		</MainContentContainer>
	)


	function testing()
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