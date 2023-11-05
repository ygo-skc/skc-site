import { FC, memo } from 'react'
import { AcceptableBanListFormat } from '../../../helper/BanListUtil'
import BanListDiffSpread, { BanListDiffSpreadProps } from './BanListDiffSpread'
import BanListSpread, { BanListSpreadProps } from './BanListSpread'
import { Divider, Skeleton, Typography } from '@mui/material'

type BanListBreakdownProps = {
	spreads: BanListSpreadProps
	diffSpreads: BanListDiffSpreadProps
	isFetchingBanList: boolean
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
	format: AcceptableBanListFormat
}

const BanListBreakdown: FC<BanListBreakdownProps> = memo(
	({ spreads, diffSpreads, isFetchingBanList, isFetchingBanListNewContent, isFetchingBanListRemovedContent, format }) => {
		return (
			<div className='group'>
				<Typography variant='h5'>Breakdown</Typography>

				{isFetchingBanList ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
				) : (
					<BanListSpread
						format={format}
						numForbidden={spreads.numForbidden}
						numLimited={spreads.numLimited}
						numSemiLimited={spreads.numSemiLimited}
						numLimitedOne={spreads.numLimitedOne}
						numLimitedTwo={spreads.numLimitedTwo}
						numLimitedThree={spreads.numLimitedThree}
					/>
				)}

				<Divider className='dark-translucent-divider' />

				{isFetchingBanListNewContent || isFetchingBanListRemovedContent ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
				) : (
					<BanListDiffSpread
						format={format}
						numNewForbidden={diffSpreads.numNewForbidden}
						numNewLimited={diffSpreads.numNewLimited}
						numNewSemiLimited={diffSpreads.numNewSemiLimited}
						numRemoved={diffSpreads.numRemoved}
						numNewLimitedOne={diffSpreads.numNewLimitedOne}
						numNewLimitedTwo={diffSpreads.numNewLimitedTwo}
						numNewLimitedThree={diffSpreads.numNewLimitedThree}
					/>
				)}
			</div>
		)
	},
	(prevProps, nextProps) => {
		return prevProps.isFetchingBanList === nextProps.isFetchingBanList && prevProps.format === nextProps.format && prevProps.diffSpreads === nextProps.diffSpreads
	}
)

BanListBreakdown.displayName = 'BanListBreakdown'
export default BanListBreakdown
