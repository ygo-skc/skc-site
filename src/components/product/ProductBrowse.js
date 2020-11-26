import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Typography, Grid } from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'
import { Helmet } from 'react-helmet'

import { MainContentContainer } from '../MainContent'

import {handleFetch} from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'

// const ProductCardGridItem = lazy( () => import('./ProductCardGridItem') )
import ProductCardGridItem from './ProductCardGridItem'

const Breadcrumb = lazy( () => import('../Breadcrumb') )
const Footer = lazy( () => import('../Footer') )

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
					<ProductCardGridItem
						productName={item.productName}
						productId={item.productId}
						productType={item.productType}
						productSubType={item.productSubType}
					/>
				</Grid>
		})

		setProductGridItems(productGridItems)

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