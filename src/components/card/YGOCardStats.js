import React from 'react'
import '../../css/ygo-card-styles.css'

import { Typography, Box, Tooltip } from '@mui/material'

import he from 'he'
import AtkDef from './AtkDef'

const YGOCardStats = ({ cardColor, cardEffect, monsterType, monsterAtk, monsterDef, cardID, fullDetails }) => {
	return (
		<Box className={`YgoCardDarkText ${cardColor.toLowerCase()}-ygo-card-style-light`} id='card-description'>
			<Typography variant='body1' id='monster-type' noWrap={true}>
				{cardColor === 'Spell' || cardColor === 'Trap' ? cardColor : monsterType}
			</Typography>

			{!fullDetails ? (
				<Tooltip title={he.decode(cardEffect)} followCursor>
					<Typography className='ygo-card-effect-component-some-details' variant='body2'>
						{he.decode(cardEffect)}
					</Typography>
				</Tooltip>
			) : (
				<Typography className='ygo-card-effect-component-full-details' variant='body2'>
					{he.decode(cardEffect)}
				</Typography>
			)}

			<Box style={{ display: 'flex', paddingTop: '.5rem', alignItems: 'center' }}>
				{fullDetails ? (
					<Typography variant='body2' id='card-id'>
						{cardID}
					</Typography>
				) : undefined}
				{cardColor === 'Spell' || cardColor === 'Trap' || cardColor === 'Err' ? undefined : fullDetails ? (
					<AtkDef monsterAtk={monsterAtk} monsterDef={monsterDef} cardColor={cardColor} />
				) : undefined}
			</Box>
		</Box>
	)
}

export default YGOCardStats
