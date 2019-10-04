import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/styles'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'

import cardStyles from './card_detail_styles'

function CardDetail(props)
{
	const { classes } = props

	return (
		<Grid item
		xs={12}
		sm={6}
		md={3}
		lg={2}
		xl={2} >
			<Card onClick={() => props.cardClicked(props.cardID)} >
				<CardContent className={classes[props.cardColor.toLowerCase()]}>
					<Box className={classes.cardTop}>
						<Typography variant='subtitle1' noWrap={true} >{props.cardName}</Typography>
					</Box>
					<Box className={classes[`${props.cardColor.toLowerCase()}Summary`]} >
						<Typography variant='body2' className={classes.monsterType} noWrap={true} >{props.monsterType}</Typography>
						<Typography variant='body2' className={classes.cardText} >{props.cardEffect}</Typography>
					</Box>
				</CardContent>
			</Card>
		</Grid>
	)
}

CardDetail.propTypes = {
	classes: PropTypes.object.isRequired
}
export default withStyles(cardStyles)(CardDetail)
