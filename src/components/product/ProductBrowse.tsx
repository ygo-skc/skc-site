import { useState, useEffect, lazy, FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'

import Fetch from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import createTable from '../util/TableHelpers'
import { Dates } from '../../helper/Dates'
import Section from '../util/Section'
import { Typography } from '@mui/material'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))

const ProductBrowse: FunctionComponent = () => {
	const [productJson, setProductJson] = useState([])
	const [productGridItems, setProductGridItems] = useState<JSX.Element | undefined>(undefined)
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	useEffect(() => {
		Fetch.handleFetch(DownstreamServices.NAME_maps_ENDPOINT['productBrowse'], (json) => {
			setProductJson(json.products)
			setIsDataLoaded(true)
		})
	}, [])

	useEffect(() => {
		const headers: string[] = ['Name', 'ID', 'Type', 'Sub-Type', 'Release']
		const rowOnClick: { (): void }[] = []
		const productRows: string[][] = productJson.map((product: ProductInfo): string[] => {
			rowOnClick.push(() => window.location.assign(`/product/${product.productId}`))
			return [product.productName!, product.productId, product.productType!, product.productSubType!, Dates.getDateString(new Date(product.productReleaseDate))]
		})

		setProductGridItems(createTable(headers, productRows, rowOnClick, true))
	}, [productJson])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - Product Browser`}</title>
				<meta name={`SKC - Product Browser`} content={`Browse all products in database to check the progression of YuGiOh.`} />
				<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={['Home', 'Product Browse']} />

			<Section
				sectionHeaderBackground='product'
				sectionName='Products In Database'
				sectionContent={
					<div className='section-content'>
						<Typography variant='h5'>Sorted By Release Date</Typography>
						<div
							style={{
								paddingTop: '0rem',
								paddingBottom: '0rem',
								paddingLeft: '0rem',
								paddingRight: '0rem',
								borderRadius: '1.1rem',
							}}
						>
							{isDataLoaded ? productGridItems : undefined}
						</div>
					</div>
				}
			></Section>
		</div>
	)
}

export default ProductBrowse
