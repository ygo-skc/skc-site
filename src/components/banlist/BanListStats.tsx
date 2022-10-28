import { Chip } from '@mui/material'
import { FC } from 'react'
import BlockIcon from '@mui/icons-material/Block'
import LooksOneTwoToneIcon from '@mui/icons-material/LooksOneTwoTone'
import LooksTwoTwoToneIcon from '@mui/icons-material/LooksTwoTwoTone'

export type _BanListStats = {
	numForbidden: number
	numLimited: number
	numSemiLimited: number
}

const BanListStats: FC<_BanListStats> = ({ numForbidden, numLimited, numSemiLimited }) => {
	return (
		<div style={{ width: '100%' }}>
			<Chip className='breakdown-chip' variant='outlined' icon={<BlockIcon style={{ fontSize: '1.8rem', color: 'red' }} />} label={`${numForbidden} Forbidden`} />
			<Chip className='breakdown-chip' variant='outlined' icon={<LooksOneTwoToneIcon style={{ color: '#ff9100', fontSize: '1.8rem' }} />} label={`${numLimited} Limited`} />
			<Chip
				className='breakdown-chip'
				variant='outlined'
				icon={<LooksTwoTwoToneIcon style={{ color: '#4caf50', fontSize: '1.8rem' }} />}
				label={`${numSemiLimited} Semi Limited`}
			/>
		</div>
	)
}

export default BanListStats
