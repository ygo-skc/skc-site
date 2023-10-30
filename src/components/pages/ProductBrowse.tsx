import '../../css/util/list.css'

import { useState, useEffect, lazy, FunctionComponent, startTransition } from 'react'
import { Helmet } from 'react-helmet'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import { Dates } from '../../helper/Dates'
import { Chip, Skeleton, Typography } from '@mui/material'
import { DateComponent, Section } from 'skc-rcl'
import Grid2 from '@mui/material/Unstable_Grid2'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))

const ProductBrowse: FunctionComponent = () => {
	const [productJson, setProductJson] = useState<ProductInfo[]>([])
	const [productGridItems, setProductGridItems] = useState<JSX.Element[]>([])
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	useEffect(() => {
		FetchHandler.handleFetch<ProductBrowseResults>(DownstreamServices.NAME_maps_ENDPOINT['productBrowse'], (json) => {
			startTransition(() => {
				setProductJson(json.products)
			})
		})
	}, [])

	useEffect(() => {
		const x: JSX.Element[] = productJson.map((product: ProductInfo): JSX.Element => {
			const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)

			return (
				<Grid2 key={product.productId} className='list-item-parent' onClick={() => window.location.assign(`/product/${product.productId}`)} xs={12} sm={6} md={4} lg={4} xl={3}>
					{' '}
					<DateComponent month={Dates.getMonth(productReleaseDate)} day={+Dates.getDay(productReleaseDate)} year={+Dates.getYear(productReleaseDate)} variant='condensed' />
					<div className='list-item-text'>
						<Typography variant='body1'>
							{product.productId} &#x25cf; Total Cards - {product.productTotal}
						</Typography>
						<Typography variant='subtitle1'>{product.productName}</Typography>
						<div>
							<Typography variant='body1' className='rarities'>
								Product Types
							</Typography>
							<Chip className='dark-chip-condensed' key={product.productType} label={product.productType} />
							<Chip className='dark-chip-condensed' key={product.productSubType} label={product.productSubType} />
						</div>
					</div>
				</Grid2>
			)
		})

		startTransition(() => {
			setProductGridItems(x)
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
					{!isDataLoaded && <Skeleton variant='rectangular' height='500px' width='100%' className='rounded-skeleton' />}
					{isDataLoaded && <Grid2 container>{productGridItems}</Grid2>}
				</div>
			</Section>
		</div>
	)
}

export default ProductBrowse
