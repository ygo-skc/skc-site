import { Skeleton, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { FC, Fragment, lazy, useEffect, useState } from 'react'
import { Dates } from '../../helper/Dates'

const ProductGridItem = lazy(() => import('./ProductGridItem'))

type ProductGridProps = {
	section: string
	products: ProductInfo[]
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
		setIsDataLoaded(true)
	}, [])

	return (
		<div key={section} className='product-browse-section'>
			{!isDataLoaded && <Skeleton variant='rectangular' height='500px' width='100%' className='rounded-skeleton' />}
			{isDataLoaded && (
				<Fragment>
					<Typography variant='h1'>
						{section} • {products.length} Total
					</Typography>
					<Grid2 container spacing={1}>
						{gridItems}
					</Grid2>
				</Fragment>
			)}
		</div>
	)
}

export default ProductGrid
