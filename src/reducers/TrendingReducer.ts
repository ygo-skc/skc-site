type TrendState = {
	cardTrendData: APIRequest<YGOCard.CardTrendData>
	productTrendData: APIRequest<YGOCard.ProductTrendData>
}

export enum TrendActionType {
	UPDATE_CARD_TRENDS = 'UPDATE_CARD_TRENDS',
	UPDATE_PRODUCT_TRENDS = 'UPDATE_PRODUCT_TRENDS',
	FETCH_CARD_TRENDS_ERROR = 'FETCH_CARD_TRENDS_ERROR',
	FETCH_PRODUCT_TRENDS_ERROR = 'FETCH_PRODUCT_TRENDS_ERROR',
}

type TrendAction =
	| {
			type: TrendActionType.UPDATE_CARD_TRENDS
			cardTrendData: YGOCard.CardTrendData
	  }
	| {
			type: TrendActionType.UPDATE_PRODUCT_TRENDS
			productTrendData: YGOCard.ProductTrendData
	  }
	| {
			type: TrendActionType.FETCH_CARD_TRENDS_ERROR
	  }
	| {
			type: TrendActionType.FETCH_PRODUCT_TRENDS_ERROR
	  }

export function trendsReducer(state: TrendState, action: TrendAction): TrendState {
	switch (action.type) {
		case TrendActionType.UPDATE_CARD_TRENDS:
			return { ...state, cardTrendData: { ...action.cardTrendData, isFetchingData: false, requestHasError: false } }

		case TrendActionType.UPDATE_PRODUCT_TRENDS:
			return { ...state, productTrendData: { ...action.productTrendData, isFetchingData: false, requestHasError: false } }

		case TrendActionType.FETCH_CARD_TRENDS_ERROR:
			return { ...state, cardTrendData: { ...state.cardTrendData, isFetchingData: false, requestHasError: true } }

		case TrendActionType.FETCH_PRODUCT_TRENDS_ERROR:
			return { ...state, productTrendData: { ...state.productTrendData, isFetchingData: false, requestHasError: false } }

		default:
			return { ...state }
	}
}
