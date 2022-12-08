import { Chip, Typography } from '@mui/material'
import { FC, Fragment } from 'react'

export type _BanListDiffSpreadDuelLinksFormat = {
	numNewForbidden: number
	numNewLimitedOne: number
	numNewLimitedTwo: number
	numNewLimitedThree: number
	numRemoved: number
}

const BanListDiffSpreadDuelLinksFormat: FC<_BanListDiffSpreadDuelLinksFormat> = ({ numNewForbidden, numNewLimitedOne, numNewLimitedTwo, numNewLimitedThree, numRemoved }) => {
	return (
		<Fragment>
			<Typography variant='h6'>Changes Compared To Previous Ban List</Typography>

			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' label={`${numNewForbidden} New Forbidden`} />
			<Chip className='breakdown-chip limited-one-breakdown-chip' variant='outlined' label={`${numNewLimitedOne} New Limited One`} />
			<Chip className='breakdown-chip limited-two-breakdown-chip' variant='outlined' label={`${numNewLimitedTwo} New Limited Two`} />
			<Chip className='breakdown-chip limited-three-breakdown-chip' variant='outlined' label={`${numNewLimitedThree} New Limited Three`} />
			<Chip className='breakdown-chip removed-breakdown-chip' variant='outlined' label={`${numRemoved} New Unlimited`} />
		</Fragment>
	)
}

export default BanListDiffSpreadDuelLinksFormat
