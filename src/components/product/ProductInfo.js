import React, {useState, useEffect} from 'react'

import {Paper, Typography, Divider} from '@material-ui/core'

import {handleFetch} from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'

import {MainContentContainer} from '../MainContent'
import Breadcrumb from '../Breadcrumb'

import {OneThirdTwoThirdsGrid} from '../grid/OneThirdTwoThirdsGrid'


import CardDisplayGrid from '../grid/CardDisplayGrid'

export default function ProductInfo({match, history}) {
	const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState(['Home', ''])

	const [productName, setProductName] = useState('')
	const [productId, setProductId] = useState('')
	const [productType, setProductType] = useState('')
	const [productSubType, setProductSubType] = useState('')
	const [productReleaseDate, setProductReleaseDate] = useState('')
	const [productTotal, setProductTotal] = useState('')

	const [cardJsonResults, setCardJsonResults] = useState(undefined)


	useEffect( () => {
		handleFetch(`${NAME_maps_ENDPOINT['productDetails']}/${match.params.productId}/en`, history, json => {
			console.log(json)
			setDynamicBreadcrumbs(['Home', `${json.productName} (${json.productId})`])

			setProductName(json.productName)
			setProductId(json.productId)
			setProductType(json.productType)
			setProductSubType(json.productSubType)
			setProductReleaseDate(json.productReleaseDate)

			setCardJsonResults(json.productContent.map(item => item.card))
			setProductTotal(json.productTotal)
		})
	}, [])


	return(
		<MainContentContainer>
			<Breadcrumb crumbs={dynamicBreadcrumbs} />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<Paper style={{padding: '1.5rem'}}>

						<Typography variant='h5' align='center' >
							{productName} ({productId})
						</Typography>
						<br/>

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

						<Typography variant='h6' align='center' >
							Product Stats
						</Typography>
						<br/>
						<Typography>
							<strong>Product Total:</strong> {productTotal}
						</Typography>
					</Paper>
				}
				twoThirdComponent={
					<CardDisplayGrid
						cardJsonResults={cardJsonResults}
						numResultsDisplayed={productTotal}
						numResultsLoaded={productTotal}
						loadMoreCallback={() => {console.log('I WAS CLICKED')}}
						isLoadMoreOptionVisible={false}
					/>
				}
			/>
		</MainContentContainer>
	)
}