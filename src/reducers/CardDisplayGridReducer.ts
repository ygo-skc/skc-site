export type CardDisplayGridState = { results: YGOCard.Deets[]; totalResults: number; totalDisplaying: number; numItemsToLoadWhenNeeded?: number; isLoading?: boolean }

export enum CardDisplayGridStateReducerActionType {
	CLEAR_GRID = 'CLEAR GRID',
	INIT_GRID = 'INIT GRID',
	LOADING_GRID = 'LOADING',
	LOAD_MORE = 'LOAD MORE',
}

export type CardDisplayGridStateReducerAction =
	| {
			type: CardDisplayGridStateReducerActionType.CLEAR_GRID
	  }
	| (CardDisplayGridState & {
			type: CardDisplayGridStateReducerActionType.INIT_GRID
	  })
	| {
			type: CardDisplayGridStateReducerActionType.LOADING_GRID
	  }
	| {
			type: CardDisplayGridStateReducerActionType.LOAD_MORE
	  }

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
				totalDisplaying: Math.min(action.totalDisplaying, action.totalResults),
				isLoading: false,
			}
		case CardDisplayGridStateReducerActionType.LOAD_MORE:
			return {
				...state,
				totalDisplaying: Math.min(state.totalResults, state.totalDisplaying + state.numItemsToLoadWhenNeeded!),
			}
		case CardDisplayGridStateReducerActionType.LOADING_GRID:
			return {
				...state,
				isLoading: true,
			}
		default:
			return state
	}
}
