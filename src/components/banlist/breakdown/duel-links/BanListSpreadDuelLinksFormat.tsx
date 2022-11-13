import { Chip } from '@mui/material'
import { FC } from 'react'
import BlockIcon from '@mui/icons-material/Block'
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone'
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone'
import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone'

export type _BanListSpreadDuelLinksFormat = {
	numForbidden: number
	numLimitedOne: number
	numLimitedTwo: number
	numLimitedThree: number
}

const BanListSpreadDuelLinksFormat: FC<_BanListSpreadDuelLinksFormat> = ({ numForbidden, numLimitedOne, numLimitedTwo, numLimitedThree }) => {
	return (
		<div style={{ width: '100%' }}>
			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' icon={<BlockIcon style={{ fontSize: '1.8rem', color: 'red' }} />} label={`${numForbidden}`} />
			<Chip
				className='breakdown-chip limited-one-breakdown-chip'
				variant='outlined'
				icon={<Filter1TwoToneIcon style={{ color: '#ff9100', fontSize: '1.8rem' }} />}
				label={`${numLimitedOne}`}
			/>
			<Chip
				className='breakdown-chip limited-two-breakdown-chip'
				variant='outlined'
				icon={<Filter2TwoToneIcon style={{ color: '#4caf50', fontSize: '1.8rem' }} />}
				label={`${numLimitedTwo}`}
			/>
			<Chip
				className='breakdown-chip limited-three-breakdown-chip'
				variant='outlined'
				icon={<Filter3TwoToneIcon style={{ color: '#00B5E2', fontSize: '1.8rem' }} />}
				label={`${numLimitedThree}`}
			/>
		</div>
	)
}

export default BanListSpreadDuelLinksFormat
