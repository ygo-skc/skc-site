import { Chip, Typography } from '@mui/material'
import { FC, Fragment } from 'react'
import BlockIcon from '@mui/icons-material/Block'
import LooksOneTwoToneIcon from '@mui/icons-material/LooksOneTwoTone'
import LooksTwoTwoToneIcon from '@mui/icons-material/LooksTwoTwoTone'
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone'
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone'
import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone'
import { AcceptableBanListFormat } from '../../../helper/BanListUtil'

export type BanListSpreadProps = {
	format: AcceptableBanListFormat
	numForbidden: number
	numLimited: number
	numSemiLimited: number
	numLimitedOne: number
	numLimitedTwo: number
	numLimitedThree: number
}

const BanListSpread: FC<BanListSpreadProps> = ({ format, numForbidden, numLimited, numSemiLimited, numLimitedOne, numLimitedTwo, numLimitedThree }) => {
	return (
		<Fragment>
			<Typography variant='h6'>Totals</Typography>

			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' icon={<BlockIcon className='forbidden-icon' />} label={`${numForbidden}`} />
			{format === 'DL' ? (
				<Fragment>
					<Chip className='breakdown-chip limited-one-breakdown-chip' variant='outlined' icon={<Filter1TwoToneIcon className='limited-one-icon' />} label={`${numLimitedOne}`} />
					<Chip className='breakdown-chip limited-two-breakdown-chip' variant='outlined' icon={<Filter2TwoToneIcon className='limited-two-icon' />} label={`${numLimitedTwo}`} />
					<Chip
						className='breakdown-chip limited-three-breakdown-chip'
						variant='outlined'
						icon={<Filter3TwoToneIcon className='limited-three-icon' />}
						label={`${numLimitedThree}`}
					/>
				</Fragment>
			) : (
				<Fragment>
					<Chip className='breakdown-chip limited-breakdown-chip' variant='outlined' icon={<LooksOneTwoToneIcon className='limited-icon' />} label={`${numLimited}`} />
					<Chip
						className='breakdown-chip semi-limited-breakdown-chip'
						variant='outlined'
						icon={<LooksTwoTwoToneIcon className='semi-limited-icon' />}
						label={`${numSemiLimited}`}
					/>
				</Fragment>
			)}
		</Fragment>
	)
}

export default BanListSpread
