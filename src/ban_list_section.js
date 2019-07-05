import React, { Component } from 'react'

import CardDetail from './card_detail.js'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/styles'

import PropTypes from 'prop-types'

import equal from 'fast-deep-equal'

const styles = {
	banedText: {
		color: 'white',
		marginTop: '15',
		marginBottom: '10',
		padding: '10',
		background: 'linear-gradient(45deg, #ff1744 30%, #f50057 90%)',
	},
	limitedText: {
		color: 'white',
		marginTop: '15',
		marginBottom: '10',
		padding: '10',
		background: 'linear-gradient(45deg, #f57c00 30%, #ff1744 90%)',
	},
	semiLimitedText: {
		color: 'white',
		marginTop: '15',
		marginBottom: '10',
		padding: '10',
		background: 'linear-gradient(45deg, #ffab00 30%, #f57c00 90%)',
	},
	banCardsRow: {
		marginLeft: '10',
		marginRight: '10'
	}
}

class BanListSection extends Component
{

	constructor(props) {
		super(props)

		let section
		if (this.props.sectionName === 'Forbidden')	section = 'banedText'
		else if (this.props.sectionName === 'Limited') section = 'limitedText'
		else	section = 'semiLimitedText'

		this.state = {
			cardsDetail: [],
			section: section
		}

	}

	componentDidUpdate(oldProps)
	{
		if (! equal(this.props.cards, oldProps.cards)){
			let cardDetails = {}

			this.props.cards.forEach((card, ind) => {
				if (cardDetails[card.cardColor.toLowerCase()] === undefined)
				{
					cardDetails[card.cardColor.toLowerCase()] = []
				}
				cardDetails[card.cardColor.toLowerCase()].push(<CardDetail key={ind} cardName={card.cardName} monsterType={card.monsterType} cardColor={card.cardColor} cardEffect={card.cardEffect} />)
			})

			console.log(cardDetails)

			let grid = []
			for (let key in cardDetails)
			{
				grid.push(
					<Grid container spacing={2} >
						{cardDetails[key]}
					</Grid>
				)
			}
			/*
			cardDetails.forEach((item) =>
			{
				grid.push(<Grid container spacing={2} >
					{item}
				</Grid>)
			})
			*/

			this.setState({ cardsDetail: cardDetails, grid: grid })
		}
	}

	render()
	{
		const { classes } = this.props

		return(
			<div>
				<Typography variant='h6' className={classes[this.state.section]} >{this.props.sectionName}</Typography>
				<Box className={classes.banCardsRow} >
					{this.state.grid}

				</Box>
			</div>
		)
	}
}

BanListSection.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BanListSection)