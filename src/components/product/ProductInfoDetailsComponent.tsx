import { Skeleton, Typography, Box } from '@mui/material'
import createTable from '../util/TableHelpers'
import { FC } from 'react'

const ProductInfoDetailsComponent: FC<ProductDetails> = ({ productName, productId, productType, productSubType, productReleaseDate, isDataLoaded }) => {
	const summaryRows = []
	summaryRows.push(['Product ID', productId])
	summaryRows.push(['Product Type', productType])
	summaryRows.push(['Product Sub-Type', productSubType])
	summaryRows.push(['American Release', productReleaseDate])

	return (
		<Box className='sticky'>
			<div className='one-third-two-thirds-container' style={{ backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)' }}>
				{isDataLoaded ? (
					<Typography style={{ color: 'white' }} variant='h4'>
						{productName}
					</Typography>
				) : (
					<Skeleton variant='rectangular' height={30} width={250} style={{ marginBottom: '.8rem' }} />
				)}

				<Typography style={{ color: 'white' }} variant='h5'>
					Summary
				</Typography>
				{createTable([], summaryRows)}
			</div>
		</Box>
	)
}

export default ProductInfoDetailsComponent
