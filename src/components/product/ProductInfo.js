import React, {useState, useEffect, lazy} from 'react'
import { Helmet } from 'react-helmet'

import { Paper, Box, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import {handleFetch} from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'

import {MainContentContainer} from '../MainContent'
import Breadcrumb from '../Breadcrumb'

import OneThirdTwoThirdsGrid from '../grid/OneThirdTwoThirdsGrid'


import Styled from 'styled-components'
import {LightTranslucentDivider} from '../util/Divider'



import CardDisplayGrid from '../grid/CardDisplayGrid'
// const CardDisplayGrid = lazy( () => import('../grid/CardDisplayGrid') )


const MainBrowseInfoTypography = Styled(Typography)`
	&&
	{
		color: rgba(255, 255, 255, .95);
	}
`


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
					<Box>

						<Typography
							variant='h4'
							align='center'
							style={{marginBottom: '2rem'}} >
							Product Information
						</Typography>

						<Paper style={{padding: '1.4rem', background: '#a4508', backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)' }} >

							{(isDataLoaded)?
								<MainBrowseInfoTypography
									style={{marginBottom: '1.5rem'}}
									variant='h6'
									align='center' >
									{productName}
								</MainBrowseInfoTypography>
								: <Skeleton
									variant='rect'
									height={30}
									width={250}
									style={{margin: 'auto', marginBottom: '.8rem'}}
									/>
							}

							<MainBrowseInfoTypography variant='h6' >
								Summary
							</MainBrowseInfoTypography>

							<MainBrowseInfoTypography variant='body1' >
								<strong>Product ID:</strong> {productId}
							</MainBrowseInfoTypography>
							<MainBrowseInfoTypography variant='body1' >
								<strong>Product Type:</strong> {productType}
							</MainBrowseInfoTypography>
							<MainBrowseInfoTypography variant='body1'>
								<strong>Product Sub-Type:</strong> {productSubType}
							</MainBrowseInfoTypography >
							<MainBrowseInfoTypography variant='body1'>
								<strong>American Release:</strong> {productReleaseDate}
							</MainBrowseInfoTypography>

							<LightTranslucentDivider />

							<MainBrowseInfoTypography variant='h6' >
								Product Stats
							</MainBrowseInfoTypography>
							<MainBrowseInfoTypography variant='body1'>
								<strong>Product Total:</strong> {productTotal}
							</MainBrowseInfoTypography>
						</Paper>

					</Box>
				}
				twoThirdComponent={
					<CardDisplayGrid
						cardJsonResults={cardJsonResults}
						numResultsDisplayed={productTotal}
						numResultsLoaded={productTotal}
						loadMoreCallback={undefined}
						isLoadMoreOptionVisible={false}
						history={history}
						isDataLoaded={isDataLoaded}
					/>
				}
			/>
		</MainContentContainer>
	)
}