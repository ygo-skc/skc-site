import { FC, useEffect, useReducer } from 'react'
import { Hint } from 'skc-rcl'
import CardDisplayGrid from '../util/grid/CardDisplayGrid'
import cardDisplayGridReducer, { CardDisplayGridStateReducerActionType } from '../../reducers/CardDisplayGridReducer'
import { Typography } from '@mui/material'

type BanListSectionProps = {
	sectionExplanation: string
	cards: SKCCard[]
	isFetchingBanList: boolean
	value: number
	index: number
}

const BanListSection: FC<BanListSectionProps> = ({ sectionExplanation, cards, isFetchingBanList, value, index }) => {
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
		}
	}, [isFetchingBanList])

	useEffect(() => {
		if (!isFetchingBanList) {
			cardDisplayGridDispatch({
				type: CardDisplayGridStateReducerActionType.INIT_GRID,
				results: cards,
				totalResults: cards.length,
				totalDisplaying: cards.length,
			})
		}
	}, [isFetchingBanList, cards])

	return (
		<Typography component='div' role='tabpanel' hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`}>
			<Hint>{sectionExplanation}</Hint>
			<CardDisplayGrid cardGridState={cardGridState} dispatch={cardDisplayGridDispatch} />
		</Typography>
	)
}

export default BanListSection
