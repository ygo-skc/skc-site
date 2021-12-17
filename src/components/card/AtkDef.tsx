import { Box, Typography } from '@mui/material'
import { FC } from 'react'

import '../../css/ygo-card-styles.css'

const modifyStat = (stat: string | undefined) => {
	if (stat === undefined) return '?'
	return stat
}

const AtkDef: FC<{ monsterAtk: string; monsterDef: string; cardColor: string }> = ({ monsterAtk, monsterDef, cardColor }) => {
	return (
		<Box className='monster-stat-parent'>
			<Box className='monster-stat-sub-parent'>
				<Typography className='monster-stat monster-attack-stat' variant='body1'>
					{modifyStat(monsterAtk)}
				</Typography>

				{cardColor !== 'Link' ? (
					<Typography className='monster-stat monster-defense-stat' variant='body1'>
						{modifyStat(monsterDef)}
					</Typography>
				) : undefined}
			</Box>
		</Box>
	)
}

export default AtkDef
