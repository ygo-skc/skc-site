export type CardBrowseReducerState = { selectedCriteria: BrowseCriteria[] }

export enum CardBrowseReducerActionType {
	UPDATE_SELECTED_CRITERIA = 'UPDATE SELECTED CRITERIA',
}

export type CardBrowseReducerAction = CardBrowseReducerState & {
	type: CardBrowseReducerActionType
}

export default function cardBrowseReducer(state: CardBrowseReducerState, action: CardBrowseReducerAction) {
	return {
		...state,
		selectedCriteria: action.selectedCriteria,
	}
}
