import '../../css/main-pages/product.css'
import '../../css/util/headline.css'

import { useState, useEffect, lazy, useReducer, Suspense } from 'react'
import { useParams } from 'react-router-dom'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import { Skeleton, Typography } from '@mui/material'
import ProductStats from '../product/ProductStats'
import { ProductImage, Section, SKCTable } from 'skc-rcl'
import cardDisplayGridReducer, { CardDisplayGridStateReducerActionType } from '../../reducers/CardDisplayGridReducer'
import { Dates } from '../../helper/Dates'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const CardDisplayGrid = lazy(() => import('../util/grid/CardDisplayGrid'))

export default function ProductInfo() {
	const { productId } = useParams()

	const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState(['Home', 'Product Browse', ''])

	const [productName, setProductName] = useState('')

	const [productTotal, setProductTotal] = useState(0)
	const [productRarityStats, setProductRarityStats] = useState<{ [key: string]: number }>({})

	const [productSummary, setProductSummary] = useState<string[][]>([])

	const [cardGridState, cardDisplayGridDispatch] = useReducer(cardDisplayGridReducer, {
		results: [],
		totalResults: 0,
		totalDisplaying: 0,
		numItemsToLoadWhenNeeded: 0,
		isLoading: true,
	})

	useEffect(() => {
		FetchHandler.handleFetch<ProductInfo>(`${DownstreamServices.NAME_maps_ENDPOINT.productDetails}/${productId}/en`, (json) => {
			setDynamicBreadcrumbs(['Home', 'Product Browse', `${json.productId}`])

			setProductName(json.productName)

			setProductTotal(json.productTotal)
			setProductRarityStats(json.productRarityStats)

			setProductSummary([
				['Product ID', json.productId],
				['Product Type', json.productType],
				['Product Sub-Type', json.productSubType],
				['American Release', Dates.fromYYYYMMDDToDateStr(json.productReleaseDate)],
				['Total Unique Cards', json.productTotal.toString()],
			])

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
			<title>{`SKC - Product: ${productName}`}</title>
			<meta name={`SKC - Product: ${productName}`} content={`Contents, info, dates, etc for ${productName}`} />
			<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={dynamicBreadcrumbs} />
			</Suspense>

			<div className='headline-v1'>
				<ProductImage className='product-info-img' productID={productId as string} size='lg' loading='eager' />

				<div className='group light-shadow'>
					<Typography variant='h3' align='center'>
						Summary
					</Typography>
					<div className='headline-section'>
						<Typography variant='h5'>Information</Typography>
						{!cardGridState.isLoading ? <SKCTable header={[]} rows={productSummary} /> : <Skeleton variant='rectangular' height='170px' />}
					</div>
				</div>
			</div>

			<ProductStats isDataLoaded={!cardGridState.isLoading} cards={cardGridState.results} productTotal={+productTotal} productRarityStats={productRarityStats} />

			<Section sectionName='Product Content'>
				<div className='section-content'>
					<Typography variant='h5'>Sorted By Pack Order</Typography>
					<CardDisplayGrid cardGridState={cardGridState} dispatch={cardDisplayGridDispatch} />
				</div>
			</Section>
		</div>
	)
}
