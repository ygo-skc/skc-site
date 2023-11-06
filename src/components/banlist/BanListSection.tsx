import { FC, Fragment, useEffect, useReducer } from 'react'
import { Hint } from 'skc-rcl'
import CardDisplayGrid from '../util/grid/CardDisplayGrid'
import cardDisplayGridReducer, { CardDisplayGridStateReducerActionType } from '../../helper/reducers/CardDisplayGridReducer'

type BanListSectionProps = {
	sectionExplanation: string
	cards: SKCCard[]
	isFetchingBanList: boolean
}

const BanListSection: FC<BanListSectionProps> = ({ sectionExplanation, cards, isFetchingBanList }) => {
	const [cardGridState, cardDisplayGridDispatch] = useReducer(cardDisplayGridReducer, {
		results: [],
		totalResults: 0,
		totalDisplaying: 0,
		numItemsToLoadWhenNeeded: 0,
		isLoading: true,
	})

	useEffect(() => {
		if (isFetchingBanList) {
			cardDisplayGridDispatch({
				type: CardDisplayGridStateReducerActionType.LOADING_GRID,
			})
		} else {
			cardDisplayGridDispatch({
				type: CardDisplayGridStateReducerActionType.INIT_GRID,
				results: cards,
				totalResults: cards.length,
				totalDisplaying: cards.length,
			})
		}
	}, [isFetchingBanList, cards])

	return (
		<Fragment>
			<Hint>{sectionExplanation}</Hint>
			<CardDisplayGrid cardGridState={cardGridState} dispatch={cardDisplayGridDispatch} />
		</Fragment>
	)
}

export default BanListSection
