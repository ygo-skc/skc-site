import { Chip, Typography } from '@mui/material'
import { FC, Fragment } from 'react'
import { AcceptableBanListFormat } from '../../../helper/BanListUtil'

export type BanListDiffSpreadProps = {
	format: AcceptableBanListFormat
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
	numRemoved: number
	numNewLimitedOne: number
	numNewLimitedTwo: number
	numNewLimitedThree: number
}

const BanListDiffSpread: FC<BanListDiffSpreadProps> = ({
	format,
	numNewForbidden,
	numNewLimited,
	numNewSemiLimited,
	numRemoved,
	numNewLimitedOne,
	numNewLimitedTwo,
	numNewLimitedThree,
}) => {
	return (
		<Fragment>
			<Typography variant='h6'>Changes Compared To Previous Ban List</Typography>

			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' label={`${numNewForbidden} New Forbidden`} />
			{format === 'DL' ? (
				<Fragment>
					<Chip className='breakdown-chip limited-one-breakdown-chip' variant='outlined' label={`${numNewLimitedOne} New Limited One`} />
					<Chip className='breakdown-chip limited-two-breakdown-chip' variant='outlined' label={`${numNewLimitedTwo} New Limited Two`} />
					<Chip className='breakdown-chip limited-three-breakdown-chip' variant='outlined' label={`${numNewLimitedThree} New Limited Three`} />
					<Chip className='breakdown-chip removed-breakdown-chip' variant='outlined' label={`${numRemoved} New Unlimited`} />
				</Fragment>
			) : (
				<Fragment>
					<Chip className='breakdown-chip limited-breakdown-chip' variant='outlined' label={`${numNewLimited} New Limited`} />
					<Chip className='breakdown-chip semi-limited-breakdown-chip' variant='outlined' label={`${numNewSemiLimited} New Semi Limited`} />
				</Fragment>
			)}
			<Chip className='breakdown-chip removed-breakdown-chip' variant='outlined' label={`${numRemoved} New Unlimited`} />
		</Fragment>
	)
}

export default BanListDiffSpread
