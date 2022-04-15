import { Skeleton, Typography, Box } from '@mui/material'
import createTable from '../util/TableHelpers'
import { FC } from 'react'
import { Dates } from '../../helper/Dates'

const ProductInfoDetailsComponent: FC<ProductDetails> = ({ productName, productId, productType, productSubType, productReleaseDate, isDataLoaded }) => {
	const summaryRows = []
	summaryRows.push(['Product ID', productId])
	summaryRows.push(['Product Type', productType])
	summaryRows.push(['Product Sub-Type', productSubType])
	summaryRows.push(['American Release', Dates.getDateString(new Date(productReleaseDate))])

	return (
		<Box className='sticky'>
			<div className='section-content'>
				{isDataLoaded ? <Typography variant='h4'>{productName}</Typography> : <Skeleton variant='rectangular' height={30} width={250} style={{ marginBottom: '.8rem' }} />}

				<Typography variant='h5'>Summary</Typography>
				{createTable([], summaryRows)}
			</div>
		</Box>
	)
}

export default ProductInfoDetailsComponent
