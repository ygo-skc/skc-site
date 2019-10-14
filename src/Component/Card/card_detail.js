import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'

import Box from '@material-ui/core/Box'

import styled from 'styled-components';

import cardStyles from './card_detail_styles'

function CardDetail(props)
{
	const cardColor = props.cardColor.toLowerCase()
	const cardColorSummary = `${props.cardColor.toLowerCase()}Summary`
	const cardClickedCallBack = (props.cardClicked) ? function () {props.cardClicked(props.cardID)} : undefined


	const YGOCard = styled(Card)`
		border-radius: 10px !important;
	`
	const CardContentComponent = styled(CardContent)`
		padding: 12px !important;
		background: ${cardStyles[cardColor].background};
		color: ${cardStyles[cardColor].color};
	`
	const CardDescriptionComponent = styled(Box)`
		padding: 10;
		background: ${cardStyles[cardColorSummary].background};
		color: ${cardStyles[cardColorSummary].color};
	`
	const CardNameComponent = styled(Typography)`
		margin-bottom: 5px;
	`
	const MonsterTypeComponent = styled(Typography)`
		font-weight: bold;
	`
	const CardEffectComponent = (props.fullDetails) ?
		styled(Typography)`
			padding-bottom: 5px;
			white-space: pre-wrap;
		`
		: styled(Typography)`
			white-space: pre-wrap;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		`
	const MonsterAtkDefComponent = styled(Typography)`
		text-align: right;
	`
	const CardIDComponent = styled(Typography)`
		text-align: right;
		color: #fff;
	`

	return (
		<YGOCard onClick={cardClickedCallBack} >
			<CardContentComponent >
				<CardNameComponent variant='subtitle1' noWrap={true} >{props.cardName}</CardNameComponent>
				<CardDescriptionComponent >
					<MonsterTypeComponent variant='body2' noWrap={true} >{props.monsterType}</MonsterTypeComponent>
					<CardEffectComponent variant='body2'>{props.cardEffect}</CardEffectComponent>
					{
						(props.cardColor === 'spell' || props.cardColor === 'trap' || !props.fullDetails ) ? undefined :
							<MonsterAtkDefComponent>
								{props.monsterAtk} / {props.monsterDef}
							</MonsterAtkDefComponent>
					}
				</CardDescriptionComponent>
				{
					(props.fullDetails) ?
						<CardIDComponent variant='body2' >
							{props.cardID}
						</CardIDComponent>
						: undefined
				}
			</CardContentComponent>
		</YGOCard>
	)
}

export default CardDetail
