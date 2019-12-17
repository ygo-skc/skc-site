import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Typography, Box, Grid, CircularProgress } from '@material-ui/core'

import CardDetail from '../card/CardDetail.js'



const cardDisplayOrder = ['normal', 'effect', 'ritual', 'fusion', 'synchro', 'xyz', 'pendulum-normal', 'pendulum-effect', 'link', 'spell', 'trap']
const cardSectionTextColors = {
	'normal': 'rgba(249, 160, 16, 1)'
	, 'effect': 'rgba(248, 87, 0, 1)'
	, 'ritual': 'rgba(25, 118, 210, 0.66)'
	, 'fusion': 'rgba(131, 93, 196, 1)'
	, 'synchro': 'rgba(139, 139, 139, 0.91)'
	, 'xyz': 'rgba(33, 33, 33, 0.71)'
	, 'link': 'rgba(21, 101, 192, 0.8)'
	, 'spell': 'rgba(0, 146, 126, 0.85)'
	, 'trap': 'rgba(173, 20, 87, 0.78)'
}

const CenteredContent = styled(Box)`
	text-align: center;
`


export default function BanListSection(props)
{
	const [cardTypeContentGrid, setCardTypeContentGrid] = useState([])
	const [areCardsRendered, setAreCardsRendered] = useState(false)

	const SectionInfoText = styled(Typography)`
		&& {
			font-weight: 500;
			margin-top: .75rem;
			margin-bottom: 2.75rem;
			padding: .9rem;
			background: ${props.sectionExplanationBackground};
			border-radius: .85rem;
			display: -webkit-inline-flex;
			color: white;
		}
	`

	function isNewCard(cardID)
	{
		if (props.newCards !== undefined && cardID !== undefined)
		{
			const isNew = props.newCards.find( currentItem => {
				if (currentItem.id === cardID)	return true
				return false
			}, cardID)
			return (isNew === undefined)? false: true
		}

		return false
	}

	useEffect(() => {
		setAreCardsRendered(false)
		if ( props.isDataLoaded )
		{
			const cardDetailsMap = new Map()

			props.cards.forEach((card, ind) => {
				const cardColor = card.cardColor.toLowerCase()
				if (!cardDetailsMap.has(cardColor))	cardDetailsMap.set(cardColor, [])


				cardDetailsMap.get(cardColor).push(
					<Grid key={ind} item xs={12} sm={4} md={3} lg={2} xl={2} >
						<CardDetail key={ind} cardID={card.cardID} cardName={card.cardName} monsterType={card.monsterType}
						cardColor={card.cardColor} cardEffect={card.cardEffect} cardClicked={props.cardClicked}
						fullDetails={false} isNew={ isNewCard(card.cardID) }
						/>
					</Grid>
				)
			})


			let cardTypeContentGrid = cardDisplayOrder.map(( cardType ) => {
				if (cardDetailsMap.has(cardType)) {
					return	<div key={cardType} >
								<Typography variant='subtitle1' style={{ marginBottom: '10px', textTransform: 'uppercase', color: cardSectionTextColors[cardType], letterSpacing: '.105rem' }} >
									{cardType}
								</Typography>
								<Grid container spacing={1} style={{marginBottom: '30px'}} >
									{cardDetailsMap.get(cardType)}
								</Grid>
							</div>
				}
				return null
			})

			setCardTypeContentGrid(cardTypeContentGrid)
			setAreCardsRendered(true)
		}
		// eslint-disable-next-line
	}, [props.isDataLoaded])



	return (
		<div>
			<CenteredContent>
				<SectionInfoText variant='h6' >
					{props.sectionExplanation}
				</SectionInfoText>
			</CenteredContent>

			{
				(areCardsRendered ?
					(	<div>
						{cardTypeContentGrid}
					</div>)
					: 	(<CenteredContent>
							<CircularProgress size={50} variant='indeterminate' thickness={3.6} disableShrink={true} />
						</CenteredContent>)
				)
			}
		</div>
	)
}