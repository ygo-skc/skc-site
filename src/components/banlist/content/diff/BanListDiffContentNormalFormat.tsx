import { FC, Fragment, memo } from 'react'
import CardsWithDifferentStatus from './CardsWithDifferentStatus'

type _BanListDiffContentNormalFormat = {
	removedCards: SKCCardsPreviousBanListStatus[]
	numRemoved: number
	newForbiddenCards: SKCCardsPreviousBanListStatus[]
	newLimitedCards: SKCCardsPreviousBanListStatus[]
	newSemiLimitedCards: SKCCardsPreviousBanListStatus[]
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
}

const BanListDiffContentNormalFormat: FC<_BanListDiffContentNormalFormat> = memo(
	({
		removedCards,
		numRemoved,
		newForbiddenCards,
		newLimitedCards,
		newSemiLimitedCards,
		numNewForbidden,
		numNewLimited,
		numNewSemiLimited,
		isFetchingBanListNewContent,
		isFetchingBanListRemovedContent,
	}) => {
		return (
			<Fragment>
				{numNewForbidden !== 0 && (
					<CardsWithDifferentStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} isLoadingData={isFetchingBanListNewContent} />
				)}
				{numNewLimited !== 0 && <CardsWithDifferentStatus newStatusName='Limited' cards={newLimitedCards} numCards={numNewLimited} isLoadingData={isFetchingBanListNewContent} />}
				{numNewSemiLimited !== 0 && (
					<CardsWithDifferentStatus newStatusName='Semi Limited' cards={newSemiLimitedCards} numCards={numNewSemiLimited} isLoadingData={isFetchingBanListNewContent} />
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

export default BanListDiffContentNormalFormat
