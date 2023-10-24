import { FC, memo } from 'react'
import { Section } from 'skc-rcl'
import BanListSection from '../BanListSection'
import DuelLinksFormatTabbedView from '../tab/DuelLinksFormatTabbedView'

const BanListContentNormalFormat: FC<SKCBanListContentDuelLinksFormat & { isFetchingBanList: boolean }> = memo(
	({ forbidden, limitedOne, limitedTwo, limitedThree, numForbidden, numLimitedOne, numLimitedTwo, numLimitedThree, isFetchingBanList }) => {
		return (
			<Section sectionHeaderBackground={'ban-list'} sectionName='Content'>
				<div className='section-content'>
					<DuelLinksFormatTabbedView
						numForbidden={numForbidden}
						numLimitedOne={numLimitedOne}
						numLimitedTwo={numLimitedTwo}
						numLimitedThree={numLimitedThree}
						forbiddenContent={<BanListSection sectionExplanation='Forbidden cards cannot be used in your deck' cards={forbidden} isDataLoaded={!isFetchingBanList} />}
						limitedOneContent={
							<BanListSection
								sectionExplanation='You can only use a maximum of one card in the Limited One list in your deck'
								cards={limitedOne}
								isDataLoaded={!isFetchingBanList}
							/>
						}
						limitedTwoContent={
							<BanListSection
								sectionExplanation='You can only use a maximum of two card in the Limited Two list in your deck'
								cards={limitedTwo}
								isDataLoaded={!isFetchingBanList}
							/>
						}
						limitedThreeContent={
							<BanListSection
								sectionExplanation='You can only use a maximum of three card in the Limited Three list in your deck'
								cards={limitedThree}
								isDataLoaded={!isFetchingBanList}
							/>
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
