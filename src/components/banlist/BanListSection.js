import React, { useState, useEffect } from 'react'

import CardDetail from '../card/CardDetail.js'

import { Typography, Box, Grid, CircularProgress, Badge } from '@material-ui/core'

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
					<CardDetail key={ind} cardID={card.cardID} cardName={card.cardName} monsterType={card.monsterType} cardColor={card.cardColor} cardEffect={card.cardEffect} cardClicked={props.cardClicked} />
				</Grid>
			)
		})

		let grid = []
		let cardOrder = ['normal', 'effect', 'ritual', 'fusion', 'synchro', 'xyz', 'pendulum-normal', 'pendulum-effect', 'link', 'spell', 'trap']
		for (let cardType of cardOrder) {
			if (cardType in cardDetails) {
				grid.push(
					<div key={cardType} >
						<Grid container spacing={1}  >
							{cardDetails[cardType]}
						</Grid>
						<br />
					</div>
				)
			}
		}

		setGrid(grid)
		// eslint-disable-next-line
	}, [props.cards])

	return (
		(props.fetchingBanList ?
			(<div style={{ textAlign: 'center' }}>
					<CircularProgress />
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