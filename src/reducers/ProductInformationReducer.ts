import { Dates } from '../helper/Dates'

type ProductInformationState = {
	pageBreadcrumbs: string[]
	productName: string
	productSummary: string[][]
	productRarityStats: { [key: string]: number }
}

export enum ProductInformationActionType {
	UPDATE_PRODUCT = 'UPDATE_PRODUCT',
}

type ProductInformationAction = {
	type: ProductInformationActionType.UPDATE_PRODUCT
	productInformation: ProductInfo
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
		default:
			return state
	}
}
