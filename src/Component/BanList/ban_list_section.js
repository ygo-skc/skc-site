import React, { useState, useEffect } from 'react'

import CardDetail from '../Card/card_detail.js'

import { Typography, Box, Grid, CircularProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

import PropTypes from 'prop-types'

const styles = {
	banedText: {
		color: 'white',
		marginTop: '20',
		marginBottom: '15',
		padding: '20',
		background: 'linear-gradient(45deg, #ff1744 30%, #f50057 90%)',
	},
	limitedText: {
		color: 'white',
		marginTop: '20',
		marginBottom: '15',
		padding: '20',
		background: 'linear-gradient(45deg, #f57c00 30%, #ff1744 90%)',
	},
	semiLimitedText: {
		color: 'white',
		marginTop: '20',
		marginBottom: '15',
		padding: '20',
		background: 'linear-gradient(45deg, #ffab00 30%, #f57c00 90%)',
	},
}

export default function BanListSection(props)
{
	const [grid, setGrid] = useState([])
	const [section, setSection] = useState('')

	useEffect(() => {
		let section
		if (props.sectionName === 'Forbidden') section = 'banedText'
		else if (props.sectionName === 'Limited') section = 'limitedText'
		else section = 'semiLimitedText'

		setSection(section)
	}, [])

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
	}, [props.cards])

	return (
		(props.fetchingBanList ?
			(<div style={{ textAlign: 'center' }}>
					<CircularProgress />
				</div>)
			: (<Box >
				<Typography variant='h6' style={{ marginBottom: 15 }} >{props.sectionExplanation}</Typography>

				<Box>
					{grid}
				</Box>
			</Box>)
		)
	)
}