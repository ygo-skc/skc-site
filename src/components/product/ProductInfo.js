import React, {useState, useEffect, lazy} from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import {handleFetch} from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/DownstreamServices'
import Section from '../util/Section'

import {MainContentContainer} from '../MainContent'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import {RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography, RightBoxHeaderContainer} from '../util/grid/OneThirdTwoThirdsGrid'


const Breadcrumb = lazy( () => import('../util/Breadcrumb') )
const CardDisplayGrid = lazy( () => import('../util/grid/CardDisplayGrid') )
const ProductInfoDetailsComponent = lazy( () => import('./ProductInfoDetailsComponent') )


export default function ProductInfo() {
	const {productId} = useParams()

	const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState(['Home', 'Product Browse', ''])

	const [productName, setProductName] = useState('')

	const [productType, setProductType] = useState('')
	const [productSubType, setProductSubType] = useState('')
	const [productReleaseDate, setProductReleaseDate] = useState('')
	const [productTotal, setProductTotal] = useState('')
	const [productRarityStats, setProductRarityStats] = useState('')

	const [isDataLoaded, setIsDataLoaded] = useState(false)

	const [cardJsonResults, setCardJsonResults] = useState([])


	useEffect( () => {
		handleFetch(`${NAME_maps_ENDPOINT['productDetails']}/${productId}/en`, json => {
			setDynamicBreadcrumbs(['Home', 'Product Browse', `${json.productId}`])

			setProductName(json.productName)
			setProductType(json.productType)
			setProductSubType(json.productSubType)
			setProductReleaseDate(json.productReleaseDate)

			setCardJsonResults(json.productContent.map(item => item.card))
			setProductTotal(json.productTotal)
			setProductRarityStats(json.productRarityStats)
			setIsDataLoaded(true)
		})
	}, [])


	return(
		<MainContentContainer>
			<Helmet>
				<title>{`SKC - Product: ${productName}`}</title>
				<meta
					name={`SKC - Product: ${productName}`}
					content={`Contents, info, dates, etc for ${productName}`}
					/>
				<meta name="keywords" content={`YuGiOh, product browse, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={dynamicBreadcrumbs} />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<ProductInfoDetailsComponent
						productName={productName}
						productId={productId}
						productType={productType}
						productSubType={productSubType}
						productReleaseDate={productReleaseDate}
						productTotal={productTotal}
						isDataLoaded={isDataLoaded}
						productRarityStats={productRarityStats}
					/>
					}
				twoThirdComponent={
					<Section
						sectionName='Product Content'
						sectionContent={
							<div
								className='section-content' >
								<RightBoxSubHeaderTypography variant='h5' >
									Sorted By Pack Order
								</RightBoxSubHeaderTypography>

								<CardDisplayGrid
									cardJsonResults={cardJsonResults}
									numResultsDisplayed={productTotal}
									numResultsLoaded={productTotal}
									loadMoreCallback={undefined}
									isLoadMoreOptionVisible={false}
									isDataLoaded={isDataLoaded}
									target={window.location.hash.substr(1)}
								/>
							</div>
						}>
					</Section>
				}
			/>
		</MainContentContainer>
	)
}