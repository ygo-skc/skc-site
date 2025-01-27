import { useEffect, useReducer } from 'react'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import { TrendActionType, trendsReducer } from '../../reducers/TrendingReducer'

import { Skeleton, Typography } from '@mui/material'
import Ticker from './Ticker'
import { CardImageRounded, ProductImage } from 'skc-rcl'

import '../../css/util/trending.css'

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
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.trending}/product`,
			(trendingData: YGOCard.ProductTrendData) => {
				dispatch({ type: TrendActionType.UPDATE_PRODUCT_TRENDS, productTrendData: trendingData })
			},
			false
		)?.catch(() => {
			dispatch({ type: TrendActionType.FETCH_PRODUCT_TRENDS_ERROR })
		})
	}, [])
	return (
		<div className='trending'>
			<Typography variant='h4'>Trending</Typography>
			{cardTrendData.isFetchingData || (productTrendData.isFetchingData && <Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />)}
			{!cardTrendData.isFetchingData && !productTrendData.isFetchingData && (
				<Ticker>
					{cardTrendData.metrics.map((item: YGOCard.CardTrendResource) => (
						<div key={item.resource.cardID} className='trending-item'>
							<CardImageRounded size='tn' variant='circle' cardID={item.resource.cardID} loading='eager' />
							<div>
								<Typography variant='body1'>{item.resource.cardName}</Typography>
								<Typography variant='body1'>
									{item.change} • {item.occurrences} hits
								</Typography>
							</div>
						</div>
					))}
					{productTrendData.metrics.map((item: YGOCard.ProductTrendResource) => (
						<div key={item.resource.productId} className='trending-item'>
							<ProductImage size='tn' productID={item.resource.productId} loading='eager' className='trending-product' />
							<div>
								<Typography>{item.resource.productName}</Typography>
								<Typography variant='body1'>
									{item.change} • {item.occurrences} hits
								</Typography>
							</div>
						</div>
					))}
				</Ticker>
			)}
		</div>
	)
}

export default Trends
