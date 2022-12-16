import { Chip, Typography } from '@mui/material'
import { FC, Fragment } from 'react'

export type _BanListDiffSpreadNormalFormat = {
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
	numRemoved: number
}

const BanListDiffSpreadNormalFormat: FC<_BanListDiffSpreadNormalFormat> = ({ numNewForbidden, numNewLimited, numNewSemiLimited, numRemoved }) => {
	return (
		<Fragment>
			<Typography variant='h6'>Changes Compared To Previous Ban List</Typography>

			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' label={`${numNewForbidden} New Forbidden`} />
			<Chip className='breakdown-chip limited-breakdown-chip' variant='outlined' label={`${numNewLimited} New Limited`} />
			<Chip className='breakdown-chip semi-limited-breakdown-chip' variant='outlined' label={`${numNewSemiLimited} New Semi Limited`} />
			<Chip className='breakdown-chip removed-breakdown-chip' variant='outlined' label={`${numRemoved} New Unlimited`} />
		</Fragment>
	)
}

export default BanListDiffSpreadNormalFormat