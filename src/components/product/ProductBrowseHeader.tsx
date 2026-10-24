import '../../css/main-pages/product-browse-header.css'

import { FC, useEffect, useMemo, useRef } from 'react'
import { Skeleton, Typography } from '@mui/material'
import { productTypeLabel, releaseYear } from './productUtil'

type ProductBrowseHeaderProps = {
	products: YGOProduct.Info[]
	isLoading: boolean
	onPickYear: (year: number) => void
}

// white card: the product count with a total per product type, and a bar per year from the first release to the latest
const ProductBrowseHeader: FC<ProductBrowseHeaderProps> = ({ products, isLoading, onPickYear }) => {
	const totals = useMemo(() => {
		const byType = products.reduce((map, product) => map.set(product.productType, (map.get(product.productType) ?? 0) + 1), new Map<string, number>())
		return Array.from(byType.entries()).sort(([, a], [, b]) => b - a)
	}, [products])

	const years = useMemo(() => {
		if (products.length === 0) return []
		const byYear = products.reduce((map, product) => map.set(releaseYear(product), (map.get(releaseYear(product)) ?? 0) + 1), new Map<number, number>())
		const first = Math.min(...byYear.keys())
		const last = Math.max(...byYear.keys())
		// years without a release still get a slot so the bars stay to scale in time
		return Array.from({ length: last - first + 1 }, (_, i) => ({ year: first + i, count: byYear.get(first + i) ?? 0 }))
	}, [products])

	const busiest = Math.max(1, ...years.map(({ count }) => count))
	const latestYear = years[years.length - 1]?.year

	// when the graph is wider than the card (phones), open it on the latest years
	const graphRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (graphRef.current) graphRef.current.scrollLeft = graphRef.current.scrollWidth
	}, [years])

	return (
		<header className='product-browse-header'>
			<div className='product-browse-header__top'>
				<div className='product-browse-header__title'>
					<Typography variant='subtitle2' component='p' className='product-browse-header__eyebrow'>
						Products · TCG
					</Typography>
					<Typography variant='h1'>
						{isLoading ? (
							<>
								<Skeleton className='product-browse-header__h1-skeleton' width='20ch' />
								{/* phones wrap the heading onto a second line */}
								<Skeleton className='product-browse-header__phone-line' width='6ch' />
							</>
						) : (
							<>
								{products.length}{' '}
								<Typography variant='inherit' component='span' className='product-browse-header__since'>
									releases since {years[0]?.year}
								</Typography>
							</>
						)}
					</Typography>
				</div>

				<ul className='product-browse-header__totals' aria-label='Totals'>
					{isLoading
						? // one per product type, each about as wide as a count
						  Array.from({ length: 5 }, (_, i) => (
								<li key={i}>
									<Skeleton variant='rounded' className='product-browse-header__total-skeleton' />
								</li>
						  ))
						: totals.map(([type, count]) => (
								<li key={type}>
									<Typography variant='h4' component='span' className='product-browse-header__total-count'>
										{count}
									</Typography>
									<Typography variant='body2' component='span' className='product-browse-header__total-label'>
										{productTypeLabel(type)}
									</Typography>
								</li>
						  ))}
				</ul>
			</div>

			<div ref={graphRef} className='product-browse-header__graph' role='group' aria-label='Releases per year'>
				{isLoading ? (
					<Skeleton variant='rounded' className='product-browse-header__graph-skeleton' />
				) : (
					<div className='product-browse-header__bars'>
						{years.map(({ year, count }) => (
							<button
								key={year}
								type='button'
								className='product-browse-header__bar'
								aria-current={year === latestYear ? 'true' : undefined}
								aria-label={`${year}, ${count} release${count === 1 ? '' : 's'}`}
								disabled={count === 0}
								onClick={() => onPickYear(year)}
							>
								<Typography variant='body2' component='span' aria-hidden='true'>
									{count}
								</Typography>
								<span className='product-browse-header__bar-fill' style={{ '--share': count / busiest } as React.CSSProperties} />
								<Typography variant='body2' component='span' aria-hidden='true'>
									&rsquo;{String(year).slice(2)}
								</Typography>
							</button>
						))}
					</div>
				)}
			</div>
		</header>
	)
}

export default ProductBrowseHeader
