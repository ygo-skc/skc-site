import React, { Component } from 'react'

import 'typeface-roboto'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/styles'

import PropTypes from 'prop-types'

import { blue, teal, pink, orange, deepPurple, grey, yellow } from '@material-ui/core/colors'
import Box from '@material-ui/core/Box'

import Tooltip from '@material-ui/core/Tooltip'

const styles = {
	monsterType: {
		fontWeight: 'bold'
	},
	normal: {
		background: `linear-gradient(45deg, ${yellow[600]} 30%, ${yellow[800]} 90%)`,
		color: 'black',
	},
	normalSummary: {
		background: yellow[500],
		padding: '10',
		color: 'black',
		lineHeight: '3'
	},
	effect: {
		background: `linear-gradient(45deg, ${orange[600]} 30%, ${orange[800]} 90%)`,
		color: 'f5f5f5',
	},
	effectSummary: {
		background: orange[500],
		padding: '10',
		color: 'f5f5f5',
		lineHeight: '3'
	},
	ritual: {
		background: `linear-gradient(45deg, ${blue[500]} 30%, ${blue[700]} 90%)`,
		color: 'f5f5f5',
	},
	ritualSummary: {
		background: blue[100],
		padding: '10',
		color: 'black'
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
		background: `linear-gradient(45deg, ${blue[700]} 30%, ${blue[800]} 90%)`,
		color: 'f5f5f5',
	},
	linkSummary: {
		background: grey[100],
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
		marginBottom: '5'
	},
	cardText: {
		'display': '-webkit-box',
		'-webkit-line-clamp': '3',
			'-webkit-box-orient': 'vertical',
			'overflow': 'hidden'
	},
	tooltip: {
		'tooltip': {
			fontSize: '2000'
		}
	}
}




class CardDetail extends Component
{
	render()
	{
		const { classes } = this.props

		return (
			<Grid item xs={2} >
				<Card>
					<CardContent className={classes[this.props.cardColor.toLowerCase()]}>
						<Box className={classes.cardTop}>
							<Typography variant='subtitle1' noWrap={true} >{this.props.cardName}</Typography>
						</Box>
						<Box className={classes[`${this.props.cardColor.toLowerCase()}Summary`]} >
							<Typography variant='body2' className={classes.monsterType} noWrap={true} >{this.props.monsterType}</Typography>
							<Tooltip title={this.props.cardEffect} aria-label="Add" className={classes.tooltip} >
								<Typography variant='body2' className={classes.cardText} >{this.props.cardEffect}</Typography>
							</Tooltip>
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
