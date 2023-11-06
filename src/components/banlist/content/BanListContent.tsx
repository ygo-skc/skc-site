import { FC, Suspense, lazy, memo } from 'react'
import { Section } from 'skc-rcl'
import BanListSection from '../BanListSection'
import { Skeleton } from '@mui/material'

const BanListTabs = lazy(() => import('../BanListTabs'))

type BanListContentProps = {
	normalFormatContent: SKCBanListContentNormalFormat
	dlFormatContent: SKCBanListContentDuelLinksFormat
	format: string
	isFetchingBanList: boolean
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
}

const BanListContent: FC<BanListContentProps> = memo(
	({ normalFormatContent, dlFormatContent, isFetchingBanList, isFetchingBanListNewContent, isFetchingBanListRemovedContent, format }) => {
		const isFetching = isFetchingBanList && isFetchingBanListNewContent && isFetchingBanListRemovedContent

		return (
			<Section sectionHeaderBackground={'ban-list'} sectionName='Content'>
				<div className='section-content'>
					<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='250px' />}>
						<BanListTabs
							format={format}
							numForbidden={normalFormatContent.numForbidden}
							numLimited={normalFormatContent.numLimited}
							numSemiLimited={normalFormatContent.numSemiLimited}
							numLimitedOne={dlFormatContent.numLimitedOne}
							numLimitedTwo={dlFormatContent.numLimitedTwo}
							numLimitedThree={dlFormatContent.numLimitedThree}
							forbiddenContent={
								<BanListSection
									sectionExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format'
									cards={normalFormatContent.forbidden}
									isFetchingBanList={isFetching}
								/>
							}
							limitedContent={
								<BanListSection sectionExplanation='Limited cards can be included in Deck/Side deck - max 1' cards={normalFormatContent.limited} isFetchingBanList={isFetching} />
							}
							semiLimitedContent={
								<BanListSection
									sectionExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2'
									cards={normalFormatContent.semiLimited}
									isFetchingBanList={isFetching}
								/>
							}
							limitedOneContent={
								<BanListSection
									sectionExplanation='You can only use a maximum of one card in the Limited One list in your deck'
									cards={dlFormatContent.limitedOne}
									isFetchingBanList={isFetching}
								/>
							}
							limitedTwoContent={
								<BanListSection
									sectionExplanation='You can only use a maximum of two card in the Limited Two list in your deck'
									cards={dlFormatContent.limitedTwo}
									isFetchingBanList={isFetching}
								/>
							}
							limitedThreeContent={
								<BanListSection
									sectionExplanation='You can only use a maximum of three card in the Limited Three list in your deck'
									cards={dlFormatContent.limitedThree}
									isFetchingBanList={isFetching}
								/>
							}
						/>
					</Suspense>
				</div>
			</Section>
		)
	},
	(prevProps, nextProps) => {
		return (
			prevProps.isFetchingBanList === nextProps.isFetchingBanList &&
			prevProps.isFetchingBanListNewContent === nextProps.isFetchingBanListNewContent &&
			prevProps.isFetchingBanListRemovedContent === nextProps.isFetchingBanListRemovedContent &&
			prevProps.format === nextProps.format &&
			// if format is non DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format !== 'DL' &&
				(prevProps.normalFormatContent.numForbidden !== nextProps.normalFormatContent.numForbidden ||
					prevProps.normalFormatContent.numLimited !== nextProps.normalFormatContent.numLimited ||
					prevProps.normalFormatContent.numSemiLimited !== nextProps.normalFormatContent.numSemiLimited)
			) &&
			// if format is DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format === 'DL' &&
				(prevProps.dlFormatContent.numForbidden !== nextProps.dlFormatContent.numForbidden ||
					prevProps.dlFormatContent.numLimitedOne !== nextProps.dlFormatContent.numLimitedOne ||
					prevProps.dlFormatContent.numLimitedTwo !== nextProps.dlFormatContent.numLimitedTwo ||
					prevProps.dlFormatContent.numLimitedThree !== nextProps.dlFormatContent.numLimitedThree)
			)
		)
	}
)

BanListContent.displayName = 'BanListContentNormalFormat'
export default BanListContent
