import React, {memo} from 'react'

import { Typography, Box, Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Styled from 'styled-components'
import he from 'he'

import CardAssociation from './CardAssociation'
import AtkDef from './AtkDef'


const CardIDComponent = Styled(Typography)`
	&& {
		font-style: italic;
		color: inherit;
	}
`

const CardContentComponent = Styled(Paper)`
	&&
	{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 1rem;

		@media screen and (min-width: 0px)
		{
			padding: .69rem;
		}
	}
`

const CardNameComponent = Styled(Typography)`
	&& {
		margin-bottom: .25rem;
		text-align: center;
		text-transform: uppercase;
		flex: 1;
		color: inherit;
	},
`

const CardDescriptionComponent = Styled(Box)`
	&&
	{
		padding: .445rem;
		border-radius: .5rem;
	}
`

const MonsterTypeComponent = Styled(Typography)`
&&
{
	font-weight: 800;
	margin-bottom: .28rem;
	color: inherit;
}
`


const YGOCard = memo(( {cardName, cardColor, cardEffect, monsterType, cardAttribute, monsterAtk, monsterDef, monsterAssociation, cardID, fullDetails, effectMaxLineHeight, isLoading, className }) =>
{
	if (isLoading)
	{
		return(
			<Skeleton variant='rect' height='150' style={{ borderRadius: '.5rem' }} />
		)
	}

	const CardEffectComponent = (fullDetails) ?
		Styled(Typography)`
			&&
			{
				white-space: pre-wrap;
				color: inherit;
			}
		`
		: Styled(Typography)`
			&&
			{
				white-space: pre-wrap;
				display: -webkit-box;
				-webkit-line-clamp: ${effectMaxLineHeight};
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		`

	return(
		<CardContentComponent className={[className, `${cardColor}YgoCardParent`, 'YgoCardLightText'].join(' ')} >

			<div style={{ width: '100%', display: 'flex', marginBottom: '.5rem', whiteSpace: 'normal', color: 'inherit' }} >
				<CardNameComponent
					variant='subtitle1'
					noWrap={true}
					>
						{ cardName }
				</CardNameComponent>
			</div>

			<CardAssociation monsterAssociation={monsterAssociation} attribute={cardAttribute} />


			<CardDescriptionComponent
					className={[`${cardColor}YgoCardSummaryBox`, 'YgoCardDarkText'].join(' ')} >
				<MonsterTypeComponent
					variant='body1'
					noWrap={true} >
						{
							( cardColor === 'Spell' || cardColor === 'Trap' ) ? cardColor : monsterType
						}
				</MonsterTypeComponent>

				<CardEffectComponent
					variant='body2' >
						{ he.decode(cardEffect) }
				</CardEffectComponent>

				<div style={{display: 'flex', paddingTop: '.5rem',  alignItems: 'center'}} >
					{
						(fullDetails) ?
							<CardIDComponent variant='body2' >
								{cardID}
							</CardIDComponent>
							: undefined
					}
					{
						( cardColor === 'Spell' || cardColor === 'Trap' || cardColor === 'Err' ) ?
							undefined :
							(fullDetails) ? <AtkDef monsterAtk={monsterAtk} monsterDef={monsterDef} cardColor={cardColor} /> : undefined
					}
				</div>
			</CardDescriptionComponent>
		</CardContentComponent>
	)
}, (prevProps, newProps) => {
	if ( prevProps.cardName !== newProps.cardName || prevProps.isLoading !== newProps.isLoading )
		return false

	return true
})


export default YGOCard