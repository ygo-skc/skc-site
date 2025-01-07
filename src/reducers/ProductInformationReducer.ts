import { Dates } from '../helper/Dates'

type ProductInformationState = {
	pageBreadcrumbs: string[]
	productId: string
	productName: string
	productSummary: string[][]
	productRarityStats: { [key: string]: number }
	productCardSuggestions: {
		suggestions: Omit<CardSuggestionOutput, 'hasSelfReference'>
		support: Omit<CardSupportOutput, 'card'>
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
			productInformation: ProductInfo
	  }
	| {
			type: ProductInformationActionType.UPDATE_PRODUCT_CARD_SUGGESTIONS
			productCardSuggestion: ProductCardSuggestionOutput
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
				productRarityStats: action.productInformation.productRarityStats,
				productSummary: [
					['Product ID', action.productInformation.productId],
					['Product Type', action.productInformation.productType],
					['Product Sub-Type', action.productInformation.productSubType],
					['American Release', Dates.fromYYYYMMDDToDateStr(action.productInformation.productReleaseDate)],
					['Total Unique Cards', action.productInformation.productTotal.toString()],
				],
			}
		case ProductInformationActionType.UPDATE_PRODUCT_CARD_SUGGESTIONS:
			return {
				...state,
				productCardSuggestions: {
					...state.productCardSuggestions,
					suggestions: { ...action.productCardSuggestion.suggestions },
					support: { ...action.productCardSuggestion.support },
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
