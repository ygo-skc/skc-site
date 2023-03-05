import { Skeleton } from '@mui/material'
import { FC, Fragment, memo } from 'react'
import CardsWithDifferentStatus from './CardsWithDifferentStatus'

export type _BanListDiffContentDuelLinksFormat = {
	removedCards: SKCCardsPreviousBanListStatus[]
	numRemoved: number
	newForbiddenCards: SKCCardsPreviousBanListStatus[]
	newLimitedOneCards: SKCCardsPreviousBanListStatus[]
	newLimitedTwoCards: SKCCardsPreviousBanListStatus[]
	newLimitedThreeCards: SKCCardsPreviousBanListStatus[]
	numNewForbidden: number
	numNewLimitedOne: number
	numNewLimitedTwo: number
	numNewLimitedThree: number
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
}

const BanListDiffContentDuelLinksFormat: FC<_BanListDiffContentDuelLinksFormat> = memo(
	({
		removedCards,
		numRemoved,
		newForbiddenCards,
		newLimitedOneCards,
		newLimitedTwoCards,
		newLimitedThreeCards,
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
				{!isFetchingContent() && numNewForbidden !== 0 && <CardsWithDifferentStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} />}
				{!isFetchingContent() && numNewLimitedOne !== 0 && <CardsWithDifferentStatus newStatusName='Limited One' cards={newLimitedOneCards} numCards={numNewLimitedOne} />}
				{!isFetchingContent() && numNewLimitedTwo !== 0 && <CardsWithDifferentStatus newStatusName='Limited Two' cards={newLimitedTwoCards} numCards={numNewLimitedTwo} />}
				{!isFetchingContent() && numNewLimitedThree !== 0 && <CardsWithDifferentStatus newStatusName='Limited Three' cards={newLimitedThreeCards} numCards={numNewLimitedThree} />}
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

export default BanListDiffContentDuelLinksFormat
