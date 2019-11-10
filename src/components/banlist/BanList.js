import React, { useState, useEffect } from 'react'

import { Typography, Dialog, Paper } from '@material-ui/core';

import Grid from '@material-ui/core/Grid'

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, CircularProgress } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Button from '@material-ui/core/Button'

import CardDetail from '../card/CardDetail'

import styled from 'styled-components'

import NAME_maps_ENDPOINT from '../../helper/YgoApi.js'


/*
	Custom Components
*/
import BanListSection from './BanListSection'
import BreadCrumb from '../Breadcrumb.js'
import TabbedView from './TabbedView'
import { handleFetch } from '../../helper/FetchHandler'

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
		// eslint-disable-next-line
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
		// eslint-disable-next-line
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

				setFetchingBanList(false)
			})
		}
		// eslint-disable-next-line
	}, [selectedBanList])

	useEffect(() => {
		if (chosenCardID !== '')
		{
			handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}${chosenCardID}`, props.history, (resultJson) => {
				setChosenCard(resultJson)
				setShowingCardDetail(true)
			})
		}
		// eslint-disable-next-line
	}, [chosenCardID])

	useEffect(() => {
		if (showingCardDetail === false) setChosenCardID('')
	}, [showingCardDetail])

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


	return (
		<div style={(initLoad) ? { 'display': 'none' }: {'display': 'block'}} >
			<br />
			<BreadCrumb crumbs={['Home', 'Ban List']} />
			<br />

			<CardDialog open={showingCardDetail} keepMounted onClose={() => setShowingCardDetail(false)} >
				{
					(showingCardDetail) ?
						<CardDetail key={999} fullDetails cardID={chosenCard.cardID} cardName={chosenCard.cardName} monsterType={chosenCard.monsterType} cardColor={chosenCard.cardColor} cardEffect={chosenCard.cardEffect} cardClicked={props.cardClicked} monsterAtk={chosenCard.monsterAtk} monsterDef={chosenCard.monsterDef} />
						: <CircularProgress />
				}
			</CardDialog>

			<Paper>
				<ExpansionPanel elevation={0} style={{ marginTop: '10px', paddingTop: '15px', paddingBottom: '15px'  }}>
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
				<TabbedView
					content={
						[
							<BanListSection sectionName={'Forbidden'} sectionExplanation={"Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format"} cards={forbidden} fetchingBanList={fetchingBanList} cardClicked={(cardID) => setChosenCardID(cardID)} />,
							<BanListSection sectionName={'Limited'} sectionExplanation={"Limited cards can be included in Deck/Side deck - max 1"} cards={limited} fetchingBanList={fetchingBanList} cardClicked={(cardID) => setChosenCardID(cardID)} />,
							<BanListSection sectionName={'Semi-Limited'} sectionExplanation={"Semi-Limited cards can be included in Deck/Side deck - max 2"} cards={semiLimited} fetchingBanList={fetchingBanList} cardClicked={(cardID) => setChosenCardID(cardID)} />
						]
					}
				/>
			</Paper>
		</div>
	)
}

let getDateString = (months, date) => `${months[date.getMonth()]} ${date.getDate() + 1}, ${date.getFullYear()}`

export default BanList