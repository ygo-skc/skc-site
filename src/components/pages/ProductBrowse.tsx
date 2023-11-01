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
	const [productGridItems, setProductGridItems] = useState<JSX.Element[]>([])
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	useEffect(() => {
		FetchHandler.handleFetch<ProductBrowseResults>(DownstreamServices.NAME_maps_ENDPOINT['productBrowse'], (json: ProductBrowseResults) => {
			startTransition(() => {
				// setProductJson(json.products)
				const x = json.products.reduce((map: Map<string, JSX.Element[]>, product: ProductInfo) => {
					const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)

					const yearStr = Dates.getYear(productReleaseDate)
					map.set(yearStr, map.get(yearStr) ?? [])
					map.get(yearStr)!.push(
						<Grid2 key={product.productId} className='list-item-parent' onClick={() => window.location.assign(`/product/${product.productId}`)} xs={12} sm={6} md={4} lg={4} xl={3}>
							<DateComponent month={Dates.getMonth(productReleaseDate)} day={+Dates.getDay(productReleaseDate)} year={+Dates.getYear(productReleaseDate)} variant='condensed' />
							<div className='list-item-text'>
								<Typography variant='body1'>
									{product.productId} &#x25cf; {product.productTotal} Cards
								</Typography>
								<Typography variant='subtitle1'>{product.productName}</Typography>
								<div>
									<Chip className='dark-chip-condensed' key={product.productType} label={product.productType} />
									<Chip className='dark-chip-condensed' key={product.productSubType} label={product.productSubType} />
								</div>
							</div>
						</Grid2>
					)
					return map
				}, new Map<string, JSX.Element[]>())

				const y = Array.from(x.keys()).map((year: string) => {
					return (
						<div key={year} style={{ marginBottom: '2rem' }}>
							<Typography variant='h2'>{year}</Typography>
							<Grid2 container>{x.get(year)}</Grid2>
						</div>
					)
				})

				setProductGridItems(y)
				setIsDataLoaded(true)
			})
		})
	}, [])

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
					{!isDataLoaded && <Skeleton variant='rectangular' height='500px' width='100%' className='rounded-skeleton' />}
					{isDataLoaded && productGridItems}
				</div>
			</Section>
		</div>
	)
}

export default ProductBrowse
