import { useState, useEffect, lazy } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Fetch from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import Section from '../util/Section'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'
import { Typography } from '@mui/material'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const CardDisplayGrid = lazy(() => import('../util/grid/CardDisplayGrid'))
const ProductInfoDetailsComponent = lazy(() => import('./ProductInfoDetailsComponent'))

export default function ProductInfo() {
	const { productId } = useParams()

	const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState(['Home', 'Product Browse', ''])

	const [productName, setProductName] = useState('')

	const [productType, setProductType] = useState('')
	const [productSubType, setProductSubType] = useState('')
	const [productReleaseDate, setProductReleaseDate] = useState('')
	const [productTotal, setProductTotal] = useState(0)
	const [productRarityStats, setProductRarityStats] = useState<{ [key: string]: string }>({})

	const [isDataLoaded, setIsDataLoaded] = useState(false)

	const [cardJsonResults, setCardJsonResults] = useState([])

	useEffect(() => {
		Fetch.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT['productDetails']}/${productId}/en`, (json) => {
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
					<ProductInfoDetailsComponent
						productName={productName}
						productId={productId as string}
						productType={productType}
						productSubType={productSubType}
						productReleaseDate={productReleaseDate}
						productTotal={+productTotal}
						isDataLoaded={isDataLoaded}
						productRarityStats={productRarityStats}
					/>
				}
				twoThirdComponent={
					<Section
						sectionName='Product Content'
						sectionContent={
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
						}
					></Section>
				}
			/>
		</div>
	)
}
