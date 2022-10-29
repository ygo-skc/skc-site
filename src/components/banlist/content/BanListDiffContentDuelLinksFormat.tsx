import { FC, memo } from 'react'
import BanListChangedStatus from '../BanListChangedStatus'

type _BanListDiffContentDuelLinksFormat = {
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
		return (
			<div>
				<BanListChangedStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} isLoadingData={isFetchingBanListNewContent} />
				<BanListChangedStatus newStatusName='Limited One' cards={newLimitedOneCards} numCards={numNewLimitedOne} isLoadingData={isFetchingBanListNewContent} />
				<BanListChangedStatus newStatusName='Limited Two' cards={newLimitedTwoCards} numCards={numNewLimitedTwo} isLoadingData={isFetchingBanListNewContent} />
				<BanListChangedStatus newStatusName='Limited Three' cards={newLimitedThreeCards} numCards={numNewLimitedThree} isLoadingData={isFetchingBanListNewContent} />
				<BanListChangedStatus newStatusName='Unlimited' cards={removedCards} numCards={numRemoved} isLoadingData={isFetchingBanListRemovedContent} />
			</div>
		)
	},
	(prevProps, nextProps) => {
		if (prevProps.isFetchingBanListNewContent !== nextProps.isFetchingBanListNewContent || prevProps.isFetchingBanListRemovedContent !== nextProps.isFetchingBanListRemovedContent)
			return false
		return true
	}
)

export default BanListDiffContentDuelLinksFormat
