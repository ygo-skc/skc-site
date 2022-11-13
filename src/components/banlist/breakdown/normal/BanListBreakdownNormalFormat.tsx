import { FC } from 'react'
import { Divider, Skeleton, Typography } from '@mui/material'
import BanListSpreadNormalFormat, { _BanListSpreadNormalFormat } from './BanListSpreadNormalFormat'
import BanListDiffSpreadNormalFormat, { _BanListDiffSpreadNormalFormat } from './BanListDiffSpreadNormalFormat'

type _BanListBreakdownNormalFormat = {
	spreads: _BanListSpreadNormalFormat
	diffSpreads: _BanListDiffSpreadNormalFormat
	isFetchingBanList: boolean
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
}

const BanListBreakdownNormalFormat: FC<_BanListBreakdownNormalFormat> = ({
	spreads,
	diffSpreads,
	isFetchingBanList,
	isFetchingBanListNewContent,
	isFetchingBanListRemovedContent,
}) => {
	return (
		<div className='group'>
			<Typography variant='h5'>Breakdown</Typography>

			{isFetchingBanList ? (
				<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
			) : (
				<BanListSpreadNormalFormat numForbidden={spreads.numForbidden} numLimited={spreads.numLimited} numSemiLimited={spreads.numSemiLimited} />
			)}

			<Divider className='dark-translucent-divider' />

			{isFetchingBanListNewContent || isFetchingBanListRemovedContent ? (
				<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
			) : (
				<BanListDiffSpreadNormalFormat
					numNewForbidden={diffSpreads.numNewForbidden}
					numNewLimited={diffSpreads.numNewLimited}
					numNewSemiLimited={diffSpreads.numNewSemiLimited}
					numRemoved={diffSpreads.numRemoved}
				/>
			)}
		</div>
	)
}

export default BanListBreakdownNormalFormat
