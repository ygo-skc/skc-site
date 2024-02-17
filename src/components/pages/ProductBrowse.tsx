import '../../css/main-pages/product.css'
import '../../css/product/product-grid.css'

import { useState, useEffect, lazy, FunctionComponent, startTransition, Suspense, useCallback } from 'react'
import { Helmet } from 'react-helmet'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import { Dates } from '../../helper/Dates'
import { Button, Skeleton } from '@mui/material'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const ProductGrid = lazy(() => import('../product/ProductGrid'))
const Section = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Section }
	})
)

const ProductBrowse: FunctionComponent = () => {
	const [productGridItems, setProductGridItems] = useState<JSX.Element[]>([])
	const [isDataLoaded, setIsDataLoaded] = useState(false)
	const [showAllProducts, setShowAllProducts] = useState(false)

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch<ProductBrowseResults>(DownstreamServices.NAME_maps_ENDPOINT['productBrowse'], (json: ProductBrowseResults) => {
				const productsByYear = json.products.reduce((map: Map<number, ProductInfo[]>, product: ProductInfo) => {
					const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)

					const year = +Dates.getYear(productReleaseDate)
					map.set(year, map.get(year) ?? [])
					map.get(year)!.push(product)
					return map
				}, new Map<number, ProductInfo[]>())

				setProductGridItems(
					Array.from(productsByYear.keys())
						.filter((year: number) => showAllProducts || year > +Dates.getYear(new Date()) - 3)
						.map((year: number) => <ProductGrid key={year} section={String(year)} products={productsByYear.get(year)!} />)
				)
				setIsDataLoaded(true)
			})
		})
	}, [showAllProducts])

	const loadAllCB = useCallback(() => {
		setShowAllProducts(true)
	}, [])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - Product Browser`}</title>
				<meta name={`SKC - Product Browser`} content={`Browse all products in database to check the progression of YuGiOh.`} />
				<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />
			</Helmet>

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={['Home', 'Product Browse']} />
			</Suspense>

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='40rem' />}>
				{isDataLoaded ? (
					<Section sectionHeaderBackground='product' sectionName='Products In Database'>
						<div className='section-content'>
							{productGridItems}
							{showAllProducts ? undefined : <Button onClick={loadAllCB}>Display All Products</Button>}
						</div>
					</Section>
				) : undefined}
			</Suspense>
		</div>
	)
}

export default ProductBrowse
