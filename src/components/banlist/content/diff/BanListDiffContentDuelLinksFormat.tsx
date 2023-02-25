import { FC, Fragment, memo } from 'react'
import CardsWithDifferentStatus from './CardsWithDifferentStatus'

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
			<Fragment>
				{numNewForbidden !== 0 && (
					<CardsWithDifferentStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} isLoadingData={isFetchingBanListNewContent} />
				)}
				{numNewLimitedOne !== 0 && (
					<CardsWithDifferentStatus newStatusName='Limited One' cards={newLimitedOneCards} numCards={numNewLimitedOne} isLoadingData={isFetchingBanListNewContent} />
				)}
				{numNewLimitedTwo !== 0 && (
					<CardsWithDifferentStatus newStatusName='Limited Two' cards={newLimitedTwoCards} numCards={numNewLimitedTwo} isLoadingData={isFetchingBanListNewContent} />
				)}
				{numNewLimitedThree !== 0 && (
					<CardsWithDifferentStatus newStatusName='Limited Three' cards={newLimitedThreeCards} numCards={numNewLimitedThree} isLoadingData={isFetchingBanListNewContent} />
				)}
				{numRemoved !== 0 && <CardsWithDifferentStatus newStatusName='Unlimited' cards={removedCards} numCards={numRemoved} isLoadingData={isFetchingBanListRemovedContent} />}
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
