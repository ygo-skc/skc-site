import { FC, Fragment, memo } from 'react'
import { AcceptableBanListFormat } from '../../../helper/BanListUtil'
import BanListContentDuelLinksFormat, { _BanListContentDuelLinksFormat } from './BanListContentDuelLinksFormat'
import BanListContentNormalFormat, { _BanListContentNormalFormat } from './BanListContentNormalFormat'
import BanListDiffContentDuelLinksFormat, { _BanListDiffContentDuelLinksFormat } from './diff/BanListDiffContentDuelLinksFormat'
import BanListDiffContentNormalFormat, { _BanListDiffContentNormalFormat } from './diff/BanListDiffContentNormalFormat'

type _BanListContent = {
	normalFormatContent: _BanListContentNormalFormat
	normalFormatDiffContent: _BanListDiffContentNormalFormat
	dlFormatContent: _BanListContentDuelLinksFormat
	dlFormatDiffContent: _BanListDiffContentDuelLinksFormat
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
	isFetchingBanList: boolean
	format: AcceptableBanListFormat
}

const BanListContent: FC<_BanListContent> = memo(
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
								newForbiddenCards={dlFormatDiffContent.newForbiddenCards}
								newLimitedTwoCards={dlFormatDiffContent.newLimitedTwoCards}
								newLimitedOneCards={dlFormatDiffContent.newLimitedOneCards}
								newLimitedThreeCards={dlFormatDiffContent.newLimitedThreeCards}
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
								newForbiddenCards={normalFormatDiffContent.newForbiddenCards}
								newLimitedCards={normalFormatDiffContent.newLimitedCards}
								newSemiLimitedCards={normalFormatDiffContent.newSemiLimitedCards}
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
