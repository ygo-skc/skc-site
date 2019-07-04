import React, { Component } from 'react'

//import 'typeface-roboto'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/styles'

import PropTypes from 'prop-types'

import { blue } from '@material-ui/core/colors'
import Box from '@material-ui/core/Box'

const styles = {
	linkCard: {
		background: 'linear-gradient(45deg, #1e88e5 30%, #1565c0 90%)',
		color: 'f5f5f5'
	},
	linkCardSummary: {
		background: blue[400],
		padding: '10'
	},
	cardTop: {
		marginBottom: '15'
	}
}

class CardDetail extends Component
{
	render()
	{
		const { classes } = this.props
		return (
			<Grid item xs={4} >
				<Card>
					<CardContent className={classes.linkCard}>
						<Box className={classes.cardTop}>
							<Typography variant='subtitle1'>{this.props.cardName}</Typography>
						</Box>
						<Box className={classes.linkCardSummary} >
							<Typography variant='subtitle2'>{this.props.cardInfo}</Typography>
							<Typography variant='body2'>{this.props.cardEffect}</Typography>
						</Box>
					</CardContent>
				</Card>
			</Grid>
		)
	}
}

CardDetail.propTypes = {
	classes: PropTypes.object.isRequired
}
export default withStyles(styles)(CardDetail)
