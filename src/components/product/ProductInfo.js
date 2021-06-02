import React, {useState, useEffect, lazy} from 'react'
import { Helmet } from 'react-helmet'

import {handleFetch} from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/DownstreamServices'

import {MainContentContainer} from '../MainContent'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import {DarkTranslucentDivider} from '../util/Divider'

import {RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography, RightBoxHeaderContainer} from '../util/grid/OneThirdTwoThirdsGrid'


const Breadcrumb = lazy( () => import('../Breadcrumb') )
const CardDisplayGrid = lazy( () => import('../util/grid/CardDisplayGrid') )
const ProductInfoDetailsComponent = lazy( () => import('./ProductInfoDetailsComponent') )


export default function ProductInfo({match, history}) {
	const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState(['Home', 'Product Browse', ''])

	const [productName, setProductName] = useState('')
	const [productId, setProductId] = useState('')
	const [productType, setProductType] = useState('')
	const [productSubType, setProductSubType] = useState('')
	const [productReleaseDate, setProductReleaseDate] = useState('')
	const [productTotal, setProductTotal] = useState('')

	const [isDataLoaded, setIsDataLoaded] = useState(false)

	const [cardJsonResults, setCardJsonResults] = useState([])


	useEffect( () => {
		handleFetch(`${NAME_maps_ENDPOINT['productDetails']}/${match.params.productId}/en`, history, json => {
			setDynamicBreadcrumbs(['Home', 'Product Browse', `${json.productId}`])

			setProductName(json.productName)
			setProductId(json.productId)
			setProductType(json.productType)
			setProductSubType(json.productSubType)
			setProductReleaseDate(json.productReleaseDate)

			setCardJsonResults(json.productContent.map(item => item.card))
			setProductTotal(json.productTotal)
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
					/>
					}
				twoThirdComponent={
					<RightBoxPaper >
						<RightBoxHeaderContainer >
							<RightBoxHeaderTypography variant='h4' >
								Contents
							</RightBoxHeaderTypography>
							<RightBoxSubHeaderTypography variant='h5' >
								Sorted By Pack Order
							</RightBoxSubHeaderTypography>

							<DarkTranslucentDivider />
						</RightBoxHeaderContainer>

						<CardDisplayGrid
							cardJsonResults={cardJsonResults}
							numResultsDisplayed={productTotal}
							numResultsLoaded={productTotal}
							loadMoreCallback={undefined}
							isLoadMoreOptionVisible={false}
							history={history}
							isDataLoaded={isDataLoaded}
							target={window.location.hash.substr(1)}
						/>
					</RightBoxPaper>
				}
			/>
		</MainContentContainer>
	)
}