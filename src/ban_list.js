import React, { Component } from 'react'

import CardDetail from './card_detail.js'
import BreadCrumb from './breadcrumb.js'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'

import PropTypes from 'prop-types'


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
	}
}

class BanList extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			cardsDetail: []
		}

		let url = "http://localhost:8080/ban_list"

		fetch(url)
		.then((data) => data.json())
		.then((results) =>
		{
			let cards = results.cards
			let details = []

			console.log(cards)

			cards.forEach((card, ind) =>
			{
				details.push(<CardDetail key={ind} cardName={card.cardName} cardInfo={card.cardInfo} cardEffect={card.cardEffect} />)
			})

			this.setState({cardsDetail: details})

		})

	}

		render()
		{
			const { classes } = this.props
			return (
				<div>
					<BreadCrumb crumbs={['Home', 'Ban List']} />
					<Typography variant='h6' className={classes.banedText} >Forbidden</Typography>
					{this.state.cardsDetail}
					<Typography variant='h6' className={classes.limitedText} >Limited</Typography>
					{this.state.cardsDetail}
					<Typography variant='h6' className={classes.semiLimitedText} >Semi-Limited</Typography>
					{this.state.cardsDetail}
				</div>
			)
		}
}


BanList.propTypes = {
	classes: PropTypes.object.isRequired
}
export default withStyles(styles)(BanList)