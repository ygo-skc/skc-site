import { Crumbs } from '../components/header-footer/Breadcrumb'

type CardSuggestions = Omit<YGOCard.Suggestion, 'card' | 'relevantArchetypes' | 'materialArchetypes' | 'referencedArchetypes'> & Omit<YGOCard.Support, 'card'>

type CardInformationState = {
	pageBreadcrumbs: Crumbs
	card: YGOCard.Deets
	productInfo: YGOProduct.Info[]
	restrictionInfo: YGOCard.Restrictions
	isFetchingCardData: boolean
	// card suggestion state
	suggestions: CardSuggestions
	archetypes: Set<string>
	isFetchingSuggestions: boolean
	isFetchingSupport: boolean
	suggestionRequestHasError: boolean
	supportRequestHasError: boolean
	// every TCG / Master Duel list's date, newest first - the reach of the card's ban history, and whether it's on the current list.
	// undefined while loading, empty if the request failed
	banListDates: { TCG?: string[]; MD?: string[] }
}

export enum CardInformationType {
	UPDATE_CARD,
	UPDATE_SUGGESTIONS,
	UPDATE_SUPPORT,
	FETCH_SUGGESTIONS_ERROR,
	FETCH_SUPPORT_ERROR,
	UPDATE_BAN_LIST_DATES,
}

type CardInformationAction =
	| {
			type: CardInformationType.UPDATE_CARD
			cardInfo: YGOCard.Info
	  }
	| {
			type: CardInformationType.UPDATE_SUGGESTIONS
			suggestions: YGOCard.Suggestion
	  }
	| {
			type: CardInformationType.UPDATE_SUPPORT
			support: YGOCard.Support
	  }
	| {
			type: CardInformationType.FETCH_SUGGESTIONS_ERROR
	  }
	| {
			type: CardInformationType.FETCH_SUPPORT_ERROR
	  }
	| {
			type: CardInformationType.UPDATE_BAN_LIST_DATES
			format: 'TCG' | 'MD'
			dates: string[]
	  }

export function cardInformationReducer(state: CardInformationState, action: CardInformationAction): CardInformationState {
	switch (action.type) {
		case CardInformationType.UPDATE_CARD:
			return {
				...state,
				pageBreadcrumbs: ['Home', 'Card Browse', action.cardInfo.cardName],
				card: { ...action.cardInfo },
				productInfo: action.cardInfo.foundIn ?? [],
				restrictionInfo: action.cardInfo.restrictedIn ?? { TCG: [], MD: [], DL: [] },
				isFetchingCardData: false,
			}
		case CardInformationType.UPDATE_SUGGESTIONS:
			return {
				...state,
				suggestions: { ...state.suggestions, namedMaterials: action.suggestions.namedMaterials, namedReferences: action.suggestions.namedReferences },
				archetypes: new Set([...action.suggestions.relevantArchetypes, ...action.suggestions.materialArchetypes, ...action.suggestions.referencedArchetypes]),
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
		case CardInformationType.UPDATE_BAN_LIST_DATES:
			return {
				...state,
				banListDates: { ...state.banListDates, [action.format]: [...action.dates].sort((a, b) => b.localeCompare(a)) },
			}
	}
}
