import React from 'react'

import { Typography, Box, Card, CardContent} from '@material-ui/core'
import styled from 'styled-components';

import cardStyles from './CardDetailStyle'


const CardNameComponent = styled(Typography)`
	&& {
		font-weight: 500;
		text-transform: uppercase;
		margin-bottom: .415rem;
	}
`

const MonsterTypeComponent = styled(Typography)`
	&&
	{
		font-weight: 600;

		@media screen and (min-width: 0px)
		{
			margin-bottom: .35rem;
		}

		@media screen and (min-width: 500px)
		{
			margin-bottom: .35rem;
		}
	}
`

const MonsterAtkDefComponent = styled(Typography)`
	&&
	{
		text-align: right;
	}
`

const CardIDComponent = styled(Typography)`
	&& {
		color: #fff;
		margin-top: .25rem;
	}
`


export default function CardDetail(props)
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
		padding: .52rem !important;
		background: ${cardStyles[cardColor].background};
		color: ${cardStyles[cardColor].color};
	`
	const CardDescriptionComponent = styled(Box)`
		padding: .445rem;
		background: ${cardStyles[cardColorSummary].background};
		color: ${cardStyles[cardColorSummary].color};
	`

	const CardEffectComponent = (props.fullDetails) ?
		styled(Typography)`
			&&
			{
				white-space: pre-wrap;
				margin-bottom: .35rem;
			}
		`
		: styled(Typography)`
			&&
			{
				white-space: pre-wrap;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		`


	return (
		<YGOCard onClick={cardClickedCallBack} >
			<CardContentComponent >
				<CardNameComponent variant='subtitle2'noWrap={true} >{props.cardName}</CardNameComponent>
				<CardDescriptionComponent >
					{
						(props.cardColor === 'Spell' || props.cardColor === 'Trap') ?
							undefined :
							<MonsterTypeComponent variant='body1' noWrap={true} >[ {props.monsterType} ]</MonsterTypeComponent>
					}

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
							{props.cardID} &nbsp;&nbsp; First Edition
						</CardIDComponent>
						: undefined
				}
			</CardContentComponent>
		</YGOCard>
	)
}
