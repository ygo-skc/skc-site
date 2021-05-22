import React, {memo, lazy} from 'react'
import '../../css/ygo-card-styles.css'

import { Typography, Box, Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Styled from 'styled-components'
import he from 'he'

import AtkDef from './AtkDef'

const CardAssociation = lazy( () => import('./CardAssociation'))

const CardContentComponent = Styled(Paper)`
	&&
	{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 1rem;
		padding: .4rem;
		padding-top: .65rem;
		padding-bottom: .65rem;
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
				color: inherit;
			}
		`

	return(
		<CardContentComponent className={[className, `${cardColor}YgoCardParent`, 'YgoCardLightText'].join(' ')} >

			<Typography
				variant='subtitle1'
				id='CardName'
				noWrap={true}
				>
					{ cardName }
			</Typography>

			<CardAssociation monsterAssociation={monsterAssociation} attribute={cardAttribute} />


			<Box
					className={[`${cardColor}YgoCardSummaryBox`, 'YgoCardDarkText'].join(' ')} id='CardDescription' >
				<Typography
					variant='body1'
					id='MonsterType'
					noWrap={true} >
						{
							( cardColor === 'Spell' || cardColor === 'Trap' ) ? cardColor : monsterType
						}
				</Typography>

				<CardEffectComponent
					variant='body2' >
						{ he.decode(cardEffect) }
				</CardEffectComponent>

				<Box style={{display: 'flex', paddingTop: '.5rem',  alignItems: 'center'}} >
					{
						(fullDetails) ?
							<Typography variant='body2' id='CardID' >
								{cardID}
							</Typography>
							: undefined
					}
					{
						( cardColor === 'Spell' || cardColor === 'Trap' || cardColor === 'Err' ) ?
							undefined :
							(fullDetails) ? <AtkDef monsterAtk={monsterAtk} monsterDef={monsterDef} cardColor={cardColor} /> : undefined
					}
				</Box>
			</Box>
		</CardContentComponent>
	)
}, (prevProps, newProps) => {
	if ( prevProps.cardName !== newProps.cardName )
		return false

	return true
})


export default YGOCard