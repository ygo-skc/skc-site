import { Chip, Typography } from '@mui/material'
import { FC, Fragment } from 'react'
import BlockIcon from '@mui/icons-material/Block'
import LooksOneTwoToneIcon from '@mui/icons-material/LooksOneTwoTone'
import LooksTwoTwoToneIcon from '@mui/icons-material/LooksTwoTwoTone'

export type _BanListSpreadNormalFormat = {
	numForbidden: number
	numLimited: number
	numSemiLimited: number
}

const BanListSpreadNormalFormat: FC<_BanListSpreadNormalFormat> = ({ numForbidden, numLimited, numSemiLimited }) => {
	return (
		<Fragment>
			<Typography variant='h6'>Totals</Typography>

			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' icon={<BlockIcon className='forbidden-icon' />} label={`${numForbidden}`} />
			<Chip className='breakdown-chip limited-breakdown-chip' variant='outlined' icon={<LooksOneTwoToneIcon className='limited-icon' />} label={`${numLimited}`} />
			<Chip className='breakdown-chip semi-limited-breakdown-chip' variant='outlined' icon={<LooksTwoTwoToneIcon className='semi-limited-icon' />} label={`${numSemiLimited}`} />
		</Fragment>
	)
}

export default BanListSpreadNormalFormat
