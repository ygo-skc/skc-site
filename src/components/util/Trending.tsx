import { useEffect, useReducer } from 'react'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import { TrendActionType, trendsReducer } from '../../reducers/TrendingReducer'

const Trends = () => {
	const [{ cardTrendData, productTrendData }, dispatch] = useReducer(trendsReducer, {
		cardTrendData: {
			metrics: [],
			isFetchingData: true,
			requestHasError: false,
		},
		productTrendData: {
			metrics: [],
			isFetchingData: true,
			requestHasError: false,
		},
	})

	useEffect(() => {
		FetchHandler.handleFetch<YGOCard.CardTrendData>(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.trending}/card`,
			(trendingData: YGOCard.CardTrendData) => {
				dispatch({ type: TrendActionType.UPDATE_CARD_TRENDS, cardTrendData: trendingData })
			},
			false
		)?.catch(() => {
			dispatch({ type: TrendActionType.FETCH_CARD_TRENDS_ERROR })
		})

		FetchHandler.handleFetch<YGOCard.ProductTrendData>(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.trending}/card`,
			(trendingData: YGOCard.ProductTrendData) => {
				dispatch({ type: TrendActionType.UPDATE_PRODUCT_TRENDS, productTrendData: trendingData })
			},
			false
		)?.catch(() => {
			dispatch({ type: TrendActionType.FETCH_PRODUCT_TRENDS_ERROR })
		})
	})
	return (
		<div>
			{cardTrendData.metrics.toString()}
			{productTrendData.metrics.toString()}
		</div>
	)
}

export default Trends
