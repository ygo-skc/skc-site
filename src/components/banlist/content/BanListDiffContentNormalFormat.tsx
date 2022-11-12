import { FC } from 'react'
import BanListChangedStatus from '../BanListChangedStatus'

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

const BanListDiffContentNormalFormat: FC<_BanListDiffContentNormalFormat> = ({
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
		<div>
			<BanListChangedStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Limited' cards={newLimitedCards} numCards={numNewLimited} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Semi Limited' cards={newSemiLimitedCards} numCards={numNewSemiLimited} isLoadingData={isFetchingBanListNewContent} />

			<BanListChangedStatus newStatusName='Unlimited' cards={removedCards} numCards={numRemoved} isLoadingData={isFetchingBanListRemovedContent} />
		</div>
	)
}

export default BanListDiffContentNormalFormat
