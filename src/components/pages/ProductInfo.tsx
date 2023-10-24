import { useState, useEffect, lazy, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'
import { Typography } from '@mui/material'
import ProductStats from '../product/ProductStats'
import { Section } from 'skc-rcl'

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

	const [isDataLoaded, setIsDataLoaded] = useState(false)

	const [cardJsonResults, setCardJsonResults] = useState<SKCCard[]>([])

	useEffect(() => {
		FetchHandler.handleFetch<ProductInfo>(`${DownstreamServices.NAME_maps_ENDPOINT['productDetails']}/${productId}/en`, (json) => {
			setDynamicBreadcrumbs(['Home', 'Product Browse', `${json.productId}`])

			setProductName(json.productName)
			setProductType(json.productType)
			setProductSubType(json.productSubType)
			setProductReleaseDate(json.productReleaseDate)

			setCardJsonResults(json.productContent.map((item: SKCProductContent) => item.card))
			setProductTotal(json.productTotal)
			setProductRarityStats(json.productRarityStats)
			setIsDataLoaded(true)
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
							isDataLoaded={isDataLoaded}
						/>
					</Section>
				}
				twoThirdComponent={
					<Fragment>
						<ProductStats isDataLoaded={isDataLoaded} cards={cardJsonResults} productTotal={+productTotal} productRarityStats={productRarityStats} />
						<Section sectionName='Product Content'>
							<div className='section-content'>
								<Typography variant='h5'>Sorted By Pack Order</Typography>

								<CardDisplayGrid
									cardJsonResults={cardJsonResults}
									numResultsDisplayed={productTotal}
									numItemsToLoadWhenNeeded={productTotal}
									numResults={productTotal}
									loadMoreCallback={undefined}
									isLoadMoreOptionVisible={false}
									isDataLoaded={isDataLoaded}
								/>
							</div>
						</Section>
					</Fragment>
				}
			/>
		</div>
	)
}
