import '../../css/main-pages/product-latest-release.css'

import { FC, useMemo } from 'react'
import { Button, Chip, Skeleton, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ProductImage } from 'skc-rcl'
import * as Dates from '../../helper/Dates'

type ProductLatestReleaseProps = {
	products: YGOProduct.Info[]
	isLoading: boolean
}

// white card calling out the newest product that's already out - upcoming products have their own section on the home page
const ProductLatestRelease: FC<ProductLatestReleaseProps> = ({ products, isLoading }) => {
	const latest = useMemo(
		() =>
			products
				.filter((product) => !Dates.isFutureDate(Dates.fromYYYYMMDDToDate(product.productReleaseDate)))
				.reduce<YGOProduct.Info | undefined>((newest, product) => (!newest || product.productReleaseDate > newest.productReleaseDate ? product : newest), undefined),
		[products]
	)

	if (isLoading) {
		return (
			<div className='product-latest-release' aria-hidden='true' data-testid='product-latest-release-skeleton'>
				<Skeleton className='product-latest-release__cover' variant='rounded' />
				<div className='product-latest-release__text'>
					<Typography variant='subtitle2' component='p' className='product-latest-release__eyebrow'>
						<Skeleton width='22ch' />
					</Typography>
					<Typography variant='h2'>
						<Skeleton width='14ch' />
					</Typography>
					<Typography variant='body1'>
						<Skeleton width='24ch' />
					</Typography>
					<div className='product-latest-release__chips'>
						<Skeleton variant='rounded' className='product-latest-release__pill-skeleton' width={48} height={32} />
						<Skeleton variant='rounded' className='product-latest-release__pill-skeleton' width={88} height={32} />
					</div>
					<Skeleton variant='rounded' className='product-latest-release__pill-skeleton product-latest-release__open-skeleton' width={140} height={37} />
				</div>
			</div>
		)
	}

	if (!latest) return null

	const releaseDate = Dates.fromYYYYMMDDToDate(latest.productReleaseDate)
	const daysOut = Dates.daysBetweenTwoDates(releaseDate)

	return (
		<section className='product-latest-release' aria-labelledby='product-latest-release-name'>
			<div className='product-latest-release__cover'>
				<ProductImage productID={latest.productId} size='md' />
			</div>

			<div className='product-latest-release__text'>
				<Typography variant='subtitle2' component='p' className='product-latest-release__eyebrow'>
					Latest release · <time dateTime={latest.productReleaseDate}>{Dates.getDateString(releaseDate)}</time>
				</Typography>
				<Typography variant='h2' id='product-latest-release-name' className='product-latest-release__name'>
					{latest.productName}
				</Typography>
				<Typography variant='body1' className='product-latest-release__meta'>
					{latest.productId} · {latest.productTotal} cards · {daysOut <= 0 ? 'out today' : `out for ${daysOut} day${daysOut === 1 ? '' : 's'}`}
				</Typography>
				<div className='product-latest-release__chips'>
					<Chip label={latest.productType} />
					<Chip label={latest.productSubType} />
				</div>
				<Button className='product-latest-release__open' variant='contained' disableElevation component={Link} to={`/product/${latest.productId}`}>
					View product
				</Button>
			</div>
		</section>
	)
}

export default ProductLatestRelease
