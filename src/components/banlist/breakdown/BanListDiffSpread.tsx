import { Chip } from '@mui/material'
import { FC } from 'react'

export type _BanListDiffSpread = {
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
	numRemoved: number
}

const BanListSpread: FC<_BanListDiffSpread> = ({ numNewForbidden, numNewLimited, numNewSemiLimited, numRemoved }) => {
	return (
		<div style={{ width: '100%' }}>
			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' label={`${numNewForbidden} Newly Forbidden`} />
			<Chip className='breakdown-chip limited-breakdown-chip' variant='outlined' label={`${numNewLimited} Newly Limited`} />
			<Chip className='breakdown-chip semi-limited-breakdown-chip' variant='outlined' label={`${numNewSemiLimited} Newly Semi Limited`} />
			<Chip className='breakdown-chip removed-breakdown-chip' variant='outlined' label={`${numRemoved} Newly Unlimited`} />
		</div>
	)
}

export default BanListSpread
