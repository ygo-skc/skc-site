import { FC, memo } from 'react'
import { Skeleton, Typography } from '@mui/material'
import BanListStats, { _BanListStats } from './BanListStats'

type _BanListBreakdown = {
	stats: _BanListStats
	isFetchingBanList: boolean
}

const BanListBreakdown: FC<_BanListBreakdown> = memo(
	({ stats, isFetchingBanList }) => {
		return (
			<div className='group'>
				<Typography variant='h5'>Breakdown</Typography>

				{isFetchingBanList ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
				) : (
					<BanListStats numForbidden={stats.numForbidden} numLimited={stats.numLimited} numSemiLimited={stats.numSemiLimited} />
				)}
			</div>
		)
	},
	(prevProps, nextProps) => {
		if (prevProps.stats !== nextProps.stats) return false
		return true
	}
)

export default BanListBreakdown
