import '../../css/main-pages/product.css'

import { useState, useEffect, lazy, FunctionComponent, Suspense, useCallback, startTransition, JSX } from 'react'

import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'

import * as Dates from '../../helper/Dates'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Skeleton, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const ProductGrid = lazy(() => import('../product/ProductGrid'))
const Section = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Section }
	})
)

// a year heading and a few product tiles shaped like ProductGridItem (cover, release date, id and total, name, type chips)
const ProductSectionSkeleton: FunctionComponent = () => (
	<div className='product-browse-section' aria-hidden='true' data-testid='product-browse-skeleton'>
		<Typography variant='h2'>
			<Skeleton width='10rem' />
		</Typography>
		<Grid container spacing={1}>
			{Array.from({ length: 6 }, (_, i) => (
				<Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
					<div className='product-grid-item-parent'>
						<div className='product-img'>
							<Skeleton className='product-grid-skeleton__cover' variant='rounded' />
						</div>
						<div className='product-grid-item-text'>
							<Skeleton className='product-grid-skeleton__pill product-grid-skeleton__date' variant='rounded' width={145} height={32} />
							<Typography variant='body1'>
								<Skeleton width='60%' />
							</Typography>
							<Typography variant='h5'>
								<Skeleton width='85%' />
							</Typography>
							<div className='product-grid-skeleton__chips'>
								<Skeleton className='product-grid-skeleton__pill' variant='rounded' width={33} height={29} />
								<Skeleton className='product-grid-skeleton__pill' variant='rounded' width={75} height={29} />
							</div>
						</div>
					</div>
				</Grid>
			))}
		</Grid>
	</div>
)

const ProductBrowse: FunctionComponent = () => {
	const [products, setProducts] = useState<YGOProduct.Info[]>([])
	const [productGridItems, setProductGridItems] = useState<JSX.Element[]>([])

	const [isDataLoaded, setIsDataLoaded] = useState(false)
	const [isFetchingProducts, setIsFetchingProducts] = useState(true)
	const [loadAll, setLoadAll] = useState(false)

	const [productTypes, setProductTypes] = useState<JSX.Element[]>([])
	const [productTypeFilter, setProductTypeFilter] = useState('All')

	const [productSubTypes, setProductSubTypes] = useState<JSX.Element[]>([])
	const [productSubTypesFilter, setProductSubTypesFilter] = useState('All')

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch<YGOData.ProductBrowseResult>(DownstreamServices.SKC_API_ENDPOINTS.productBrowse, (json: YGOData.ProductBrowseResult) => {
				setProducts(json.products)
				setIsFetchingProducts(false)
			})
		})
	}, [])

	useEffect(() => {
		const pt = Array.from(new Set(products.map((product: YGOProduct.Info) => product.productType))).map((productType: string) => (
			<FormControlLabel key={productType} value={productType} control={<Radio />} label={productType} />
		))

		setProductTypes([<FormControlLabel key='All' value='All' control={<Radio />} label='All' />, ...pt])
	}, [products])

	useEffect(() => {
		startTransition(() => {
			const pst = Array.from(
				new Set(
					products
						.filter((product: YGOProduct.Info) => productTypeFilter === 'All' || product.productType === productTypeFilter)
						.map((product: YGOProduct.Info) => product.productSubType)
				)
			).map((productSubType: string) => <FormControlLabel key={productSubType} value={productSubType} control={<Radio />} label={productSubType} />)

			const filteredProducts = products
				.filter((product: YGOProduct.Info) => loadAll || +Dates.getYear(Dates.fromYYYYMMDDToDate(product.productReleaseDate)) > +Dates.getYear(new Date()) - 3)
				.filter((product: YGOProduct.Info) => productTypeFilter === 'All' || product.productType === productTypeFilter)
				.filter((product: YGOProduct.Info) => productSubTypesFilter === 'All' || product.productSubType === productSubTypesFilter)
				.reduce((map: Map<number, YGOProduct.Info[]>, product: YGOProduct.Info) => {
					const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)
					const year = +Dates.getYear(productReleaseDate)

					map.set(year, map.get(year) ?? [])
					map.get(year)!.push(product)
					return map
				}, new Map<number, YGOProduct.Info[]>())

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
			<meta name='description' content={`Browse all products in database to check the progression of YuGiOh.`} />
			<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />

			<Suspense fallback={<Skeleton className='breadcrumb breadcrumb__loading' variant='rectangular' width={260} height={30} />}>
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

							{isFetchingProducts ? <ProductSectionSkeleton /> : productGridItems}
							{loadAll ? undefined : <Button onClick={loadAllCB}>Load All</Button>}
						</div>
					) : undefined}
				</Section>
			</Suspense>
		</div>
	)
}

export default ProductBrowse
