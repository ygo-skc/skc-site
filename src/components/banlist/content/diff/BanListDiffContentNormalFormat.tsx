import { Skeleton } from '@mui/material'
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
				{isFetchingBanListNewContent && isFetchingBanListRemovedContent && (
					<Skeleton className='rounded-skeleton cards-with-diff-status-skeleton' variant='rectangular' height='30rem' width='100%' />
				)}
				{numNewForbidden !== 0 && <CardsWithDifferentStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} />}
				{numNewLimited !== 0 && <CardsWithDifferentStatus newStatusName='Limited' cards={newLimitedCards} numCards={numNewLimited} />}
				{numNewSemiLimited !== 0 && <CardsWithDifferentStatus newStatusName='Semi Limited' cards={newSemiLimitedCards} numCards={numNewSemiLimited} />}
				{numRemoved !== 0 && <CardsWithDifferentStatus newStatusName='Unlimited' cards={removedCards} numCards={numRemoved} />}
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
