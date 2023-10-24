import { FC, Fragment, memo } from 'react'
import { AcceptableBanListFormat } from '../../../helper/BanListUtil'
import BanListContentDuelLinksFormat from './BanListContentDuelLinksFormat'
import BanListContentNormalFormat from './BanListContentNormalFormat'
import BanListDiffContentDuelLinksFormat from './diff/BanListDiffContentDuelLinksFormat'
import BanListDiffContentNormalFormat from './diff/BanListDiffContentNormalFormat'

type BanListContentProps = {
	normalFormatContent: SKCBanListContentNormalFormat
	normalFormatDiffContent: SKCBanListDiffContentNormalFormat
	dlFormatContent: SKCBanListContentDuelLinksFormat
	dlFormatDiffContent: SKCBanListDiffContentDuelLinksFormat
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
	isFetchingBanList: boolean
	format: AcceptableBanListFormat
}

const BanListContent: FC<BanListContentProps> = memo(
	({
		normalFormatContent,
		normalFormatDiffContent,
		dlFormatContent,
		dlFormatDiffContent,
		isFetchingBanListNewContent,
		isFetchingBanListRemovedContent,
		isFetchingBanList,
		format,
	}) => {
		return (
			<Fragment>
				{format === 'DL' ? (
					<Fragment>
						{/* this div might seem useless but it is needed for css to work as expected on its children */}
						<div>
							<BanListDiffContentDuelLinksFormat
								removedCards={dlFormatDiffContent.removedCards}
								numRemoved={dlFormatDiffContent.numRemoved}
								newForbidden={dlFormatDiffContent.newForbidden}
								newLimitedTwo={dlFormatDiffContent.newLimitedTwo}
								newLimitedOne={dlFormatDiffContent.newLimitedOne}
								newLimitedThree={dlFormatDiffContent.newLimitedThree}
								numNewForbidden={dlFormatDiffContent.numNewForbidden}
								numNewLimitedOne={dlFormatDiffContent.numNewLimitedOne}
								numNewLimitedTwo={dlFormatDiffContent.numNewLimitedTwo}
								numNewLimitedThree={dlFormatDiffContent.numNewLimitedThree}
								isFetchingBanListNewContent={isFetchingBanListNewContent}
								isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
							/>
						</div>
						<BanListContentDuelLinksFormat
							forbidden={dlFormatContent.forbidden}
							limitedOne={dlFormatContent.limitedOne}
							limitedTwo={dlFormatContent.limitedTwo}
							limitedThree={dlFormatContent.limitedThree}
							numForbidden={dlFormatContent.numForbidden}
							numLimitedOne={dlFormatContent.numLimitedOne}
							numLimitedTwo={dlFormatContent.numLimitedTwo}
							numLimitedThree={dlFormatContent.numLimitedThree}
							isFetchingBanList={isFetchingBanList}
						/>
					</Fragment>
				) : (
					<Fragment>
						{/* this div might seem useless but it is needed for css to work as expected on its children */}
						<div>
							<BanListDiffContentNormalFormat
								removedCards={normalFormatDiffContent.removedCards}
								numRemoved={normalFormatDiffContent.numRemoved}
								newForbidden={normalFormatDiffContent.newForbidden}
								newLimited={normalFormatDiffContent.newLimited}
								newSemiLimited={normalFormatDiffContent.newSemiLimited}
								numNewForbidden={normalFormatDiffContent.numNewForbidden}
								numNewLimited={normalFormatDiffContent.numNewLimited}
								numNewSemiLimited={normalFormatDiffContent.numNewSemiLimited}
								isFetchingBanListNewContent={isFetchingBanListNewContent}
								isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
							/>
						</div>
						<BanListContentNormalFormat
							forbidden={normalFormatContent.forbidden}
							limited={normalFormatContent.limited}
							semiLimited={normalFormatContent.semiLimited}
							numForbidden={normalFormatContent.numForbidden}
							numLimited={normalFormatContent.numLimited}
							numSemiLimited={normalFormatContent.numSemiLimited}
							isFetchingBanList={isFetchingBanList}
						/>
					</Fragment>
				)}
			</Fragment>
		)
	},
	(prevProps, nextProps) => {
		if (
			prevProps.format !== nextProps.format ||
			prevProps.isFetchingBanList !== nextProps.isFetchingBanList ||
			prevProps.isFetchingBanListNewContent !== nextProps.isFetchingBanListNewContent ||
			prevProps.isFetchingBanListRemovedContent !== nextProps.isFetchingBanListRemovedContent
		)
			return false
		return true
	}
)

BanListContent.displayName = 'BanListContent'
export default BanListContent
