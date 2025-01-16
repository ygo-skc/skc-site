export type CardBrowseCriteriaReducerSearchState = { browseInput: string; browseCriteria: YGOData.CardBrowseValues[] }

export enum CardBrowseCriteriaSearchReducerActionType {
	UPDATE_INPUT = 'UPDATE INPUT',
	UPDATE_BROWSE_CRITERIA = 'UPDATE BROWSE CRITERIA',
}

export type CardBrowseCriteriaSearchReducerAction =
	| ({ browseCriteria: YGOData.CardBrowseValues[] } & {
			type: CardBrowseCriteriaSearchReducerActionType.UPDATE_BROWSE_CRITERIA
	  })
	| ({ browseInput: string } & {
			type: CardBrowseCriteriaSearchReducerActionType.UPDATE_INPUT
	  })

export default function cardBrowseCriteriaSearchReducer(state: CardBrowseCriteriaReducerSearchState, action: CardBrowseCriteriaSearchReducerAction) {
	switch (action.type) {
		case CardBrowseCriteriaSearchReducerActionType.UPDATE_INPUT:
			return {
				...state,
				browseInput: action.browseInput,
			}
		case CardBrowseCriteriaSearchReducerActionType.UPDATE_BROWSE_CRITERIA:
			return {
				...state,
				browseCriteria: action.browseCriteria,
			}
		default:
			return state
	}
}
