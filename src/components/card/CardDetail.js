import React from 'react'

import { Typography, Box, Card, CardContent} from '@material-ui/core'
import styled from 'styled-components';

import cardStyles from './CardDetailStyle'

function CardDetail(props)
{
	const cardColor = props.cardColor.toLowerCase()
	const cardColorSummary = `${props.cardColor.toLowerCase()}Summary`
	const cardClickedCallBack = (props.cardClicked) ? function () {props.cardClicked(props.cardID)} : undefined

	let curser = 'pointer'
	if (cardClickedCallBack === undefined)	curser = ''


	const YGOCard = styled(Card)`
	cursor: ${curser};
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
		&& {
			font-weight: 500;
		}
		text-transform: uppercase;
	`
	const MonsterTypeComponent = styled(Typography)`
	`
	const CardEffectComponent = (props.fullDetails) ?
		styled(Typography)`
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
		color: #fff;
		margin-top: 3px !important;
	`

	return (
		<YGOCard onClick={cardClickedCallBack} >
			<CardContentComponent >
				<CardNameComponent variant='subtitle1' style={{marginBottom: '3px'}} noWrap={true} >{props.cardName}</CardNameComponent>
				<CardDescriptionComponent >
					<MonsterTypeComponent variant='subtitle2' noWrap={true} >{props.monsterType}</MonsterTypeComponent>
					<CardEffectComponent variant='body1'>{props.cardEffect}</CardEffectComponent>
					{
						(props.cardColor === 'Spell' || props.cardColor === 'Trap' || props.cardColor === 'err' ) ?
							undefined :
							(props.fullDetails) ?
								<MonsterAtkDefComponent>
									{props.monsterAtk} / {props.monsterDef}
								</MonsterAtkDefComponent> :
								undefined
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
