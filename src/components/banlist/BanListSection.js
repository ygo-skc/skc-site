import React, { useState, useEffect } from 'react'

import CardDetail from '../card/CardDetail.js'

import { Typography, Box, Grid, CircularProgress, Divider } from '@material-ui/core'

export default function BanListSection(props)
{
	const [grid, setGrid] = useState([])

	useEffect(() => {
		let cardDetails = new Map()

		props.cards.forEach((card, ind) => {
			if (cardDetails[card.cardColor.toLowerCase()] === undefined) {
				cardDetails[card.cardColor.toLowerCase()] = []
			}
			cardDetails[card.cardColor.toLowerCase()].push(
				<Grid item xs={12} sm={6} md={3} lg={2} xl={2} >
					<CardDetail key={ind} cardID={card.cardID} cardName={card.cardName} monsterType={card.monsterType} cardColor={card.cardColor} cardEffect={card.cardEffect} cardClicked={props.cardClicked} fullDetails={false} />
				</Grid>
			)
		})

		let cardOrder = ['normal', 'effect', 'ritual', 'fusion', 'synchro', 'xyz', 'pendulum-normal', 'pendulum-effect', 'link', 'spell', 'trap']
		let textColor = { 'normal': 'rgba(226, 142, 6, 0.76)', 'effect': 'rgba(216, 76, 0, 0.88)', 'ritual': 'rgba(25, 118, 210, 0.66)'
			, 'fusion': 'rgba(97, 59, 162, 0.88)', 'synchro': 'rgba(139, 139, 139, 0.91)', 'xyz': 'rgba(33, 33, 33, 0.71)', 'link': 'rgba(21, 101, 192, 0.8)'
			, 'spell': 'rgba(0, 146, 126, 0.85)', 'trap': 'rgba(173, 20, 87, 0.78)' }

		let grid = cardOrder.map(( cardType, ind ) => {
			if (cardType in cardDetails) {
				return	<div key={cardType} >
							<Typography variant='subtitle1' style={{ fontWeight: 'bold', textTransform: 'uppercase', color: textColor[cardType] }} >
								{cardType}
							</Typography>
							<Grid container spacing={1} style={{marginBottom: '20px'}} >
								{cardDetails[cardType]}
							</Grid>
							<Divider style={{marginBottom: '20px'}} variant='middle' />
						</div>
			}
		})
		for (let cardType of cardOrder) {

		}

		setGrid(grid)
		// eslint-disable-next-line
	}, [props.cards])

	return (
		(props.fetchingBanList ?
			(<div style={{ textAlign: 'center' }}>
					<CircularProgress size={50} variant='indeterminate' thickness={3.6} disableShrink={true} />
				</div>)
			: (<Box >
				<Typography variant='h6' style={{ marginTop: '10px', marginBottom: '30px' }} >{props.sectionExplanation}</Typography>

				<Box>
					{grid}
				</Box>
			</Box>)
		)
	)
}