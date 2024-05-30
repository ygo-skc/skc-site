import { Chip, Typography } from '@mui/material'
import { FC } from 'react'
import { Dates } from '../../helper/Dates'
import { DatedListItem, ProductImage } from 'skc-rcl'

type CardProductListItemProps = {
	cardID: string
	productID: string
	productName: string
	productReleaseDate: Date
	productContent: SKCProductContent
}

const CardProductListItem: FC<CardProductListItemProps> = ({ cardID, productID, productName, productReleaseDate, productContent }) => {
	return (
		<DatedListItem
			key={productID}
			link={`/product/${productID}#${cardID}`}
			month={Dates.getMonth(productReleaseDate)}
			day={+Dates.getDay(productReleaseDate)}
			year={+Dates.getYear(productReleaseDate)}
			className='aggregate-anchor'
		>
			<div style={{ display: 'flex', marginBottom: '1rem' }}>
				<div style={{ width: '5rem', marginRight: '1rem' }}>
					<ProductImage size='tn' productID={productID} loading='lazy' />
				</div>
				<div style={{ flex: '1' }}>
					<Typography variant='body1'>
						{productID}-{productContent.productPosition}
					</Typography>
					<Typography variant='subtitle1'>{productName}</Typography>
				</div>
			</div>

			<div>
				<Typography variant='body1'>Printed in the following rarities</Typography>
				{productContent.rarities.map((uniqueRarity) => (
					<Chip className='dark-chip-condensed' key={uniqueRarity} label={uniqueRarity} />
				))}
			</div>
		</DatedListItem>
	)
}

CardProductListItem.displayName = 'CardProductListItem'
export default CardProductListItem
