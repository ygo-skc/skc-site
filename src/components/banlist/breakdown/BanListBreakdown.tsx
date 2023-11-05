import { FC, memo } from 'react'
import { AcceptableBanListFormat } from '../../../helper/BanListUtil'
import BanListDiffSpread from './BanListDiffSpread'
import BanListSpread from './BanListSpread'
import { Divider, Skeleton, Typography } from '@mui/material'

type BanListBreakdownProps = {
	numForbidden: number
	numLimited: number
	numSemiLimited: number
	numLimitedOne: number
	numLimitedTwo: number
	numLimitedThree: number
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
	numRemoved: number
	numNewLimitedOne: number
	numNewLimitedTwo: number
	numNewLimitedThree: number
	isFetchingBanList: boolean
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
	format: AcceptableBanListFormat
}

const BanListBreakdown: FC<BanListBreakdownProps> = memo(
	({
		numForbidden,
		numLimited,
		numSemiLimited,
		numLimitedOne,
		numLimitedTwo,
		numLimitedThree,
		numNewForbidden,
		numNewLimited,
		numNewSemiLimited,
		numRemoved,
		numNewLimitedOne,
		numNewLimitedTwo,
		numNewLimitedThree,
		isFetchingBanList,
		isFetchingBanListNewContent,
		isFetchingBanListRemovedContent,
		format,
	}) => {
		return (
			<div className='group'>
				<Typography variant='h5'>Breakdown</Typography>

				{isFetchingBanList ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
				) : (
					<BanListSpread
						format={format}
						numForbidden={numForbidden}
						numLimited={numLimited}
						numSemiLimited={numSemiLimited}
						numLimitedOne={numLimitedOne}
						numLimitedTwo={numLimitedTwo}
						numLimitedThree={numLimitedThree}
					/>
				)}

				<Divider className='dark-translucent-divider' />

				{isFetchingBanListNewContent || isFetchingBanListRemovedContent ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
				) : (
					<BanListDiffSpread
						format={format}
						numNewForbidden={numNewForbidden}
						numNewLimited={numNewLimited}
						numNewSemiLimited={numNewSemiLimited}
						numRemoved={numRemoved}
						numNewLimitedOne={numNewLimitedOne}
						numNewLimitedTwo={numNewLimitedTwo}
						numNewLimitedThree={numNewLimitedThree}
					/>
				)}
			</div>
		)
	},
	(prevProps, nextProps) => {
		return (
			prevProps.isFetchingBanList === nextProps.isFetchingBanList &&
			prevProps.format === nextProps.format &&
			// if format is non DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format !== 'DL' &&
				(prevProps.numForbidden !== nextProps.numForbidden || prevProps.numLimited !== nextProps.numLimited || prevProps.numSemiLimited !== nextProps.numSemiLimited)
			) &&
			// if format is DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format === 'DL' &&
				(prevProps.numForbidden !== nextProps.numForbidden ||
					prevProps.numLimitedOne !== nextProps.numLimitedOne ||
					prevProps.numLimitedTwo !== nextProps.numLimitedTwo ||
					prevProps.numLimitedThree !== nextProps.numLimitedThree)
			) &&
			// if format is non DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format !== 'DL' &&
				(prevProps.numNewForbidden !== nextProps.numNewForbidden ||
					prevProps.numNewLimited !== nextProps.numNewLimited ||
					prevProps.numNewSemiLimited !== nextProps.numNewSemiLimited)
			) &&
			// if format is DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format === 'DL' &&
				(prevProps.numNewForbidden !== nextProps.numNewForbidden ||
					prevProps.numNewLimitedOne !== nextProps.numNewLimitedOne ||
					prevProps.numNewLimitedTwo !== nextProps.numNewLimitedTwo ||
					prevProps.numNewLimitedThree !== nextProps.numNewLimitedThree)
			)
		)
	}
)

BanListBreakdown.displayName = 'BanListBreakdown'
export default BanListBreakdown
