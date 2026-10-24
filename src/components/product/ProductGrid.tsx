import { FC } from 'react'
import { Typography } from '@mui/material'
import * as Dates from '../../helper/Dates'
import ProductGridItem from './ProductGridItem'
import ProductListRow from './ProductListRow'

export type ProductView = 'list' | 'cards'

type ProductGridProps = {
	section: string
	products: YGOProduct.Info[]
	view: ProductView
}

// one year of products: the year and its count, then a white grouped list or a grid of tiles
const ProductGrid: FC<ProductGridProps> = ({ section, products, view }) => (
	<section id={`products-${section}`} className='product-browse-section' aria-labelledby={`products-${section}-heading`}>
		<div className='product-browse-section__head'>
			<Typography variant='h4' component='h3' id={`products-${section}-heading`}>
				{section}
			</Typography>
			<Typography variant='body2' component='span' className='product-browse-section__count'>
				{products.length} release{products.length === 1 ? '' : 's'}
			</Typography>
		</div>

		{view === 'list' ? (
			<ul className='product-list'>
				{products.map((product) => (
					<ProductListRow key={product.productId} product={product} />
				))}
			</ul>
		) : (
			<ul className='product-tiles'>
				{products.map((product) => (
					<ProductGridItem
						key={product.productId}
						id={product.productId}
						name={product.productName}
						type={product.productType}
						subType={product.productSubType}
						totalItems={product.productTotal}
						releaseDate={Dates.fromYYYYMMDDToDate(product.productReleaseDate)}
					/>
				))}
			</ul>
		)}
	</section>
)

export default ProductGrid
