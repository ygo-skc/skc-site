import { Skeleton } from '@mui/material'
import { FC, Fragment, memo } from 'react'
import CardsWithDifferentStatus from './CardsWithDifferentStatus'

type BanListDiffContentProps = {
	format: string
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
	normalFormatDiffContent: SKCBanListDiffContentNormalFormat
	dlFormatDiffContent: SKCBanListDiffContentDuelLinksFormat
}

const BanListDiffContent: FC<BanListDiffContentProps> = memo(
	({ format, normalFormatDiffContent, dlFormatDiffContent, isFetchingBanListNewContent, isFetchingBanListRemovedContent }) => {
		const isFetchingContent = isFetchingBanListNewContent || isFetchingBanListRemovedContent

		return (
			<Fragment>
				{isFetchingContent && <Skeleton className='rounded-skeleton cards-with-diff-status-skeleton' variant='rectangular' height='30rem' width='100%' />}
				{!isFetchingContent && format !== 'DL' && (
					<Fragment>
						<CardsWithDifferentStatus newStatusName='Forbidden' cards={normalFormatDiffContent.newForbidden} numCards={normalFormatDiffContent.numNewForbidden} />
						<CardsWithDifferentStatus newStatusName='Limited' cards={normalFormatDiffContent.newLimited} numCards={normalFormatDiffContent.numNewLimited} />
						<CardsWithDifferentStatus newStatusName='Semi Limited' cards={normalFormatDiffContent.newSemiLimited} numCards={normalFormatDiffContent.numNewSemiLimited} />
						<CardsWithDifferentStatus newStatusName='Unlimited' cards={normalFormatDiffContent.removedCards} numCards={normalFormatDiffContent.numRemoved} />
					</Fragment>
				)}
				{!isFetchingContent && format === 'DL' && (
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
	},
	(prevProps, nextProps) => {
		return (
			prevProps.isFetchingBanListNewContent === nextProps.isFetchingBanListNewContent &&
			prevProps.isFetchingBanListRemovedContent === nextProps.isFetchingBanListRemovedContent &&
			prevProps.format === nextProps.format &&
			// if format is non DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format !== 'DL' &&
				(prevProps.normalFormatDiffContent.numNewForbidden !== nextProps.normalFormatDiffContent.numNewForbidden ||
					prevProps.normalFormatDiffContent.numNewLimited !== nextProps.normalFormatDiffContent.numNewLimited ||
					prevProps.normalFormatDiffContent.numNewSemiLimited !== nextProps.normalFormatDiffContent.numNewSemiLimited)
			) &&
			// if format is DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format === 'DL' &&
				(prevProps.dlFormatDiffContent.numNewForbidden !== nextProps.dlFormatDiffContent.numNewForbidden ||
					prevProps.dlFormatDiffContent.numNewLimitedOne !== nextProps.dlFormatDiffContent.numNewLimitedOne ||
					prevProps.dlFormatDiffContent.numNewLimitedTwo !== nextProps.dlFormatDiffContent.numNewLimitedTwo ||
					prevProps.dlFormatDiffContent.numNewLimitedThree !== nextProps.dlFormatDiffContent.numNewLimitedThree)
			)
		)
	}
)

BanListDiffContent.displayName = 'BanListDiffContentNormalFormat'
export default BanListDiffContent
