import React, {useState, useEffect} from 'react'

import {Paper, Typography, Divider} from '@material-ui/core'

import {handleFetch} from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'

import {MainContentContainer} from '../MainContent'
import Breadcrumb from '../Breadcrumb'

import {OneThirdTwoThirdsGrid} from '../grid/OneThirdTwoThirdsGrid'

export default function ProductInfo({match, history}) {
	const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState(['Home', ''])

	const [productName, setProductName] = useState('')
	const [productId, setProductId] = useState('')
	const [productType, setProductType] = useState('')
	const [productSubType, setProductSubType] = useState('')
	const [productReleaseDate, setProductReleaseDate] = useState('')

	useEffect( () => {
		handleFetch(`${NAME_maps_ENDPOINT['productDetails']}/${match.params.productId}/en`, history, json => {
			console.log(json)
			setDynamicBreadcrumbs(['Home', `${json.productName} (${json.productId})`])

			setProductName(json.productName)
			setProductId(json.productId)
			setProductType(json.productType)
			setProductSubType(json.productSubType)
			setProductReleaseDate(json.productReleaseDate)
		})
	}, [])


	return(
		<MainContentContainer>
			<Breadcrumb crumbs={dynamicBreadcrumbs} />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<Paper style={{padding: '1.5rem'}}>

						<Typography>
							<strong>Product Name:</strong> {productName}
						</Typography>
						<Typography>
							<strong>Product ID:</strong> {productId}
						</Typography>
						<Typography>
							<strong>Product Type:</strong> {productType}
						</Typography>
						<Typography>
							<strong>Product Sub-Type:</strong> {productSubType}
						</Typography>
						<Typography>
							<strong>American Release:</strong> {productReleaseDate}
						</Typography>

						<Divider style={{marginTop: '1.3rem', marginBottom: '1.3rem'}} />
						<Typography>
							<strong>Product Sub-Type:</strong> {productSubType}
						</Typography>
					</Paper>
				}
				twoThirdComponent={
					<Paper>

					</Paper>
				}
			/>
		</MainContentContainer>
	)
}