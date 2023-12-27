import '../../css/main-pages/product.css'
import '../../css/product/product-grid.css'

import { useState, useEffect, lazy, FunctionComponent, startTransition, Suspense } from 'react'
import { Helmet } from 'react-helmet'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import { Dates } from '../../helper/Dates'
import { Skeleton } from '@mui/material'
import { Section } from 'skc-rcl'
import ProductGrid from '../product/ProductGrid'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))

const ProductBrowse: FunctionComponent = () => {
	const [productGridItems, setProductGridItems] = useState<JSX.Element[]>([])

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch<ProductBrowseResults>(DownstreamServices.NAME_maps_ENDPOINT['productBrowse'], (json: ProductBrowseResults) => {
				const productsByYear = json.products.reduce((map: Map<string, ProductInfo[]>, product: ProductInfo) => {
					const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)

					const yearStr = Dates.getYear(productReleaseDate)
					map.set(yearStr, map.get(yearStr) ?? [])
					map.get(yearStr)!.push(product)
					return map
				}, new Map<string, ProductInfo[]>())

				setProductGridItems(Array.from(productsByYear.keys()).map((year: string) => <ProductGrid key={year} section={year} products={productsByYear.get(year)!} />))
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

			<Suspense fallback={<Skeleton width='100%' height='1.3rem' />}>
				<Breadcrumb crumbs={['Home', 'Product Browse']} />
			</Suspense>

			<Section sectionHeaderBackground='product' sectionName='Products In Database'>
				<div className='section-content'>{productGridItems}</div>
			</Section>
		</div>
	)
}

export default ProductBrowse
