import { Skeleton, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { FC, Fragment, JSX, startTransition, useEffect, useState } from 'react'
import { Dates } from '../../helper/Dates'
import ProductGridItem from './ProductGridItem'

type ProductGridProps = {
	section: string
	products: YGOProduct.Info[]
}

const ProductGrid: FC<ProductGridProps> = ({ section, products }) => {
	const [isDataLoaded, setIsDataLoaded] = useState(false)
	const [gridItems, setGridItems] = useState<JSX.Element[]>([])

	useEffect(() => {
		setGridItems(
			products.map((product) => {
				const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)
				return (
					<ProductGridItem
						key={product.productId}
						id={product.productId}
						name={product.productName}
						type={product.productType}
						subType={product.productSubType}
						totalItems={product.productTotal}
						releaseDate={productReleaseDate}
					/>
				)
			})
		)
	}, [products])

	useEffect(() => {
		startTransition(() => {
			setIsDataLoaded(true)
		})
	}, [gridItems])

	return (
		<div key={section} className='product-browse-section'>
			{!isDataLoaded && <Skeleton variant='rectangular' height='500px' width='100%' className='rounded-skeleton' />}
			{isDataLoaded && (
				<Fragment>
					<Typography variant='h2'>
						{section} • {products.length} Total
					</Typography>
					<Grid container spacing={1}>
						{gridItems}
					</Grid>
				</Fragment>
			)}
		</div>
	)
}

ProductGrid.displayName = 'ProductGrid'
export default ProductGrid
