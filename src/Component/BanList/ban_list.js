import React, { useState, useEffect } from 'react'

import { Typography, Dialog } from '@material-ui/core';

import Grid from '@material-ui/core/Grid'

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Button from '@material-ui/core/Button'

import CardDetail from '../Card/card_detail'

import styled from 'styled-components'

import NAME_maps_ENDPOINT from '../../Helper/ygo_api.js'

import loading from '../../Img/loading.gif'


/*
	Custom Components
*/
import BanListSection from './ban_list_section'
import BreadCrumb from '../breadcrumb.js'
import TabbedView from './tabbed_view'
import { handleFetch } from '../../Helper/fetch_handler'

function BanList(props)
{
	const [banListsStartDates, setBanListsStartDates] = useState([])
	const [banListGrid, setBanListGrid] = useState([])
	const [selectedBanList, setSelectedBanList] = useState('')

	const [forbidden, setForbidden] = useState([])
	const [limited, setLimited] = useState([])
	const [semiLimited, setSemiLimited] = useState([])

	const [fetchingBanList, setFetchingBanList] = useState(false)
	const [initLoad, setInitLoad] = useState(true)

	const [showingCardDetail, setShowingCardDetail] = useState(false)
	const [chosenCardID, setChosenCardID] = useState('')
	const [chosenCard, setChosenCard] = useState('')

	const CardDialog = styled(Dialog)`
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

	useEffect(() => {
		handleFetch(NAME_maps_ENDPOINT['banListsUrl'], props.history, (resultJson) => {
			setBanListsStartDates(resultJson.banListStartDates)
			setSelectedBanList(resultJson.banListStartDates[0])
		})
	}, [])

	useEffect(() => {
		let banListGrid1 = []
		banListsStartDates.forEach((item, ind) => {
			banListGrid1.push(<Grid key={ind} item xs={6} sm={3} md={2} lg={1} xl={1} >
				<Button size='small' id={ind} onClick={(button) => setSelectedBanList(banListsStartDates[button.currentTarget.id])} >
					{getDateString(months, new Date(item))}
				</Button>
			</Grid>
			)
		})

		setBanListGrid(banListGrid1)
	}, [banListsStartDates])

	useEffect(() => {
		if (selectedBanList !== '')
		{
			setInitLoad(false)
			setFetchingBanList(true)

			handleFetch(`${NAME_maps_ENDPOINT['banListInstanceUrl']}${selectedBanList}`, props.history, (resultJson) => {
				setForbidden(resultJson.bannedCards.forbidden)
				setLimited(resultJson.bannedCards.limited)
				setSemiLimited(resultJson.bannedCards.semiLimited)

				setTimeout(() => setFetchingBanList(false), 300)
			})
		}
	}, [selectedBanList])

	useEffect(() => {
		if (chosenCardID !== '')
		{
			handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}${chosenCardID}`, props.history, (resultJson) => {
				setChosenCard(resultJson)
				setShowingCardDetail(true)
			})
		}
	}, [chosenCardID])

	useEffect(() => {
		if (showingCardDetail === false) setChosenCardID('')
	}, [showingCardDetail])

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


	return (
		<div style={(initLoad) ? { 'display': 'none' }: {'display': 'block'}} >
			<BreadCrumb crumbs={['Home', 'Ban List']} />

			<ExpansionPanel elevation={0} >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Typography style={{ flexBasis: '20%', flexShrink: 0 }} variant='h6' >Ban Lists:</Typography>
					<Typography variant='subtitle1' >
						Currently viewing ban list effective {getDateString(months, new Date(selectedBanList))}
					</Typography>
				</ExpansionPanelSummary>

				<ExpansionPanelDetails>
					<Grid container >
						{banListGrid}
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>

			<CardDialog open={showingCardDetail} keepMounted onClose={() => setShowingCardDetail(false)} >
				{
					(showingCardDetail) ?
						<CardDetail key={999} fullDetails cardID={chosenCard.cardID} cardName={chosenCard.cardName} monsterType={chosenCard.monsterType} cardColor={chosenCard.cardColor} cardEffect={chosenCard.cardEffect} cardClicked={props.cardClicked} monsterAtk={chosenCard.monsterAtk} monsterDef={chosenCard.monsterDef} />
						: undefined
				}
			</CardDialog>

			<TabbedView
				content={
					[
						<BanListSection sectionName={'Forbidden'} sectionExplanation={"Forbidden cards cannot be used in a duel in the Advanced Format."} cards={forbidden} fetchingBanList={fetchingBanList} cardClicked={(cardID) => setChosenCardID(cardID)} />,
						<BanListSection sectionName={'Limited'} sectionExplanation={"Below cards can only appear once in a  Main Deck or Side Deck."} cards={limited} fetchingBanList={fetchingBanList} cardClicked={(cardID) => setChosenCardID(cardID)} />,
						<BanListSection sectionName={'Semi-Limited'} sectionExplanation={"Below cards can only appear twice in a  Main Deck or Side Deck."} cards={semiLimited} fetchingBanList={fetchingBanList} cardClicked={(cardID) => setChosenCardID(cardID)} />
					]
				}
			/>
		</div>
	)
}

let getDateString = (months, date) => `${months[date.getMonth()]} ${date.getDate() + 1}, ${date.getFullYear()}`

export default BanList