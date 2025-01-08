import '../../css/main-pages/product.css'

import { useState, useEffect, lazy, FunctionComponent, Suspense, useCallback, startTransition, JSX } from 'react'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import { Dates } from '../../helper/Dates'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Skeleton, Typography } from '@mui/material'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const ProductGrid = lazy(() => import('../product/ProductGrid'))
const Section = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Section }
	})
)

const ProductBrowse: FunctionComponent = () => {
	const [products, setProducts] = useState<YGOProductInfo[]>([])
	const [productGridItems, setProductGridItems] = useState<JSX.Element[]>([])

	const [isDataLoaded, setIsDataLoaded] = useState(false)
	const [loadAll, setLoadAll] = useState(false)

	const [productTypes, setProductTypes] = useState<JSX.Element[]>([])
	const [productTypeFilter, setProductTypeFilter] = useState('All')

	const [productSubTypes, setProductSubTypes] = useState<JSX.Element[]>([])
	const [productSubTypesFilter, setProductSubTypesFilter] = useState('All')

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch<YGOProductBrowseResults>(DownstreamServices.NAME_maps_ENDPOINT.productBrowse, (json: YGOProductBrowseResults) => {
				setProducts(json.products)
			})
		})
	}, [])

	useEffect(() => {
		const pt = Array.from(new Set(products.map((product: YGOProductInfo) => product.productType))).map((productType: string) => (
			<FormControlLabel key={productType} value={productType} control={<Radio />} label={productType} />
		))

		setProductTypes([<FormControlLabel key='All' value='All' control={<Radio />} label='All' />, ...pt])
	}, [products])

	useEffect(() => {
		startTransition(() => {
			const pst = Array.from(
				new Set(
					products
						.filter((product: YGOProductInfo) => productTypeFilter === 'All' || product.productType === productTypeFilter)
						.map((product: YGOProductInfo) => product.productSubType)
				)
			).map((productSubType: string) => <FormControlLabel key={productSubType} value={productSubType} control={<Radio />} label={productSubType} />)

			const filteredProducts = products
				.filter((product: YGOProductInfo) => loadAll || +Dates.getYear(Dates.fromYYYYMMDDToDate(product.productReleaseDate)) > +Dates.getYear(new Date()) - 3)
				.filter((product: YGOProductInfo) => productTypeFilter === 'All' || product.productType === productTypeFilter)
				.filter((product: YGOProductInfo) => productSubTypesFilter === 'All' || product.productSubType === productSubTypesFilter)
				.reduce((map: Map<number, YGOProductInfo[]>, product: YGOProductInfo) => {
					const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)
					const year = +Dates.getYear(productReleaseDate)

					map.set(year, map.get(year) ?? [])
					map.get(year)!.push(product)
					return map
				}, new Map<number, YGOProductInfo[]>())

			setProductSubTypes([<FormControlLabel key='All' value='All' control={<Radio />} label='All' />, ...pst])
			setProductGridItems(Array.from(filteredProducts.keys()).map((year: number) => <ProductGrid key={year} section={String(year)} products={filteredProducts.get(year)!} />))
		})
	}, [products, loadAll, productTypeFilter, productSubTypesFilter])

	useEffect(() => {
		startTransition(() => {
			setIsDataLoaded(true)
		})
	}, [productGridItems])

	const loadAllCB = useCallback(() => {
		setLoadAll(true)
	}, [setLoadAll])

	const handleProductTypeFilterChangedCB = useCallback(
		(_: React.ChangeEvent<HTMLInputElement>, value: string) => {
			setProductTypeFilter(value)
			setProductSubTypesFilter('All')
		},
		[setProductTypeFilter]
	)

	const handleProductSubTypeFilterChangedCB = useCallback(
		(_: React.ChangeEvent<HTMLInputElement>, value: string) => {
			setProductSubTypesFilter(value)
		},
		[setProductSubTypesFilter]
	)

	return (
		<div className='generic-container'>
			<title>{`SKC - Product Browser`}</title>
			<meta name={`SKC - Product Browser`} content={`Browse all products in database to check the progression of YuGiOh.`} />
			<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={['Home', 'Product Browse']} />
			</Suspense>

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='40rem' />}>
				<Section sectionHeaderBackground='product' sectionName='Products In Database'>
					{isDataLoaded ? (
						<div className='section-content'>
							<Typography variant='h2'>Filters</Typography>
							<div className='group'>
								<FormControl>
									<FormLabel id='product-type-label'>Product Type</FormLabel>
									<RadioGroup value={productTypeFilter} onChange={handleProductTypeFilterChangedCB} row aria-labelledby='product-type-label' name='product-type-radio-group'>
										{productTypes}
									</RadioGroup>
								</FormControl>
							</div>

							<div className='group'>
								<FormControl>
									<FormLabel id='product-sub-type-label'>Product Sub-type</FormLabel>
									<RadioGroup
										value={productSubTypesFilter}
										onChange={handleProductSubTypeFilterChangedCB}
										row
										aria-labelledby='product-sub-type-label'
										name='product-sub-type-radio-group'
									>
										{productSubTypes}
									</RadioGroup>
								</FormControl>
							</div>

							{productGridItems}
							{loadAll ? undefined : <Button onClick={loadAllCB}>Load All</Button>}
						</div>
					) : undefined}
				</Section>
			</Suspense>
		</div>
	)
}

export default ProductBrowse
