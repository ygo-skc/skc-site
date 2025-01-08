type CardSuggestions = Omit<CardSuggestionOutput, 'card' | 'materialArchetypes' | 'referencedArchetypes'> & Omit<CardSupportOutput, 'card'>

type CardInformationState = {
	pageBreadcrumbs: string[]
	card: SKCCard
	productInfo: YGOProductInfo[]
	restrictionInfo: RestrictedIn
	isFetchingCardData: boolean
	uniqueRarities: string[]
	// card suggestion state
	suggestions: CardSuggestions
	archetypes: Set<string>
	isFetchingSuggestions: boolean
	isFetchingSupport: boolean
	suggestionRequestHasError: boolean
	supportRequestHasError: boolean
}

export enum CardInformationType {
	UPDATE_CARD,
	UPDATE_SUGGESTIONS,
	UPDATE_SUPPORT,
	FETCH_SUGGESTIONS_ERROR,
	FETCH_SUPPORT_ERROR,
}

type CardInformationAction =
	| {
			type: CardInformationType.UPDATE_CARD
			cardInfo: SKCCardInfo
	  }
	| {
			type: CardInformationType.UPDATE_SUGGESTIONS
			suggestions: CardSuggestionOutput
	  }
	| {
			type: CardInformationType.UPDATE_SUPPORT
			support: CardSupportOutput
	  }
	| {
			type: CardInformationType.FETCH_SUGGESTIONS_ERROR
	  }
	| {
			type: CardInformationType.FETCH_SUPPORT_ERROR
	  }

export function cardInformationReducer(state: CardInformationState, action: CardInformationAction): CardInformationState {
	switch (action.type) {
		case CardInformationType.UPDATE_CARD:
			return {
				...state,
				pageBreadcrumbs: ['Home', 'Product Browse', action.cardInfo.cardID],
				card: { ...action.cardInfo },
				productInfo: action.cardInfo.foundIn ?? [],
				restrictionInfo: action.cardInfo.restrictedIn ?? { TCG: [], MD: [], DL: [] },
				isFetchingCardData: false,
				uniqueRarities: Array.from(
					new Set(action.cardInfo.foundIn.flatMap((product: YGOProductInfo) => product.productContent.flatMap((productContent: SKCProductContent) => productContent.rarities)))
				).sort((a, b) => a.localeCompare(b)),
			}
		case CardInformationType.UPDATE_SUGGESTIONS:
			return {
				...state,
				suggestions: { ...state.suggestions, namedMaterials: action.suggestions.namedMaterials, namedReferences: action.suggestions.namedReferences },
				archetypes: new Set([...action.suggestions.materialArchetypes, ...action.suggestions.referencedArchetypes]),
				suggestionRequestHasError: false,
				isFetchingSuggestions: false,
			}
		case CardInformationType.UPDATE_SUPPORT:
			return {
				...state,
				suggestions: { ...state.suggestions, referencedBy: action.support.referencedBy, materialFor: action.support.materialFor },
				supportRequestHasError: false,
				isFetchingSupport: false,
			}
		case CardInformationType.FETCH_SUGGESTIONS_ERROR:
			return {
				...state,
				suggestionRequestHasError: true,
				isFetchingSuggestions: false,
			}
		case CardInformationType.FETCH_SUPPORT_ERROR:
			return {
				...state,
				supportRequestHasError: true,
				isFetchingSupport: false,
			}
	}
}
