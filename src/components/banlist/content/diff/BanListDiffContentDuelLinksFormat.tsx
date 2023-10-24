import { Skeleton } from '@mui/material'
import { FC, Fragment, memo } from 'react'
import CardsWithDifferentStatus from './CardsWithDifferentStatus'

const BanListDiffContentDuelLinksFormat: FC<SKCBanListDiffContentDuelLinksFormat & { isFetchingBanListNewContent: boolean; isFetchingBanListRemovedContent: boolean }> = memo(
	({
		removedCards,
		numRemoved,
		newForbidden,
		newLimitedOne,
		newLimitedTwo,
		newLimitedThree,
		numNewForbidden,
		numNewLimitedOne,
		numNewLimitedTwo,
		numNewLimitedThree,
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
				{!isFetchingContent() && numNewLimitedOne !== 0 && <CardsWithDifferentStatus newStatusName='Limited One' cards={newLimitedOne} numCards={numNewLimitedOne} />}
				{!isFetchingContent() && numNewLimitedTwo !== 0 && <CardsWithDifferentStatus newStatusName='Limited Two' cards={newLimitedTwo} numCards={numNewLimitedTwo} />}
				{!isFetchingContent() && numNewLimitedThree !== 0 && <CardsWithDifferentStatus newStatusName='Limited Three' cards={newLimitedThree} numCards={numNewLimitedThree} />}
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

BanListDiffContentDuelLinksFormat.displayName = 'BanListDiffContentDuelLinksFormat'
export default BanListDiffContentDuelLinksFormat
