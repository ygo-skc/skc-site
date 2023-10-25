import { Skeleton } from '@mui/material'
import { FC, Fragment } from 'react'
import CardsWithDifferentStatus from './CardsWithDifferentStatus'

type BanListDiffContentProps = {
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
	normalFormatDiffContent?: SKCBanListDiffContentNormalFormat
	dlFormatDiffContent?: SKCBanListDiffContentDuelLinksFormat
}

const BanListDiffContent: FC<BanListDiffContentProps> = ({ normalFormatDiffContent, dlFormatDiffContent, isFetchingBanListNewContent, isFetchingBanListRemovedContent }) => {
	const isFetchingContent = isFetchingBanListNewContent || isFetchingBanListRemovedContent

	return (
		<Fragment>
			{isFetchingContent && <Skeleton className='rounded-skeleton cards-with-diff-status-skeleton' variant='rectangular' height='30rem' width='100%' />}
			{!isFetchingContent && normalFormatDiffContent !== undefined && (
				<Fragment>
					<CardsWithDifferentStatus newStatusName='Forbidden' cards={normalFormatDiffContent.newForbidden} numCards={normalFormatDiffContent.numNewForbidden} />
					<CardsWithDifferentStatus newStatusName='Limited' cards={normalFormatDiffContent.newLimited} numCards={normalFormatDiffContent.numNewLimited} />
					<CardsWithDifferentStatus newStatusName='Semi Limited' cards={normalFormatDiffContent.newSemiLimited} numCards={normalFormatDiffContent.numNewSemiLimited} />
					<CardsWithDifferentStatus newStatusName='Unlimited' cards={normalFormatDiffContent.removedCards} numCards={normalFormatDiffContent.numRemoved} />
				</Fragment>
			)}
			{!isFetchingContent && dlFormatDiffContent !== undefined && (
				<Fragment>
					<CardsWithDifferentStatus newStatusName='Forbidden' cards={dlFormatDiffContent.newForbidden} numCards={dlFormatDiffContent.numNewForbidden} />
					<CardsWithDifferentStatus newStatusName='Limited One' cards={dlFormatDiffContent.newLimitedOne} numCards={dlFormatDiffContent.numNewLimitedOne} />
					<CardsWithDifferentStatus newStatusName='Limited Two' cards={dlFormatDiffContent.newLimitedTwo} numCards={dlFormatDiffContent.numNewLimitedTwo} />
					<CardsWithDifferentStatus newStatusName='Limited Three' cards={dlFormatDiffContent.newLimitedThree} numCards={dlFormatDiffContent.numNewLimitedThree} />
					<CardsWithDifferentStatus newStatusName='Unlimited' cards={dlFormatDiffContent.removedCards} numCards={dlFormatDiffContent.numRemoved} />
				</Fragment>
			)}
		</Fragment>
	)
}

BanListDiffContent.displayName = 'BanListDiffContentNormalFormat'
export default BanListDiffContent
