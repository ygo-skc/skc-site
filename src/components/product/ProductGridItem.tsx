import { Chip, Typography } from '@mui/material'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import * as Dates from '../../helper/Dates'
import { ProductImage } from 'skc-rcl'

type ProductGridItemProps = {
	id: string
	name: string
	type: string
	subType: string
	totalItems: number
	releaseDate: Date
}

// white tile for the Cards view: cover, date, name, set code and card count, then type chips
const ProductGridItem: FC<ProductGridItemProps> = ({ id, name, type, subType, totalItems, releaseDate }) => {
	return (
		<li>
			<Link to={`/product/${id}`} className='product-tile'>
				<span className='product-tile__cover'>
					<ProductImage size='md' productID={id} loading='lazy' />
				</span>
				<span className='product-tile__text'>
					<Typography variant='body2' component='span' className='product-tile__muted'>
						{Dates.getDateString(releaseDate)}
					</Typography>
					<Typography variant='subtitle1' component='span' className='product-tile__name'>
						{name}
					</Typography>
					<Typography variant='body2' component='span' className='product-tile__muted'>
						{id} · {totalItems} cards
					</Typography>
				</span>
				<span className='product-tile__chips'>
					<Chip size='small' label={type} />
					<Chip size='small' label={subType} />
				</span>
			</Link>
		</li>
	)
}

export default ProductGridItem
