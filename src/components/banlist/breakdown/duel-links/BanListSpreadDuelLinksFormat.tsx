import { Chip, Typography } from '@mui/material'
import { FC, Fragment } from 'react'
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
		<Fragment>
			<Typography variant='h6'>Totals</Typography>

			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' icon={<BlockIcon className='forbidden-icon' />} label={`${numForbidden}`} />
			<Chip className='breakdown-chip limited-one-breakdown-chip' variant='outlined' icon={<Filter1TwoToneIcon className='limited-one-icon' />} label={`${numLimitedOne}`} />
			<Chip className='breakdown-chip limited-two-breakdown-chip' variant='outlined' icon={<Filter2TwoToneIcon className='limited-two-icon' />} label={`${numLimitedTwo}`} />
			<Chip className='breakdown-chip limited-three-breakdown-chip' variant='outlined' icon={<Filter3TwoToneIcon className='limited-three-icon' />} label={`${numLimitedThree}`} />
		</Fragment>
	)
}

export default BanListSpreadDuelLinksFormat
