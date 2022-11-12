import { FC } from 'react'
import { Divider, Skeleton, Typography } from '@mui/material'
import BanListSpread, { _BanListSpread } from './BanListSpread'
import BanListDiffSpread, { _BanListDiffSpread } from './BanListDiffSpread'

type _BanListBreakdown = {
	spreads: _BanListSpread
	diffSpreads: _BanListDiffSpread
	isFetchingBanList: boolean
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
}

const BanListBreakdown: FC<_BanListBreakdown> = ({ spreads, diffSpreads, isFetchingBanList, isFetchingBanListNewContent, isFetchingBanListRemovedContent }) => {
	return (
		<div className='group'>
			<Typography variant='h5'>Breakdown</Typography>

			{isFetchingBanList ? (
				<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
			) : (
				<BanListSpread numForbidden={spreads.numForbidden} numLimited={spreads.numLimited} numSemiLimited={spreads.numSemiLimited} />
			)}

			<Divider className='dark-translucent-divider' />

			{isFetchingBanListNewContent || isFetchingBanListRemovedContent ? (
				<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
			) : (
				<BanListDiffSpread
					numNewForbidden={diffSpreads.numNewForbidden}
					numNewLimited={diffSpreads.numNewLimited}
					numNewSemiLimited={diffSpreads.numNewSemiLimited}
					numRemoved={diffSpreads.numRemoved}
				/>
			)}
		</div>
	)
}

export default BanListBreakdown
