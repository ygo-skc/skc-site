import { useState, useEffect, lazy, FunctionComponent, startTransition } from 'react'
import { Helmet } from 'react-helmet'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import createTable from '../util/generic/TableHelpers'
import { Dates } from '../../helper/Dates'
import { Skeleton, Typography } from '@mui/material'
import { Section } from 'skc-rcl'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))

const ProductBrowse: FunctionComponent = () => {
	const [productJson, setProductJson] = useState([])
	const [productGridItems, setProductGridItems] = useState<JSX.Element | undefined>(undefined)
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	useEffect(() => {
		FetchHandler.handleFetch(DownstreamServices.NAME_maps_ENDPOINT['productBrowse'], (json) => {
			startTransition(() => {
				setProductJson(json.products)
			})
		})
	}, [])

	useEffect(() => {
		const headers: string[] = ['Name', 'ID', 'Type', 'Sub-Type', 'Release']
		const rowOnClick: { (): void }[] = []
		const productRows: string[][] = productJson.map((product: ProductInfo): string[] => {
			rowOnClick.push(() => window.location.assign(`/product/${product.productId}`))
			return [product.productName!, product.productId, product.productType!, product.productSubType!, Dates.fromYYYYMMDDToDateStr(product.productReleaseDate)]
		})

		startTransition(() => {
			setProductGridItems(createTable(headers, productRows, rowOnClick, true))
			setIsDataLoaded(true)
		})
	}, [productJson])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - Product Browser`}</title>
				<meta name={`SKC - Product Browser`} content={`Browse all products in database to check the progression of YuGiOh.`} />
				<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={['Home', 'Product Browse']} />

			<Section sectionHeaderBackground='product' sectionName='Products In Database'>
				<div className='section-content'>
					<Typography variant='h5'>Sorted By Release Date</Typography>
					{!isDataLoaded && <Skeleton variant='rectangular' height='500' width='100%' className='rounded-skeleton' />}
					{isDataLoaded && productGridItems}
				</div>
			</Section>
		</div>
	)
}

export default ProductBrowse
