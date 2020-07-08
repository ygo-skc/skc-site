import React from 'react'

import { Typography, Box, Card, CardContent } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import styled from 'styled-components'
import he from 'he'


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


const YGOCard = ( {cardName, cardColor, cardEffect, monsterType, monsterAtk, monsterDef, cardStyles, cardID, fullDetails, effectMaxLineHeight, isLoading } )  =>
{

	if (isLoading)
	{
		return(
			<Skeleton variant='rect' height='150' style={{ borderRadius: '1rem' }} />
		)
	}
	const cardColorLowerCase = cardColor.toLowerCase()

	const CardContentComponent = styled(CardContent)`
		&&&
		{
			padding: .375rem;
			background: ${cardStyles[ `${cardColorLowerCase}Background` ]};
		}
	`

	const CardNameComponent = styled(Typography)`
		&& {
			font-weight: 600;
			margin-bottom: .18rem;
			text-transform: uppercase;
			color: ${cardStyles[ `${cardColorLowerCase}Color` ]};
			font-family: Nunito;
		},
	`

	const CardDescriptionComponent = styled(Box)`
		&&
		{
			padding: .445rem;
			background: ${cardStyles[ `${cardColorLowerCase}SummaryBackground` ]};
		}
	`

	const CardEffectComponent = (fullDetails) ?
		styled(Typography)`
			&&
			{
				white-space: pre-wrap;
				color: ${cardStyles[ `${cardColorLowerCase}SummaryColor` ]};
			}
		`
		: styled(Typography)`
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


	const MonsterTypeComponent = styled(Typography)`
		&&
		{
			font-weight: 600;
			margin-bottom: .28rem;
			color: ${cardStyles[ `${cardColorLowerCase}SummaryColor` ]};
		}
	`

	return(
		<Card  >
			<CardContentComponent >
				{ (isLoading)?
					<Skeleton variant='text' />
					: <CardNameComponent
						variant='body2'
						noWrap={true} >
							{ cardName }
					</CardNameComponent>
				}
				<CardDescriptionComponent >
					{
						( cardColor === 'Spell' || cardColor === 'Trap' ) ?
							undefined :
							<MonsterTypeComponent
								variant='body2'
								noWrap={true} >
									[ { monsterType } ]
							</MonsterTypeComponent>
					}

					<CardEffectComponent
						variant='body2' >
							{ he.decode(cardEffect) }
					</CardEffectComponent>

					{
						( cardColor === 'Spell' || cardColor === 'Trap' || cardColor === 'err' ) ?
							undefined :
							(fullDetails) ?
								<MonsterAtkDefComponent>
									{monsterAtk} / {monsterDef}
								</MonsterAtkDefComponent> :
								undefined
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
		</Card>
	)
}

export { YGOCard }