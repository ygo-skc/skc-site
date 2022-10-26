import { Skeleton, Typography, Box } from '@mui/material'
import createTable from '../util/TableHelpers'
import { FC } from 'react'
import { Dates } from '../../helper/Dates'

const ProductInfoDetailsComponent: FC<ProductDetails> = ({ productName, productId, productType, productSubType, productReleaseDate, isDataLoaded, numUniqueCards }) => {
	const summaryRows = []
	summaryRows.push(['Product ID', productId])
	summaryRows.push(['Product Type', productType])
	summaryRows.push(['Product Sub-Type', productSubType])
	summaryRows.push(['American Release', Dates.getDateString(new Date(productReleaseDate))])
	summaryRows.push(['Total Unique Cards', numUniqueCards])

	return (
		<Box className='sticky'>
			<div className='section-content'>
				{isDataLoaded ? (
					<Typography variant='h4'>
						{productName} • ({productId})
					</Typography>
				) : (
					<Skeleton variant='text' height={40} width='100%' style={{ marginBottom: '.8rem' }} />
				)}

				<div className='group'>
					<Typography variant='h5'>Summary</Typography>
					{isDataLoaded ? createTable([], summaryRows) : <Skeleton variant='rectangular' height='170' />}
				</div>
			</div>
		</Box>
	)
}

export default ProductInfoDetailsComponent
