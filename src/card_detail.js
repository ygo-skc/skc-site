import React, { Component } from 'react'

import 'typeface-roboto'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/styles'

import PropTypes from 'prop-types'

import { blue, teal, pink, orange, deepPurple, grey } from '@material-ui/core/colors'
import Box from '@material-ui/core/Box'

const styles = {
	effect: {
		background: `linear-gradient(45deg, ${orange[600]} 30%, ${orange[800]} 90%)`,
		color: 'f5f5f5',
	},
	effectSummary: {
		background: orange[400],
		padding: '10',
		color: 'black',
		lineHeight: '3'
	},
	fusion: {
		background: `linear-gradient(180deg, ${deepPurple[300]} 30%, ${deepPurple[400]} 90%)`,
		color: 'f5f5f5',
	},
	fusionSummary: {
		background: deepPurple[100],
		padding: '10',
		color: 'black'
	},
	synchro: {
		background: `linear-gradient(180deg, ${grey[200]} 30%, ${grey[300]} 90%)`,
		color: 'black',
	},
	synchroSummary: {
		background: grey[100],
		padding: '10',
		color: 'black'
	},
	xyz: {
		background: `linear-gradient(180deg, ${grey[800]} 30%, ${grey[900]} 90%)`,
		color: 'f5f5f5',
	},
	xyzSummary: {
		background: grey[600],
		padding: '10',
		color: 'white'
	},
	pendulum: {
		background: `linear-gradient(180deg, ${orange[600]} 30%, ${teal['A700']} 90%)`,
		color: 'f5f5f5',
	},
	pendulumSummary: {
		background: blue[100],
		padding: '10',
		color: 'black'
	},
	link: {
		background: `linear-gradient(45deg, ${blue[500]} 30%, ${blue[700]} 90%)`,
		color: 'f5f5f5',
	},
	linkSummary: {
		background: blue[100],
		padding: '10',
		color: 'black'
	},
	spell: {
		background: `linear-gradient(45deg, ${teal['A700']} 30%, ${teal[300]} 90%)`,
		color: 'f5f5f5',
	},
	spellSummary: {
		background: teal[100],
		padding: '10',
		color: 'black'
	},
	trap: {
		background: `linear-gradient(45deg, ${pink[500]} 30%, ${pink[700]} 90%)`,
		color: 'f5f5f5',
	},
	trapSummary: {
		background: pink[100],
		padding: '10',
		color: 'black'
	},
	cardTop: {
		marginBottom: '15'
	}
}

class CardDetail extends Component
{
	constructor()
	{
		super()
	}

	render()
	{
		const { classes } = this.props
		return (
			<Grid item xs={2} >
				<Card>
					<CardContent className={classes[this.props.cardColor.toLowerCase()]}>
						<Box className={classes.cardTop}>
							<Typography variant='subtitle2' >{this.props.cardName}</Typography>
						</Box>
						<Box className={classes[`${this.props.cardColor.toLowerCase()}Summary`]} >
							<Typography variant='body1'>{this.props.monsterType}</Typography>
								<Typography variant='body2' noWrap={true} component='p' >{this.props.cardEffect}</Typography>
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
