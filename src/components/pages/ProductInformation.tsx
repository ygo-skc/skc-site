import '../../css/main-pages/product.css'
import '../../css/util/headline.css'

import { useEffect, lazy, useReducer, Suspense } from 'react'
import { useParams } from 'react-router-dom'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import { Skeleton, Typography } from '@mui/material'
import ProductStats from '../product/ProductStats'
import { ProductImage, Section, SKCTable } from 'skc-rcl'
import cardDisplayGridReducer, { CardDisplayGridStateReducerActionType } from '../../reducers/CardDisplayGridReducer'
import { productInformationReducer, ProductInformationActionType } from '../../reducers/ProductInformationReducer'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const CardDisplayGrid = lazy(() => import('../util/grid/CardDisplayGrid'))

export default function ProductInformation() {
	const { productId } = useParams()

	const [state, productInformationDispatch] = useReducer(productInformationReducer, {
		pageBreadcrumbs: ['Home', 'Product Browse', ''],
		productName: '',
		productRarityStats: {},
		productSummary: [],
	})

	const [gridState, cardDisplayGridDispatch] = useReducer(cardDisplayGridReducer, {
		results: [],
		totalResults: 0,
		totalDisplaying: 0,
		numItemsToLoadWhenNeeded: 0,
		isLoading: true,
	})

	useEffect(() => {
		FetchHandler.handleFetch<ProductInfo>(`${DownstreamServices.NAME_maps_ENDPOINT.productDetails}/${productId}/en`, (json) => {
			productInformationDispatch({
				type: ProductInformationActionType.UPDATE_PRODUCT,
				productInformation: json,
			})

			const cards = json.productContent.map((item: SKCProductContent) => item.card)
			cardDisplayGridDispatch({
				type: CardDisplayGridStateReducerActionType.INIT_GRID,
				results: cards,
				totalResults: cards.length,
				totalDisplaying: cards.length,
			})
		})
	}, [])

	return (
		<div className='generic-container'>
			<title>{`SKC - Product: ${state.productName}`}</title>
			<meta name={`SKC - Product: ${state.productName}`} content={`Contents, info, dates, etc for ${state.productName}`} />
			<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={state.pageBreadcrumbs} />
			</Suspense>

			<div className='headline-v1'>
				<ProductImage className='product-info-img' productID={productId as string} size='lg' loading='eager' />

				<div className='group light-shadow'>
					<Typography variant='h3' align='center'>
						Summary
					</Typography>
					<div className='headline-section'>
						<Typography variant='h5'>Information</Typography>
						{!gridState.isLoading ? <SKCTable header={[]} rows={state.productSummary} /> : <Skeleton variant='rectangular' height='170px' />}
					</div>
				</div>
			</div>

			<ProductStats isDataLoaded={!gridState.isLoading} cards={gridState.results} productRarityStats={state.productRarityStats} />

			<Section sectionName='Product Content'>
				<div className='section-content'>
					<Typography variant='h5'>Sorted By Pack Order</Typography>
					<CardDisplayGrid cardGridState={gridState} dispatch={cardDisplayGridDispatch} />
				</div>
			</Section>
		</div>
	)
}
