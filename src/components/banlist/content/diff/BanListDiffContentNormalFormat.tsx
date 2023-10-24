import { Skeleton } from '@mui/material'
import { FC, Fragment, memo } from 'react'
import CardsWithDifferentStatus from './CardsWithDifferentStatus'

const BanListDiffContentNormalFormat: FC<SKCBanListDiffContentNormalFormat & { isFetchingBanListNewContent: boolean; isFetchingBanListRemovedContent: boolean }> = memo(
	({
		removedCards,
		numRemoved,
		newForbidden,
		newLimited,
		newSemiLimited,
		numNewForbidden,
		numNewLimited,
		numNewSemiLimited,
		isFetchingBanListNewContent,
		isFetchingBanListRemovedContent,
	}) => {
		const isFetchingContent = (): boolean => {
			return isFetchingBanListNewContent || isFetchingBanListRemovedContent
		}

		return (
			<Fragment>
				{isFetchingContent() && <Skeleton className='rounded-skeleton cards-with-diff-status-skeleton' variant='rectangular' height='30rem' width='100%' />}
				{!isFetchingContent() && numNewForbidden !== 0 && <CardsWithDifferentStatus newStatusName='Forbidden' cards={newForbidden} numCards={numNewForbidden} />}
				{!isFetchingContent() && numNewLimited !== 0 && <CardsWithDifferentStatus newStatusName='Limited' cards={newLimited} numCards={numNewLimited} />}
				{!isFetchingContent() && numNewSemiLimited !== 0 && <CardsWithDifferentStatus newStatusName='Semi Limited' cards={newSemiLimited} numCards={numNewSemiLimited} />}
				{!isFetchingContent() && numRemoved !== 0 && <CardsWithDifferentStatus newStatusName='Unlimited' cards={removedCards} numCards={numRemoved} />}
			</Fragment>
		)
	},
	(prevProps, nextProps) => {
		if (prevProps.isFetchingBanListNewContent !== nextProps.isFetchingBanListNewContent || prevProps.isFetchingBanListRemovedContent !== nextProps.isFetchingBanListRemovedContent)
			return false
		return true
	}
)

BanListDiffContentNormalFormat.displayName = 'BanListDiffContentNormalFormat'
export default BanListDiffContentNormalFormat
