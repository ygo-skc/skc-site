import React, {memo, lazy} from 'react'

import { Typography, Box, Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Styled from 'styled-components'
import he from 'he'

import CardAssociation from './CardAssociation'
import cardStyles from './YGOCardStyles'

const AtkDef = lazy( () => import('./AtkDef') )

const CardIDComponent = Styled(Typography)`
	&& {
		color: #fff;
		margin-top: .25rem;
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

	const cardColorLowerCase = cardColor.toLowerCase()

	const CardContentComponent = Styled(Paper)`
		&&
		{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			background: ${cardStyles[ `${cardColorLowerCase}Background` ]};

			@media screen and (min-width: 0px)
			{
				padding: .69rem;
			}
		}
	`

	const CardNameComponent = Styled(Typography)`
		&& {
			font-weight: 400;
			margin-bottom: .25rem;
			text-align: center;
			text-transform: uppercase;

			color: ${cardStyles[ `${cardColorLowerCase}Color` ]};
		},
	`

	const CardDescriptionComponent = Styled(Box)`
		&&
		{
			padding: .445rem;
			background: ${cardStyles[ `${cardColorLowerCase}SummaryBackground` ]};
			border-radius: .5rem;
		}
	`

	const CardEffectComponent = (fullDetails) ?
		Styled(Typography)`
			&&
			{
				white-space: pre-wrap;
				color: ${cardStyles[ `${cardColorLowerCase}SummaryColor` ]};
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
				color: ${cardStyles[ `${cardColorLowerCase}SummaryColor` ]};
			}
		`


	const MonsterTypeComponent = Styled(Typography)`
		&&
		{
			font-weight: 600;
			margin-bottom: .28rem;
			color: ${cardStyles[ `${cardColorLowerCase}SummaryColor` ]};
		}
	`

	return(
		<CardContentComponent className={className} >

			<div style={{ width: '100%', display: 'flex', marginBottom: '.5rem', whiteSpace: 'normal' }} >
				<CardNameComponent
					variant='subtitle1'
					noWrap={true}
					style={{ flex: '1' }}
					>
						{ cardName }
				</CardNameComponent>
			</div>

			<CardAssociation monsterAssociation={monsterAssociation} attribute={cardAttribute} />


			<CardDescriptionComponent >
				{
					( cardColor === 'Spell' || cardColor === 'Trap' ) ?
						undefined :
						<MonsterTypeComponent
							variant='body1'
							noWrap={true} >
								{ monsterType }
						</MonsterTypeComponent>
				}

				<CardEffectComponent
					variant='body2' >
						{ he.decode(cardEffect) }
				</CardEffectComponent>

				{
					( cardColor === 'Spell' || cardColor === 'Trap' || cardColor === 'err' ) ?
						undefined :
						(fullDetails) ? <AtkDef monsterAtk={monsterAtk} monsterDef={monsterDef} cardColor={cardColor} /> : undefined
				}
			</CardDescriptionComponent>
			{
				(fullDetails) ?
					<CardIDComponent variant='body2' >
						{cardID}
					</CardIDComponent>
					: undefined
			}
		</CardContentComponent>
	)
}, (prevProps, newProps) => {
	if ( prevProps.cardName !== newProps.cardName || prevProps.isLoading !== newProps.isLoading )
		return false

	return true
})


export default YGOCard