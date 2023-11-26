import { Chip, Skeleton, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { FC, Fragment, SyntheticEvent, useEffect, useState } from 'react'
import { Dates } from '../../helper/Dates'
import { InlineDate } from 'skc-rcl'

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
					<Grid2 key={product.productId} className='list-item-parent' onClick={() => window.location.assign(`/product/${product.productId}`)} xs={12} sm={6} md={4} lg={4} xl={3}>
						<div style={{ width: '23%' }}>
							<img
								style={{ objectFit: 'contain' }}
								width={'100%'}
								src={`https://images.thesupremekingscastle.com/products/sm/${product.productId}.png`}
								onError={(e: SyntheticEvent<HTMLImageElement, Event>) => (e.currentTarget.src = 'https://img.yugioh-card.com/en/wp-content/uploads/2023/06/RA01_550.png')}
							/>
						</div>
						<div className='list-item-text'>
							<InlineDate month={Dates.getMonth(productReleaseDate)} day={+Dates.getDay(productReleaseDate)} year={+Dates.getYear(productReleaseDate)} />
							<Typography variant='body1'>
								{product.productId} &#x25cf; {product.productTotal} Cards
							</Typography>
							<Typography variant='subtitle1'>{product.productName}</Typography>
							<div>
								<Chip className='dark-chip-condensed' key={product.productType} label={product.productType} />
								<Chip className='dark-chip-condensed' key={product.productSubType} label={product.productSubType} />
							</div>
						</div>
					</Grid2>
				)
			})
		)
		setIsDataLoaded(true)
	}, [])

	return (
		<div key={section} style={{ marginBottom: '3rem' }}>
			{!isDataLoaded && <Skeleton variant='rectangular' height='500px' width='100%' className='rounded-skeleton' />}
			{isDataLoaded && (
				<Fragment>
					<Typography variant='h4'>
						{section} • {products.length} Total
					</Typography>
					<Grid2 container>{gridItems}</Grid2>
				</Fragment>
			)}
		</div>
	)
}

export default ProductGrid
