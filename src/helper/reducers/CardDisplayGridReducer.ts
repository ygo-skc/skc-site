export type CardDisplayGridState = { results: SKCCard[]; totalResults: number; totalDisplaying: number; numItemsToLoadWhenNeeded?: number; isLoading?: boolean }

export enum CardDisplayGridStateReducerActionType {
	CLEAR_GRID,
	INIT_GRID,
}

export type CardDisplayGridStateReducerAction =
	| {
			type: CardDisplayGridStateReducerActionType.CLEAR_GRID
	  }
	| (CardDisplayGridState & {
			type: CardDisplayGridStateReducerActionType.INIT_GRID
	  })

export default function cardDisplayGridReducer(state: CardDisplayGridState, action: CardDisplayGridStateReducerAction) {
	switch (action.type) {
		case CardDisplayGridStateReducerActionType.CLEAR_GRID:
			return {
				...state,
				results: [],
				totalResults: 0,
				totalDisplaying: 0,
				isLoading: false,
			}
		case CardDisplayGridStateReducerActionType.INIT_GRID:
			return {
				...state,
				results: action.results,
				totalResults: action.totalResults,
				totalDisplaying: action.totalDisplaying,
				isLoading: false,
			}
		default:
			return state
	}
}
