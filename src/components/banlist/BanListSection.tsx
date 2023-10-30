import { FC, Fragment, useEffect, useReducer } from 'react'
import { Hint } from 'skc-rcl'
import CardDisplayGrid from '../util/grid/CardDisplayGrid'
import cardDisplayGridReducer, { CardDisplayGridStateReducerActionType } from '../../helper/reducers/CardDisplayGridReducer'

type BanListSectionProps = {
	sectionExplanation: string
	cards: SKCCard[]
	isDataLoaded: boolean
}

const BanListSection: FC<BanListSectionProps> = ({ sectionExplanation, cards, isDataLoaded }) => {
	const [cardGridState, cardDisplayGridDispatch] = useReducer(cardDisplayGridReducer, {
		results: [],
		totalResults: 0,
		totalDisplaying: 0,
		numItemsToLoadWhenNeeded: 0,
		isLoading: true,
	})

	useEffect(() => {
		if (isDataLoaded) {
			cardDisplayGridDispatch({
				type: CardDisplayGridStateReducerActionType.INIT_GRID,
				results: cards,
				totalResults: cards.length,
				totalDisplaying: cards.length,
			})
		} else {
			cardDisplayGridDispatch({
				type: CardDisplayGridStateReducerActionType.LOADING_GRID,
			})
		}
	}, [isDataLoaded, cards])

	return (
		<Fragment>
			<Hint>{sectionExplanation}</Hint>
			<CardDisplayGrid cardGridState={cardGridState} dispatch={cardDisplayGridDispatch} />
		</Fragment>
	)
}

export default BanListSection
