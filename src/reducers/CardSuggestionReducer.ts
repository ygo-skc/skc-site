type CardSuggestionState = {
	namedMaterials: CardReference[]
	namedReferences: CardReference[]
	referencedBy: CardReference[]
	materialFor: CardReference[]
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
			namedMaterials: CardReference[]
			namedReferences: CardReference[]
	  }
	| {
			type: CardSuggestionType.UPDATE_SUPPORT
			referencedBy: CardReference[]
			materialFor: CardReference[]
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
				namedMaterials: action.namedMaterials,
				namedReferences: action.namedReferences,
				suggestionRequestHasError: false,
				isLoadingSuggestions: false,
			}
		case CardSuggestionType.UPDATE_SUPPORT:
			return {
				...state,
				referencedBy: action.referencedBy,
				materialFor: action.materialFor,
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
