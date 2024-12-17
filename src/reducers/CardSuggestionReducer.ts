export type CardSuggestionState = Omit<CardSuggestionOutput, 'card' | 'materialArchetypes' | 'referencedArchetypes'> &
	Omit<CardSupportOutput, 'card'> & {
		archetypes: Set<string>
		isLoadingSuggestions: boolean
		isLoadingSupport: boolean
		suggestionRequestHasError: boolean
		supportRequestHasError: boolean
	}

export enum CardSuggestionType {
	UPDATE_SUGGESTIONS,
	UPDATE_SUPPORT,
	FETCH_SUGGESTIONS_ERROR,
	FETCH_SUPPORT_ERROR,
}

type CardSuggestionAction =
	| {
			type: CardSuggestionType.UPDATE_SUGGESTIONS
			suggestions: CardSuggestionOutput
	  }
	| {
			type: CardSuggestionType.UPDATE_SUPPORT
			support: CardSupportOutput
	  }
	| {
			type: CardSuggestionType.FETCH_SUGGESTIONS_ERROR
	  }
	| {
			type: CardSuggestionType.FETCH_SUPPORT_ERROR
	  }

export function cardSuggestionReducer(state: CardSuggestionState, action: CardSuggestionAction): CardSuggestionState {
	switch (action.type) {
		case CardSuggestionType.UPDATE_SUGGESTIONS:
			return {
				...state,
				namedMaterials: action.suggestions.namedMaterials,
				namedReferences: action.suggestions.namedReferences,
				archetypes: new Set([...action.suggestions.materialArchetypes, ...action.suggestions.referencedArchetypes]),
				suggestionRequestHasError: false,
				isLoadingSuggestions: false,
			}
		case CardSuggestionType.UPDATE_SUPPORT:
			return {
				...state,
				referencedBy: action.support.referencedBy,
				materialFor: action.support.materialFor,
				supportRequestHasError: false,
				isLoadingSupport: false,
			}
		case CardSuggestionType.FETCH_SUGGESTIONS_ERROR:
			return {
				...state,
				suggestionRequestHasError: true,
				isLoadingSuggestions: false,
			}
		case CardSuggestionType.FETCH_SUPPORT_ERROR:
			return {
				...state,
				supportRequestHasError: true,
				isLoadingSupport: false,
			}
	}
}
