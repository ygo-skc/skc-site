import React from 'react'
import '../../css/card/ygo-card-styles.css'

import { Typography, Box } from '@mui/material'

import { decodeHTML } from 'entities'
import AtkDef from './AtkDef'

const YGOCardStats = ({ cardColor, cardEffect, monsterType, monsterAtk, monsterDef, cardID, fullDetails }) => {
	return (
		<Box className={`YgoCardDarkText ${cardColor.toLowerCase()}-ygo-card-style-light`} id='card-description'>
			<Typography variant='body1' id='monster-type' noWrap={true}>
				{cardColor === 'Spell' || cardColor === 'Trap' ? cardColor : monsterType}
			</Typography>

			{!fullDetails ? (
				<Typography className='ygo-card-effect-component-some-details' variant='body2'>
					{decodeHTML(cardEffect)}
				</Typography>
			) : (
				<Typography className='ygo-card-effect-component-full-details' variant='body2'>
					{decodeHTML(cardEffect)}
				</Typography>
			)}

			<Box className='ygo-card-footer-parent'>
				{fullDetails ? (
					<Typography variant='body2' id='card-id'>
						{cardID}
					</Typography>
				) : undefined}

				{fullDetails && cardColor !== 'Spell' && cardColor !== 'Trap' && cardColor !== 'Err' && <AtkDef monsterAtk={monsterAtk} monsterDef={monsterDef} cardColor={cardColor} />}
			</Box>
		</Box>
	)
}

export default YGOCardStats
