import { FC } from 'react'
import { Divider, Skeleton, Typography } from '@mui/material'
import BanListSpreadDuelLinksFormat, { _BanListSpreadDuelLinksFormat } from './BanListSpreadDuelLinksFormat'
import BanListDiffSpreadDuelLinksFormat, { _BanListDiffSpreadDuelLinksFormat } from './BanListDiffSpreadDuelLinksFormat'

type _BanListBreakdown = {
	spreads: _BanListSpreadDuelLinksFormat
	diffSpreads: _BanListDiffSpreadDuelLinksFormat
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
				<BanListSpreadDuelLinksFormat
					numForbidden={spreads.numForbidden}
					numLimitedOne={spreads.numLimitedOne}
					numLimitedTwo={spreads.numLimitedTwo}
					numLimitedThree={spreads.numLimitedThree}
				/>
			)}

			<Divider className='dark-translucent-divider' />

			{isFetchingBanListNewContent || isFetchingBanListRemovedContent ? (
				<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
			) : (
				<BanListDiffSpreadDuelLinksFormat
					numNewForbidden={diffSpreads.numNewForbidden}
					numNewLimitedOne={diffSpreads.numNewLimitedOne}
					numNewLimitedTwo={diffSpreads.numNewLimitedTwo}
					numNewLimitedThree={diffSpreads.numNewLimitedThree}
					numRemoved={diffSpreads.numRemoved}
				/>
			)}
		</div>
	)
}

export default BanListBreakdown
