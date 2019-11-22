import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Typography, Box, Grid, CircularProgress, Divider } from '@material-ui/core'

import CardDetail from '../card/CardDetail.js'



const cardDisplayOrder = ['normal', 'effect', 'ritual', 'fusion', 'synchro', 'xyz', 'pendulum-normal', 'pendulum-effect', 'link', 'spell', 'trap']
const cardSectionTextColors = { 'normal': 'rgba(226, 142, 6, 0.76)', 'effect': 'rgba(216, 76, 0, 0.88)', 'ritual': 'rgba(25, 118, 210, 0.66)'
	, 'fusion': 'rgba(97, 59, 162, 0.88)', 'synchro': 'rgba(139, 139, 139, 0.91)', 'xyz': 'rgba(33, 33, 33, 0.71)', 'link': 'rgba(21, 101, 192, 0.8)'
	, 'spell': 'rgba(0, 146, 126, 0.85)', 'trap': 'rgba(173, 20, 87, 0.78)' }

const CenteredContent = styled(Box)`
	text-align: center;
`

const SectionInfoText = styled(Typography)`
	&& {
		margin-top: 10px;
		margin-bottom: 30px;
	}
`

export default function BanListSection(props)
{
	const [cardTypeContentGrid, setCardTypeContentGrid] = useState([])

	useEffect(() => {
		const cardDetailsMap = new Map()

		props.cards.forEach((card, ind) => {
			const cardColor = card.cardColor.toLowerCase()
			if (!cardDetailsMap.has(cardColor))	cardDetailsMap.set(cardColor, [])


			cardDetailsMap.get(cardColor).push(
				<Grid key={ind} item xs={12} sm={6} md={3} lg={2} xl={2} >
					<CardDetail key={ind} cardID={card.cardID} cardName={card.cardName} monsterType={card.monsterType} cardColor={card.cardColor}
						cardEffect={card.cardEffect} cardClicked={props.cardClicked} fullDetails={false} />
				</Grid>
			)
		})


		let cardTypeContentGrid = cardDisplayOrder.map(( cardType ) => {
			if (cardDetailsMap.has(cardType)) {
				return	<div key={cardType} >
							<Typography variant='subtitle1' style={{ fontWeight: 'bold', textTransform: 'uppercase', color: cardSectionTextColors[cardType] }} >
								{cardType}
							</Typography>
							<Grid container spacing={1} style={{marginBottom: '20px'}} >
								{cardDetailsMap.get(cardType)}
							</Grid>
							<Divider style={{marginBottom: '20px'}} variant='middle' />
						</div>
			}
			return null
		})

		setCardTypeContentGrid(cardTypeContentGrid)
		// eslint-disable-next-line
	}, [props.cards])


	return (
		(props.fetchingBanList ?
			(	<CenteredContent>
					<CircularProgress size={50} variant='indeterminate' thickness={3.6} disableShrink={true} />
				</CenteredContent>)
			: (	<Box>
					<SectionInfoText variant='h6' >
						{props.sectionExplanation}
					</SectionInfoText>
					<Box>
						{cardTypeContentGrid}
					</Box>
				</Box>)
		)
	)
}