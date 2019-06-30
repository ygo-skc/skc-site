import React, { Component } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'
import { blue } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/styles'

import PropTypes from 'prop-types'

const styles = {
	linkCard: {
		background: 'linear-gradient(45deg, #1e88e5 30%, #1565c0 90%)'
	}
}

class CardDetail extends Component
{
	render()
	{
		const { classes } = this.props
		return(
			<Card>
				<CardContent className={classes.linkCard}>
					<Typography variant='subtitle1'>{this.props.cardName}</Typography>
					<Typography variant='subtitle2'>{this.props.cardInfo}</Typography>
					<Typography variant='body2'>{this.props.cardEffect}</Typography>
				</CardContent>
			</Card>
		)
	}
}

CardDetail.propTypes = {
	classes: PropTypes.object.isRequired
}
export default withStyles(styles)(CardDetail)
