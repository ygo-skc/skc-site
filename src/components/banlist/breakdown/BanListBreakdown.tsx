import { FC, Fragment, memo } from 'react'
import { AcceptableBanListFormat } from '../../../helper/BanListUtil'
import BanListBreakdownDuelLinksFormat from './duel-links/BanListBreakdownDuelLinksFormat'
import { _BanListDiffSpreadDuelLinksFormat } from './duel-links/BanListDiffSpreadDuelLinksFormat'
import { _BanListSpreadDuelLinksFormat } from './duel-links/BanListSpreadDuelLinksFormat'
import BanListBreakdownNormalFormat from './normal/BanListBreakdownNormalFormat'
import { _BanListDiffSpreadNormalFormat } from './normal/BanListDiffSpreadNormalFormat'
import { _BanListSpreadNormalFormat } from './normal/BanListSpreadNormalFormat'

type BanListBreakdownProps = {
	normalFormatSpreads: _BanListSpreadNormalFormat
	normalFormatDiffSpreads: _BanListDiffSpreadNormalFormat
	dlFormatSpreads: _BanListSpreadDuelLinksFormat
	dlFormatDiffSpreads: _BanListDiffSpreadDuelLinksFormat
	isFetchingBanList: boolean
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
	format: AcceptableBanListFormat
}

const BanListBreakdown: FC<BanListBreakdownProps> = memo(
	({
		normalFormatSpreads,
		normalFormatDiffSpreads,
		dlFormatSpreads,
		dlFormatDiffSpreads,
		isFetchingBanList,
		isFetchingBanListNewContent,
		isFetchingBanListRemovedContent,
		format,
	}) => {
		return (
			<Fragment>
				{format === 'DL' ? (
					<BanListBreakdownDuelLinksFormat
						spreads={dlFormatSpreads}
						diffSpreads={dlFormatDiffSpreads}
						isFetchingBanList={isFetchingBanList}
						isFetchingBanListNewContent={isFetchingBanListNewContent}
						isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
					/>
				) : (
					<BanListBreakdownNormalFormat
						spreads={normalFormatSpreads}
						diffSpreads={normalFormatDiffSpreads}
						isFetchingBanList={isFetchingBanList}
						isFetchingBanListNewContent={isFetchingBanListNewContent}
						isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
					/>
				)}
			</Fragment>
		)
	},
	(prevProps, nextProps) => {
		return (
			prevProps.isFetchingBanList === nextProps.isFetchingBanList &&
			prevProps.normalFormatSpreads === nextProps.normalFormatSpreads &&
			prevProps.normalFormatDiffSpreads === nextProps.normalFormatDiffSpreads &&
			prevProps.dlFormatSpreads === nextProps.dlFormatSpreads &&
			prevProps.dlFormatDiffSpreads === nextProps.dlFormatDiffSpreads
		)
	}
)

BanListBreakdown.displayName = 'BanListBreakdown'
export default BanListBreakdown
