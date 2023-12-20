import { Chip, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { FC } from 'react'
import { Dates } from '../../helper/Dates'
import { InlineDate, ProductImage } from 'skc-rcl'

type ProductGridItemProps = {
	id: string
	name: string
	type: string
	subType: string
	totalItems: number
	releaseDate: Date
}

const ProductGridItem: FC<ProductGridItemProps> = ({ id, name, type, subType, totalItems, releaseDate }) => {
	return (
		<Grid2 key={id} className='list-item-parent' onClick={() => window.location.assign(`/product/${id}`)} xs={12} sm={6} md={4} lg={4} xl={3}>
			<div className='product-img'>
				<ProductImage variant='sm' productID={id} loading='lazy' />
			</div>

			<div className='list-item-text'>
				<InlineDate month={Dates.getMonth(releaseDate)} day={+Dates.getDay(releaseDate)} year={+Dates.getYear(releaseDate)} />
				<Typography variant='body1'>
					{id} &#x25cf; {totalItems} Cards
				</Typography>
				<Typography variant='h5'>{name}</Typography>
				<div>
					<Chip className='dark-chip-condensed' key={type} label={type} />
					<Chip className='dark-chip-condensed' key={subType} label={subType} />
				</div>
			</div>
		</Grid2>
	)
}

export default ProductGridItem
