import React, { useState, useEffect, useMemo, lazy } from 'react'
import { Grid } from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'
import { Helmet } from 'react-helmet'

import { MainContentContainer } from '../MainContent'

import {handleFetch} from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/DownstreamServices'
import {RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography, RightBoxHeaderContainer} from '../util/grid/OneThirdTwoThirdsGrid'

import createTable from '../../helper/TableHelpers'

const Breadcrumb = lazy( () => import('../util/Breadcrumb') )


function getPlaceholderCardComponent()
{
	const placeHolder = []

	var i = 0;
	for (i = 0; i < 50; i++)
	{
		placeHolder.push(<Grid
			key={`skeleton-${i}`}
			item
			xs={6}
			sm={4}
			md={3}
			lg={2}
			xl={1}
			style={{ padding: '.5rem' }} >
				<Skeleton variant='rect' width='100%' height='130' />
		</Grid>)
	}

	return placeHolder
}


export default function ProductBrowse({history})
{
	const [productJson, setProductJson] = useState([])
	const [productGridItems, setProductGridItems] = useState([])
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	const getPlaceholderCardComponentMemoized = useMemo(() => getPlaceholderCardComponent(), [])


	useEffect( () => {
		handleFetch(NAME_maps_ENDPOINT['productBrowse'], history, json => {
			setProductJson(json.products)
			setIsDataLoaded(true)
		})
	}, [])


	useEffect( () => {
		const headers = ['Product Name', 'Product ID', 'Product Type', 'Product Sub-Type']
		const productRows =  productJson.map( product => [product.productName, product.productId, product.productType, product.productSubType])

		setProductGridItems(createTable(headers, productRows))

	}, [productJson])


	return (
		<MainContentContainer style={{}} >
			<Helmet>
				<title>{`SKC - Product Browser`}</title>
				<meta
					name={`SKC - Product Browser`}
					content={`Browse all products in database to check the progression of YuGiOh.`}
					/>
				<meta name="keywords" content={`YuGiOh, product browse, The Supreme Kings Castle`} />
			</Helmet>


			<Breadcrumb crumbs={ ['Home', 'Product Browse'] } />

			<RightBoxPaper>
				<RightBoxHeaderContainer >
					<RightBoxHeaderTypography variant='h4' >
						Products In Database
					</RightBoxHeaderTypography>
					<RightBoxSubHeaderTypography variant='h5' >
						Sorted By Release Date
					</RightBoxSubHeaderTypography>
				</ RightBoxHeaderContainer>

				<div style={{ backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)', paddingTop: '2rem', paddingBottom: '2rem' }} >
					{(isDataLoaded)? productGridItems : getPlaceholderCardComponentMemoized}
				</div>
			</RightBoxPaper>

		</MainContentContainer>
	)
}