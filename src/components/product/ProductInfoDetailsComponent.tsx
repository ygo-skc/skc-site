import { Skeleton, Typography, Box } from '@mui/material'
import createTable from '../util/TableHelpers'

import { LeftBoxPaper } from '../util/grid/OneThirdTwoThirdsGrid'
import { FC } from 'react'

const ProductInfoDetailsComponent: FC<ProductDetails> = ({
	productName,
	productId,
	productType,
	productSubType,
	productReleaseDate,
	productTotal,
	productRarityStats,
	isDataLoaded,
}) => {
	const summaryRows = []
	summaryRows.push(['Product ID', productId])
	summaryRows.push(['Product Type', productType])
	summaryRows.push(['Product Sub-Type', productSubType])
	summaryRows.push(['American Release', productReleaseDate])

	const statRows = [] as string[][]
	statRows.push(['Product Total', productTotal.toString()])
	Object.keys(productRarityStats).forEach((key) => statRows.push([key, productRarityStats[key]]))

	return (
		<Box className='sticky'>
			<LeftBoxPaper style={{ backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)' }}>
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

				<br />

				<Typography style={{ color: 'white' }} variant='h5'>
					Product Stats
				</Typography>
				{createTable([], statRows)}
			</LeftBoxPaper>
		</Box>
	)
}

export default ProductInfoDetailsComponent
