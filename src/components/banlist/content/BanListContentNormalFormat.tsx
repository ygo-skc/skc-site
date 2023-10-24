import { FC, memo } from 'react'
import { Section } from 'skc-rcl'
import BanListSection from '../BanListSection'
import NormalFormatTabbedView from '../tab/NormalFormatTabbedView'

export type _BanListContentNormalFormat = {
	forbidden: SKCCard[]
	limited: SKCCard[]
	semiLimited: SKCCard[]
	numForbidden: number
	numLimited: number
	numSemiLimited: number
	isFetchingBanList: boolean
}

const BanListContentNormalFormat: FC<_BanListContentNormalFormat> = memo(
	({ forbidden, limited, semiLimited, numForbidden, numLimited, numSemiLimited, isFetchingBanList }) => {
		return (
			<Section sectionHeaderBackground={'ban-list'} sectionName='Content'>
				<div className='section-content'>
					<NormalFormatTabbedView
						numForbidden={numForbidden}
						numLimited={numLimited}
						numSemiLimited={numSemiLimited}
						forbiddenContent={
							<BanListSection sectionExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format' cards={forbidden} isDataLoaded={!isFetchingBanList} />
						}
						limitedContent={<BanListSection sectionExplanation='Limited cards can be included in Deck/Side deck - max 1' cards={limited} isDataLoaded={!isFetchingBanList} />}
						semiLimitedContent={
							<BanListSection sectionExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2' cards={semiLimited} isDataLoaded={!isFetchingBanList} />
						}
					/>
				</div>
			</Section>
		)
	},
	(prevProps, nextProps) => {
		if (prevProps.isFetchingBanList !== nextProps.isFetchingBanList) return false
		return true
	}
)

BanListContentNormalFormat.displayName = 'BanListContentNormalFormat'
export default BanListContentNormalFormat
