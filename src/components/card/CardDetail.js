import React, { useMemo } from 'react'
import he from 'he'
import { Typography, Box, Card, CardContent, Badge  } from '@material-ui/core'
import styled from 'styled-components';

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

const CardBadge = styled(Badge)`
	&& {
		width: 100%;
		marginRight: 10px;

		.MuiBadge-badge {
			margin-right: .8rem;
			color: white;
		}
	}
`


export default function CardDetail( { isNew, cardName, cardColor, cardEffect, monsterType, monsterAtk, monsterDef, cardClicked, cardStyles, cardID, fullDetails } )
{
	const cardColorLowerCase = cardColor.toLowerCase()
	const cardClickedCallBack = (cardClicked) ? function () { cardClicked(cardID) } : undefined
	const curser = (cardClickedCallBack === undefined) ? '' : 'pointer'


	const YGOCard = useMemo( () => styled(Card)`
			&&
			{
				width: 100%;
				cursor: ${curser};
			}
		`, [ curser ]
	)

	const CardContentComponent = useMemo( () => styled(CardContent)`
			&&&
			{
				padding: .62rem;
				background: ${cardStyles[ `${cardColorLowerCase}Background` ]};
			}
		`, [ cardStyles, cardColorLowerCase ]
	)

	const CardNameComponent = useMemo( () => styled(Typography)`
			&& {
				font-weight: 500;
				text-transform: uppercase;
				margin-bottom: .415rem;
				color: ${cardStyles[ `${cardColorLowerCase}Color` ]};
				font-family: Nunito;
			},
		`, [ cardStyles, cardColorLowerCase ]
	)

	const CardDescriptionComponent = useMemo( () => styled(Box)`
				&&
				{
					padding: .445rem;
					background: ${cardStyles[ `${cardColorLowerCase}SummaryBackground` ]};
				}
			`, [ cardStyles, cardColorLowerCase ]
	)

	const CardEffectComponent = useMemo( () => (fullDetails) ?
		styled(Typography)`
			&&
			{
				white-space: pre-wrap;
				margin-bottom: .35rem;
				color: ${cardStyles[ `${cardColorLowerCase}SummaryColor` ]};
			}
		`
		: styled(Typography)`
			&&
			{
				white-space: pre-wrap;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				color: ${cardStyles[ `${cardColorLowerCase}SummaryColor` ]};
			}
		`,[ cardStyles, cardColorLowerCase ]
	)



	return (
		<CardBadge
			badgeContent='NEW'
			variant='standard'
			overlap='rectangle'
			color='secondary'
			invisible={ !isNew } >
			<YGOCard onClick={ cardClickedCallBack } >
				<CardContentComponent >
					<CardNameComponent
						variant='subtitle2'
						noWrap={true} >
							{ cardName }
					</CardNameComponent>
					<CardDescriptionComponent >
						{
							( cardColor === 'Spell' || cardColor === 'Trap' ) ?
								undefined :
								<MonsterTypeComponent
									variant='body1'
									noWrap={true} >
										[ { monsterType } ]
								</MonsterTypeComponent>
						}

						<CardEffectComponent
							variant='body1' >
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
								{cardID} &nbsp;&nbsp; First Edition
							</CardIDComponent>
							: undefined
					}
				</CardContentComponent>
			</YGOCard>
		</CardBadge>
	)
}
