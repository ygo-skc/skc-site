import React from 'react'
import '../../css/ygo-card-styles.css'

import { Typography, Box , Tooltip} from '@mui/material'

import Styled from 'styled-components'

import he from 'he'
import AtkDef from './AtkDef'


const YGOCardStats = ({ cardColor, cardEffect, monsterType, monsterAtk, monsterDef, cardID, fullDetails, effectMaxLineHeight }) => {
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
		<Box
			className={[`${cardColor}-ygo-card-style-light`.toLowerCase(), 'YgoCardDarkText'].join(' ')} id='card-description' >
			<Typography
				variant='body1'
				id='monster-type'
				noWrap={true} >
					{
						( cardColor === 'Spell' || cardColor === 'Trap' ) ? cardColor : monsterType
					}
			</Typography>

			{
				(!fullDetails)?
				<Tooltip title={ he.decode(cardEffect) } followCursor >
					<CardEffectComponent
						variant='body2' >
							{ he.decode(cardEffect) }
					</CardEffectComponent>
				</Tooltip>
				:
				<CardEffectComponent
					variant='body2' >
						{ he.decode(cardEffect) }
				</CardEffectComponent>
			}

			<Box style={{display: 'flex', paddingTop: '.5rem',  alignItems: 'center'}} >
				{
					(fullDetails) ?
						<Typography variant='body2' id='card-id' >
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
	)
}


export default YGOCardStats