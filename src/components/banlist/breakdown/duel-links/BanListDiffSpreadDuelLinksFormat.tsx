import { Chip } from '@mui/material'
import { FC } from 'react'

export type _BanListDiffSpreadDuelLinksFormat = {
	numNewForbidden: number
	numNewLimitedOne: number
	numNewLimitedTwo: number
	numNewLimitedThree: number
	numRemoved: number
}

const BanListDiffSpreadDuelLinksFormat: FC<_BanListDiffSpreadDuelLinksFormat> = ({ numNewForbidden, numNewLimitedOne, numNewLimitedTwo, numNewLimitedThree, numRemoved }) => {
	return (
		<div style={{ width: '100%' }}>
			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' label={`${numNewForbidden} New Forbidden`} />
			<Chip className='breakdown-chip limited-one-breakdown-chip' variant='outlined' label={`${numNewLimitedOne} New Limited One`} />
			<Chip className='breakdown-chip limited-two-breakdown-chip' variant='outlined' label={`${numNewLimitedTwo} New Limited Two`} />
			<Chip className='breakdown-chip limited-three-breakdown-chip' variant='outlined' label={`${numNewLimitedThree} New Limited Three`} />
			<Chip className='breakdown-chip removed-breakdown-chip' variant='outlined' label={`${numRemoved} New Unlimited`} />
		</div>
	)
}

export default BanListDiffSpreadDuelLinksFormat
