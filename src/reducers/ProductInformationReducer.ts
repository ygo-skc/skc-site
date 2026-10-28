import { Crumbs } from '../components/header-footer/Breadcrumb'

type ProductInformationState = {
	pageBreadcrumbs: Crumbs
	productId: string
	productName: string
	// the whole answer, once it loads
	product?: YGOProduct.Info
	productCardSuggestions: {
		suggestions: Omit<YGOCard.Suggestion, 'hasSelfReference'>
		support: Omit<YGOCard.Support, 'card'>
		associatedArchetypes: Set<string>
		isFetchingData: boolean
		requestHasError: boolean
	}
}

export enum ProductInformationActionType {
	UPDATE_PRODUCT = 'UPDATE_PRODUCT',
	UPDATE_PRODUCT_CARD_SUGGESTIONS = 'UPDATE_PRODUCT_CARD_SUGGESTIONS',
	FETCH_PRODUCT_CARD_SUGGESTIONS_ERROR = 'FETCH_PRODUCT_CARD_SUGGESTIONS_ERROR',
}

type ProductInformationAction =
	| {
			type: ProductInformationActionType.UPDATE_PRODUCT
			productInformation: YGOProduct.Info
	  }
	| {
			type: ProductInformationActionType.UPDATE_PRODUCT_CARD_SUGGESTIONS
			productCardSuggestion: YGOProduct.SuggestionData
	  }
	| {
			type: ProductInformationActionType.FETCH_PRODUCT_CARD_SUGGESTIONS_ERROR
	  }

export function productInformationReducer(state: ProductInformationState, action: ProductInformationAction): ProductInformationState {
	switch (action.type) {
		case ProductInformationActionType.UPDATE_PRODUCT:
			return {
				...state,
				pageBreadcrumbs: ['Home', 'Product Browse', `${action.productInformation.productId}`],
				productName: action.productInformation.productName,
				product: action.productInformation,
			}
		case ProductInformationActionType.UPDATE_PRODUCT_CARD_SUGGESTIONS:
			return {
				...state,
				productCardSuggestions: {
					...state.productCardSuggestions,
					suggestions: { ...action.productCardSuggestion.suggestions },
					support: { ...action.productCardSuggestion.support },
					associatedArchetypes: new Set([...action.productCardSuggestion.suggestions.materialArchetypes, ...action.productCardSuggestion.suggestions.referencedArchetypes]),
					isFetchingData: false,
					requestHasError: false,
				},
			}
		case ProductInformationActionType.FETCH_PRODUCT_CARD_SUGGESTIONS_ERROR:
			return {
				...state,
				productCardSuggestions: {
					...state.productCardSuggestions,
					isFetchingData: false,
					requestHasError: true,
				},
			}
		default:
			return state
	}
}
