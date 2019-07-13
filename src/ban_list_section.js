import React, { Component } from 'react'

import CardDetail from './card_detail.js'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/styles'

import PropTypes from 'prop-types'

import equal from 'fast-deep-equal'

import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip'

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
			let cardDetails = new Map()

			this.props.cards.forEach((card, ind) => {
				if (cardDetails[card.cardColor.toLowerCase()] === undefined)
				{
					cardDetails[card.cardColor.toLowerCase()] = []
				}
				cardDetails[card.cardColor.toLowerCase()].push(<CardDetail key={ind} cardName={card.cardName} monsterType={card.monsterType} cardColor={card.cardColor} cardEffect={card.cardEffect} />)
			})

			let grid = []
			let cardOrder = ['normal', 'effect', 'ritual', 'fusion', 'synchro', 'xyz', 'pendulum', 'link', 'spell', 'trap']
			for (let cardType of cardOrder)
			{
				if (cardType in cardDetails)
				{
					grid.push(
						<div key={cardType} >
						<Grid container spacing={2} >
							{cardDetails[cardType]}
						</Grid>
						<br />
						</div>
					)
				}
			}

			this.setState({ cardsDetail: cardDetails, grid: grid })
		}
	}

	render()
	{
		const { classes } = this.props

		return(
			<div>
				<Grid container className={classes[this.state.section]} >
					<Grid item>
						<Typography variant='subtitle1' >{this.props.sectionName}</Typography>
					</Grid>
					<Grid item>
						<Tooltip title={this.props.sectionExplanation} placement="top-start">
							<Help />
						</Tooltip>
					</Grid>
				</Grid>
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