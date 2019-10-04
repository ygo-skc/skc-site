import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/styles'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'

import cardStyles from './card_detail_styles'

function CardDetail(props)
{
	const { classes } = props
	const cardBackgroundClassName = (props.cardColor) ? classes[props.cardColor.toLowerCase()] : undefined
	const cardDescriptionBackgroundClassName = (props.cardColor) ? classes[`${props.cardColor.toLowerCase()}Summary`] : undefined
	const cardClickedCallBack = (props.cardClicked) ? function () {props.cardClicked(props.cardID)} : undefined

	return (
		<Card onClick={cardClickedCallBack} >
			<CardContent className={cardBackgroundClassName}>
				<Box className={classes.cardTop}>
					<Typography variant='subtitle1' noWrap={true} >{props.cardName}</Typography>
				</Box>
				<Box className={cardDescriptionBackgroundClassName} >
					<Typography variant='body2' className={classes.monsterType} noWrap={true} >{props.monsterType}</Typography>
					<Typography variant='body2' className={(props.fullDetails) ? classes.baseText : classes.cardText} >{props.cardEffect}</Typography>
					{
						(props.cardColor === 'spell' || props.cardColor === 'trap' || !props.fullDetails ) ? undefined :
							<Typography className={classes.alignRight} >
								{props.monsterAtk} / {props.monsterDef}
							</Typography>
					}
				</Box>
				{
					(props.fullDetails) ?
						<Typography style={{ 'textAlign': 'right', 'color': '#fff' }}>
							{props.cardID}
						</Typography>
						: undefined
				}
			</CardContent>
		</Card>
	)
}

CardDetail.propTypes = {
	classes: PropTypes.object.isRequired
}
export default withStyles(cardStyles)(CardDetail)
