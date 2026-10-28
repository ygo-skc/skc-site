import { FC, useMemo } from 'react'
import { Button, ButtonBase, Checkbox, Chip, FormControlLabel, InputBase, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { productTypeLabel } from './productUtil'
import { useHistoryEntryState } from '../util/useHistoryEntry'

type ProductBrowseFiltersProps = {
	products: YGOProduct.Info[]
	isLoading: boolean
	query: string
	setQuery: (query: string) => void
	type: string
	setType: (type: string) => void
	subTypes: ReadonlySet<string>
	toggleSubType: (subType: string) => void
}

// sub-types past this many hide behind "Show N more"
const subTypesShown = 7

const countBy = (products: YGOProduct.Info[], key: (product: YGOProduct.Info) => string) =>
	Array.from(products.reduce((map, product) => map.set(key(product), (map.get(key(product)) ?? 0) + 1), new Map<string, number>()).entries()).sort(([, a], [, b]) => b - a)

// sidebar: name / set code search, the product type as one choice, sub-types as checkboxes - counts beside each
const ProductBrowseFilters: FC<ProductBrowseFiltersProps> = ({ products, isLoading, query, setQuery, type, setType, subTypes, toggleSubType }) => {
	// kept for coming back from a product page, since the longer list moves the results down
	const [showAllSubTypes, setShowAllSubTypes] = useHistoryEntryState('product-browse-all-sub-types', false)
	// phones get sub-types as one swipeable row of chips, so they don't push the results a screen down
	const isPhone = useMediaQuery(useTheme().breakpoints.down('sm'), { noSsr: true })

	const types = useMemo(() => countBy(products, (product) => product.productType), [products])
	const subTypeCounts = useMemo(
		() =>
			countBy(
				products.filter((product) => type === 'All' || product.productType === type),
				(product) => product.productSubType
			),
		[products, type]
	)
	const visibleSubTypes = showAllSubTypes ? subTypeCounts : subTypeCounts.slice(0, subTypesShown)

	return (
		<aside className='product-browse-filters' aria-label='Filters'>
			<InputBase
				className='product-browse-filters__search'
				placeholder='Name or set code'
				type='search'
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				startAdornment={<SearchIcon />}
				inputProps={{ 'aria-label': 'Search products' }}
			/>

			<div className='product-browse-filters__group' role='group' aria-labelledby='product-browse-type-label'>
				<Typography variant='subtitle2' component='p' id='product-browse-type-label' className='product-browse-filters__label'>
					Type
				</Typography>
				<ul className='product-browse-filters__types'>
					{isLoading
						? // All plus one per product type
						  Array.from({ length: 6 }, (_, i) => (
								<li key={i}>
									<Skeleton variant='rounded' className='product-browse-filters__type-skeleton' />
								</li>
						  ))
						: [['All', products.length] as const, ...types].map(([value, count]) => (
								<li key={value}>
									<ButtonBase className='product-browse-filters__type' aria-pressed={type === value} onClick={() => setType(value)}>
										<Typography variant='body2' component='span'>
											{value === 'All' ? 'All products' : productTypeLabel(value)}
										</Typography>
										<Typography variant='body2' component='span' className='product-browse-filters__count'>
											{count}
										</Typography>
									</ButtonBase>
								</li>
						  ))}
				</ul>
			</div>

			<div className='product-browse-filters__group' role='group' aria-labelledby='product-browse-sub-type-label'>
				<Typography variant='subtitle2' component='p' id='product-browse-sub-type-label' className='product-browse-filters__label'>
					Sub-type
				</Typography>
				{isLoading && isPhone ? (
					<ul className='product-browse-filters__sub-types'>
						{Array.from({ length: 4 }, (_, i) => (
							<li key={i}>
								<Skeleton variant='rounded' className='product-browse-filters__sub-type-chip-skeleton' />
							</li>
						))}
					</ul>
				) : isLoading ? (
					<>
						{Array.from({ length: 7 }, (_, i) => (
							<Skeleton key={i} variant='rounded' className='product-browse-filters__sub-type-skeleton' />
						))}
						<Skeleton variant='rounded' className='product-browse-filters__more-skeleton' />
					</>
				) : isPhone ? (
					<ul className='product-browse-filters__sub-types'>
						{subTypeCounts.map(([subType, count]) => (
							<li key={subType}>
								<Chip
									className='product-browse-filters__sub-type-chip'
									aria-pressed={subTypes.has(subType)}
									onClick={() => toggleSubType(subType)}
									label={
										<>
											{subType}{' '}
											<Typography variant='inherit' component='span' className='product-browse-filters__count'>
												{count}
											</Typography>
										</>
									}
								/>
							</li>
						))}
					</ul>
				) : (
					<>
						{visibleSubTypes.map(([subType, count]) => (
							<FormControlLabel
								key={subType}
								className='product-browse-filters__sub-type'
								control={<Checkbox size='small' checked={subTypes.has(subType)} onChange={() => toggleSubType(subType)} />}
								label={
									<>
										<Typography variant='body2' component='span'>
											{subType}
										</Typography>
										<Typography variant='body2' component='span' className='product-browse-filters__count'>
											{count}
										</Typography>
									</>
								}
							/>
						))}
						{subTypeCounts.length > subTypesShown && (
							<Button className='product-browse-filters__more' onClick={() => setShowAllSubTypes(!showAllSubTypes)}>
								{showAllSubTypes ? 'Show fewer' : `Show ${subTypeCounts.length - subTypesShown} more`}
							</Button>
						)}
					</>
				)}
			</div>
		</aside>
	)
}

export default ProductBrowseFilters
