import '../../css/main-pages/product.css'

import { useState, useEffect, FunctionComponent, useCallback, useMemo, startTransition } from 'react'

import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'

import * as Dates from '../../helper/Dates'
import { Button, Skeleton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ProductBrowseHeader from '../product/ProductBrowseHeader'
import ProductLatestRelease from '../product/ProductLatestRelease'
import ProductBrowseFilters from '../product/ProductBrowseFilters'
import ProductGrid, { ProductView } from '../product/ProductGrid'
import { productTypeLabel, releaseYear } from '../product/productUtil'
import { usePageView } from '../util/ResultsViewPreference'
import Breadcrumb from '../header-footer/Breadcrumb'
import useHistoryEntry, { useHistoryEntryState } from '../util/useHistoryEntry'

// a year heading and a white list of rows shaped like ProductListRow (thumb, name over meta, card count over date)
const ProductSectionSkeleton: FunctionComponent = () => (
	<div className='product-browse-section' aria-hidden='true' data-testid='product-browse-skeleton'>
		<div className='product-browse-section__head'>
			<Typography variant='h4' component='span'>
				<Skeleton width='4ch' />
			</Typography>
		</div>
		<ul className='product-list'>
			{Array.from({ length: 6 }, (_, i) => (
				<li key={i}>
					<span className='product-list-row'>
						<Skeleton className='product-list-row__thumb' variant='rounded' />
						<span className='product-list-row__text'>
							<Typography variant='subtitle1' component='span' className='product-list-row__name'>
								<Skeleton width='60%' />
							</Typography>
							<Typography variant='body2' component='span'>
								<Skeleton width='40%' />
							</Typography>
						</span>
						<span className='product-list-row__end'>
							<Typography variant='body2' component='span'>
								<Skeleton width='4.5em' />
							</Typography>
							<Typography variant='body2' component='span'>
								<Skeleton width='2.5em' />
							</Typography>
						</span>
					</span>
				</li>
			))}
		</ul>
	</div>
)

// the products are only kept once they've loaded, since a restored page doesn't fetch them again
const hasProducts = (products: YGOProduct.Info[]) => products.length > 0

// filters matching fewer products than this show every year instead of the last few
const showAllUnder = 100

const ProductBrowse: FunctionComponent = () => {
	// kept for coming back from a product page: the products, the filters and how many years show, so the page has its full height
	const [products, setProducts, isRestored] = useHistoryEntryState<YGOProduct.Info[]>('product-browse', [], hasProducts)
	const [isFetchingProducts, setIsFetchingProducts] = useState(!isRestored)
	const [loadAll, setLoadAll] = useHistoryEntryState('product-browse-load-all', false)

	const [query, setQuery] = useHistoryEntryState('product-browse-query', '')
	const [productTypeFilter, setProductTypeFilter] = useHistoryEntryState('product-browse-type', 'All')
	const [productSubTypesFilter, setProductSubTypesFilter] = useHistoryEntryState<ReadonlySet<string>>('product-browse-sub-types', new Set())
	const [savedView, rememberView] = useHistoryEntry<ProductView>('product-browse-view')
	const [view, setView] = usePageView<ProductView>({ list: 'list', grid: 'cards' }, savedView)
	useEffect(() => {
		rememberView(view)
	}, [view, rememberView])

	// a year picked on the header's graph, scrolled to once its section renders
	const [pickedYear, setPickedYear] = useState<number>()

	useEffect(() => {
		if (isRestored) return
		startTransition(() => {
			FetchHandler.handleFetch<YGOData.ProductBrowseResult>(DownstreamServices.SKC_API_ENDPOINTS.productBrowse, (json: YGOData.ProductBrowseResult) => {
				setProducts(json.products)
				setIsFetchingProducts(false)
			})
		})
	}, [isRestored, setProducts])

	const matchingProducts = useMemo(() => {
		const search = query.trim().toLowerCase()
		return products
			.filter((product) => productTypeFilter === 'All' || product.productType === productTypeFilter)
			.filter((product) => productSubTypesFilter.size === 0 || productSubTypesFilter.has(product.productSubType))
			.filter((product) => search === '' || product.productName.toLowerCase().includes(search) || product.productId.toLowerCase().includes(search))
			.sort((a, b) => b.productReleaseDate.localeCompare(a.productReleaseDate))
	}, [products, query, productTypeFilter, productSubTypesFilter])

	// only the last few years show until everything is loaded - unless the filters leave few enough to show at once (e.g. "Other"),
	// or it's a search, which looks through every year
	const showsEveryYear = loadAll || query.trim() !== '' || matchingProducts.length < showAllUnder
	const oldestRecentYear = +Dates.getYear(new Date()) - 2
	const oldestShownYear = showsEveryYear ? -Infinity : oldestRecentYear
	const shownProducts = useMemo(() => matchingProducts.filter((product) => releaseYear(product) >= oldestShownYear), [matchingProducts, oldestShownYear])
	const hiddenCount = matchingProducts.length - shownProducts.length

	const productsByYear = useMemo(
		() =>
			Array.from(
				shownProducts.reduce((map, product) => map.set(releaseYear(product), [...(map.get(releaseYear(product)) ?? []), product]), new Map<number, YGOProduct.Info[]>()).entries()
			),
		[shownProducts]
	)

	useEffect(() => {
		if (pickedYear === undefined) return
		// an older year's section only exists once everything has loaded, so keep the pick until it renders
		const section = document.getElementById(`products-${pickedYear}`)
		if (!section) return
		// jump rather than smooth scroll - lazy covers loading on the way would push the year further down
		section.scrollIntoView({ block: 'start' })
		setPickedYear(undefined)
	}, [pickedYear, productsByYear])

	const handlePickYearCB = useCallback(
		(year: number) => {
			// the graph counts every product - a year the filters leave empty clears them, so the tap still lands on its releases
			// (otherwise the pick would wait, and jump the page whenever the filters next let that year show)
			if (!matchingProducts.some((product) => releaseYear(product) === year)) {
				setQuery('')
				setProductTypeFilter('All')
				setProductSubTypesFilter(new Set())
			}
			// with the filters cleared only the recent years may show, so an older pick loads the rest
			if (year < oldestRecentYear) setLoadAll(true)
			setPickedYear(year)
		},
		[matchingProducts, oldestRecentYear]
	)

	const handleProductTypeFilterChangedCB = useCallback((type: string) => {
		setProductTypeFilter(type)
		// sub-types belong to a type, so start them over
		setProductSubTypesFilter(new Set())
	}, [])

	const toggleSubTypeCB = useCallback((subType: string) => {
		setProductSubTypesFilter((subTypes) => {
			const next = new Set(subTypes)
			if (!next.delete(subType)) next.add(subType)
			return next
		})
	}, [])

	return (
		<div className='generic-container'>
			<title>{`SKC - Product Browser`}</title>
			<meta name='description' content={`Browse all products in database to check the progression of YuGiOh.`} />
			<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />

			<Breadcrumb crumbs={['Home', 'Product Browse']} />

			<ProductBrowseHeader products={products} isLoading={isFetchingProducts} onPickYear={handlePickYearCB} />

			<ProductLatestRelease products={products} isLoading={isFetchingProducts} />

			<div className='product-browse'>
				<ProductBrowseFilters
					products={products}
					isLoading={isFetchingProducts}
					query={query}
					setQuery={setQuery}
					type={productTypeFilter}
					setType={handleProductTypeFilterChangedCB}
					subTypes={productSubTypesFilter}
					toggleSubType={toggleSubTypeCB}
				/>

				<div className='product-browse__results'>
					<div className='product-browse__tools'>
						<Typography variant='h3' component='h2' className='product-browse__title'>
							{productTypeFilter === 'All' ? 'All products' : productTypeLabel(productTypeFilter)}
						</Typography>
						<Typography variant='body2' className='product-browse__count'>
							{isFetchingProducts ? <Skeleton width='9em' /> : `${matchingProducts.length} · newest first`}
						</Typography>
						<ToggleButtonGroup className='product-browse__view' exclusive aria-label='View' value={view} onChange={(_, value: ProductView | null) => value && setView(value)}>
							<ToggleButton value='list'>
								<TableRowsRoundedIcon />
								List
							</ToggleButton>
							<ToggleButton value='cards'>
								<GridViewRoundedIcon />
								Cards
							</ToggleButton>
						</ToggleButtonGroup>
					</div>

					{isFetchingProducts ? (
						<ProductSectionSkeleton />
					) : matchingProducts.length === 0 ? (
						<Typography variant='body1' className='product-browse__empty'>
							No products match these filters.
						</Typography>
					) : (
						productsByYear.map(([year, yearProducts]) => <ProductGrid key={year} section={String(year)} products={yearProducts} view={view} />)
					)}

					{hiddenCount > 0 && (
						<Button className='product-browse__more' onClick={() => setLoadAll(true)}>
							Show {hiddenCount} earlier
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProductBrowse
