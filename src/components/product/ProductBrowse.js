import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Paper, Typography, Grid, Box } from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'

import Breadcrumb from '../Breadcrumb'
import { MainContentContainer } from '../MainContent'
import OneThirdTwoThirdsGrid from '../grid/OneThirdTwoThirdsGrid'
import Footer from '../Footer'

import {handleFetch} from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'

import Styled from 'styled-components'

const MainBrowseInfoTypography = Styled(Typography)`
	&&
	{
		color: rgba(255, 255, 255, .95);
	}
`

const MainBrowseInfoTypography2 = Styled(Typography)`
	&&
	{
		color: rgba(0, 0, 0, .79);
	}
`


const ProductInstance = Styled(Paper)`
	&&
	{
		background-color: #cdc1ff;
		background-image: linear-gradient(316deg, #cdc1ff 0%, #e5d9f2 74%);
		padding: 1.75rem;

		cursor: pointer;
	}
`


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

	const getPlaceholderCardComponentMemoized = useMemo(() => getPlaceholderCardComponent(), [isDataLoaded])


	useEffect( () => {
		document.title = 'SKC - Product Browse'

		handleFetch(NAME_maps_ENDPOINT['productBrowse'], history, json => {
			setProductJson(json.products)
			setIsDataLoaded(true)
		})
	}, [])


	useEffect( () => {
		const productGridItems =  productJson.map( item => {
			return <Grid
				item
				xs={6}
				sm={4}
				md={3}
				lg={2}
				xl={1}
				key={item.productId}
				style={{padding: '.5rem', display: 'inline-grid'}}
				onClick={ () => window.location.assign(`/product/${item.productId}`) }
				>
					<ProductInstance
						style={{padding: '.75rem'}}
						>
						<MainBrowseInfoTypography2
							style={{marginBottom: '1rem'}}
							variant='subtitle1'
							align='center' >
							{item.productName}
						</MainBrowseInfoTypography2>
						<MainBrowseInfoTypography2
							variant='subtitle2' >
							ID: {item.productId}
						</MainBrowseInfoTypography2>
						<MainBrowseInfoTypography2
							variant='subtitle2' >
							Type: {item.productType}
						</MainBrowseInfoTypography2>
						<MainBrowseInfoTypography2
							variant='subtitle2' >
							Sub-Type: {item.productSubType}
						</MainBrowseInfoTypography2>
					</ProductInstance>
				</Grid>
		})

		setProductGridItems(productGridItems)

	}, [productJson])


	return (
		<MainContentContainer style={{}} >
			<Breadcrumb crumbs={ ['Home', 'Product Browse'] } />

			<Typography
				variant='h4'
				align='center'
				style={{marginBottom: '2rem'}} >
				Product Browse Tool
			</Typography>

			<Grid style={{width: '100%', gridAutoRows: '1fr'}} container spacing={0} >
				{(isDataLoaded)? productGridItems : getPlaceholderCardComponentMemoized}
			</Grid>

			<Footer />
		</MainContentContainer>
	)
}