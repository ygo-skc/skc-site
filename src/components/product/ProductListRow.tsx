import { FC } from 'react'
import { Typography } from '@mui/material'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { Link } from 'react-router-dom'
import { ProductImage } from 'skc-rcl'
import * as Dates from '../../helper/Dates'

type ProductListRowProps = {
	product: YGOProduct.Info
}

// one row of the grouped list: cover thumb (tn art - 131px wide, enough for a 44px thumb on a 3x screen), name over set code / type / sub-type, card count and date on the right
const ProductListRow: FC<ProductListRowProps> = ({ product }) => {
	const releaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)

	return (
		<li>
			<Link to={`/product/${product.productId}`} className='product-list-row'>
				<span className='product-list-row__thumb'>
					<ProductImage productID={product.productId} size='tn' loading='lazy' />
				</span>
				<span className='product-list-row__text'>
					<Typography variant='subtitle1' component='span' className='product-list-row__name'>
						{product.productName}
					</Typography>
					<Typography variant='body2' component='span' className='product-list-row__muted'>
						{product.productId} · {product.productType} · {product.productSubType}
					</Typography>
				</span>
				<span className='product-list-row__end'>
					<Typography variant='body2' component='span'>
						{product.productTotal} cards
					</Typography>
					<Typography variant='body2' component='time' dateTime={product.productReleaseDate} className='product-list-row__muted'>
						{Dates.getMonth(releaseDate)} {Dates.getDay(releaseDate)}
					</Typography>
				</span>
				<ChevronRightRoundedIcon className='product-list-row__chevron' aria-hidden='true' />
			</Link>
		</li>
	)
}

export default ProductListRow
