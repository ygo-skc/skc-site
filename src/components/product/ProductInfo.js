import React, {useState, useEffect, lazy, Suspense} from 'react'
import { Helmet } from 'react-helmet'

import { Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import {handleFetch} from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'

import {MainContentContainer} from '../MainContent'

import OneThirdTwoThirdsGrid from '../grid/OneThirdTwoThirdsGrid'

import {LightTranslucentDivider, DarkTranslucentDivider} from '../util/Divider'

import {StickyBox} from '../util/StyledContainers'

import {LeftBoxHeaderTypography, LeftBoxSectionTypography, LeftBoxSectionHeaderTypography, RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography, RightBoxHeaderContainer} from '../grid/OneThirdTwoThirdsGrid'



const Breadcrumb = lazy( () => import('../Breadcrumb') )
const CardDisplayGrid = lazy( () => import('../grid/CardDisplayGrid') )


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

			<Suspense>
				<Breadcrumb crumbs={dynamicBreadcrumbs} />
			</Suspense>

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<StickyBox>

						<Paper style={{padding: '1.4rem', background: '#a4508', backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)' }} >

							{(isDataLoaded)?
								<LeftBoxHeaderTypography
									variant='h4'
									align='center' >
									{productName}
								</LeftBoxHeaderTypography>
								: <Skeleton
									variant='rect'
									height={30}
									width={250}
									style={{margin: 'auto', marginBottom: '.8rem'}}
									/>
							}

							<LeftBoxSectionHeaderTypography variant='h6' >
								Summary
							</LeftBoxSectionHeaderTypography>

							<LeftBoxSectionTypography variant='body1' >
								<strong>Product ID:</strong> {productId}
							</LeftBoxSectionTypography>
							<LeftBoxSectionTypography variant='body1' >
								<strong>Product Type:</strong> {productType}
							</LeftBoxSectionTypography>
							<LeftBoxSectionTypography variant='body1'>
								<strong>Product Sub-Type:</strong> {productSubType}
							</LeftBoxSectionTypography >
							<LeftBoxSectionTypography variant='body1'>
								<strong>American Release:</strong> {productReleaseDate}
							</LeftBoxSectionTypography>

							<LightTranslucentDivider  />

							<LeftBoxSectionHeaderTypography variant='h6' >
								Product Stats
							</LeftBoxSectionHeaderTypography>
							<LeftBoxSectionTypography variant='body1'>
								<strong>Product Total:</strong> {productTotal}
							</LeftBoxSectionTypography>
						</Paper>

					</StickyBox>
				}
				twoThirdComponent={
					<Suspense>
						<RightBoxPaper >
							<RightBoxHeaderContainer >
								<RightBoxHeaderTypography variant='h4' >
									Contents
								</RightBoxHeaderTypography>
								<RightBoxSubHeaderTypography variant='subtitle1' >
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
					</Suspense>
				}
			/>
		</MainContentContainer>
	)
}