import { Skeleton, Typography } from '@mui/material'
import { FC } from 'react'
import { Dates } from '../../helper/Dates'
import { ProductImage, SKCTable } from 'skc-rcl'

const ProductInfoDetailsComponent: FC<ProductDetails> = ({ productName, productId, productType, productSubType, productReleaseDate, isDataLoaded, numUniqueCards }) => {
	const summaryRows = []
	summaryRows.push(['Product ID', productId])
	summaryRows.push(['Product Type', productType])
	summaryRows.push(['Product Sub-Type', productSubType])
	summaryRows.push(['American Release', Dates.fromYYYYMMDDToDateStr(productReleaseDate)])
	summaryRows.push(['Total Unique Cards', numUniqueCards])

	return (
		<div className='section-content'>
			<div style={{ width: '45%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem', display: 'block' }}>
				<ProductImage productID={productId} variant={'lg'} loading='eager' />
			</div>
			{isDataLoaded ? <Typography variant='h4'>{productName}</Typography> : <Skeleton variant='text' height={40} width='100%' style={{ marginBottom: '.8rem' }} />}

			<div className='group'>
				<Typography variant='h5'>Summary</Typography>
				{isDataLoaded ? <SKCTable header={[]} rows={summaryRows} /> : <Skeleton variant='rectangular' height='170px' />}
			</div>
		</div>
	)
}

export default ProductInfoDetailsComponent
