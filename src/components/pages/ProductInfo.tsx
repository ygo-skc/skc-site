import { useState, useEffect, lazy, Fragment, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'
import { Typography } from '@mui/material'
import ProductStats from '../product/ProductStats'
import { Section } from 'skc-rcl'
import cardDisplayGridReducer, { CardDisplayGridStateReducerActionType } from '../../reducers/CardDisplayGridReducer'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const CardDisplayGrid = lazy(() => import('../util/grid/CardDisplayGrid'))
const ProductInfoDetailsComponent = lazy(() => import('../product/ProductInfoDetailsComponent'))

export default function ProductInfo() {
	const { productId } = useParams()

	const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState(['Home', 'Product Browse', ''])

	const [productName, setProductName] = useState('')

	const [productType, setProductType] = useState('')
	const [productSubType, setProductSubType] = useState('')
	const [productReleaseDate, setProductReleaseDate] = useState('')
	const [productTotal, setProductTotal] = useState(0)
	const [productRarityStats, setProductRarityStats] = useState<{ [key: string]: number }>({})

	const [cardGridState, cardDisplayGridDispatch] = useReducer(cardDisplayGridReducer, {
		results: [],
		totalResults: 0,
		totalDisplaying: 0,
		numItemsToLoadWhenNeeded: 0,
		isLoading: true,
	})

	useEffect(() => {
		FetchHandler.handleFetch<ProductInfo>(`${DownstreamServices.NAME_maps_ENDPOINT['productDetails']}/${productId}/en`, (json) => {
			setDynamicBreadcrumbs(['Home', 'Product Browse', `${json.productId}`])

			setProductName(json.productName)
			setProductType(json.productType)
			setProductSubType(json.productSubType)
			setProductReleaseDate(json.productReleaseDate)

			setProductTotal(json.productTotal)
			setProductRarityStats(json.productRarityStats)

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
			<Helmet>
				<title>{`SKC - Product: ${productName}`}</title>
				<meta name={`SKC - Product: ${productName}`} content={`Contents, info, dates, etc for ${productName}`} />
				<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={dynamicBreadcrumbs} />

			<OneThirdTwoThirdsGrid
				mirrored={false}
				oneThirdComponent={
					<Section sectionHeaderBackground='product' sectionName='Product' sticky={true}>
						<ProductInfoDetailsComponent
							productName={productName}
							productId={productId as string}
							productType={productType}
							productSubType={productSubType}
							productReleaseDate={productReleaseDate}
							numUniqueCards={productTotal.toString()}
							isDataLoaded={!cardGridState.isLoading}
						/>
					</Section>
				}
				twoThirdComponent={
					<Fragment>
						<ProductStats isDataLoaded={!cardGridState.isLoading} cards={cardGridState.results} productTotal={+productTotal} productRarityStats={productRarityStats} />
						<Section sectionName='Product Content'>
							<div className='section-content'>
								<Typography variant='h5'>Sorted By Pack Order</Typography>

								<CardDisplayGrid cardGridState={cardGridState} dispatch={cardDisplayGridDispatch} />
							</div>
						</Section>
					</Fragment>
				}
			/>
		</div>
	)
}
