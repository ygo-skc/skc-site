import React from 'react'
import { Skeleton, Typography, Box } from '@mui/material'
import createTable from '../util/TableHelpers'

import {LightTranslucentDivider} from '../util/Divider'

import {LeftBoxPaper} from '../util/grid/OneThirdTwoThirdsGrid'


export default function ProductInfoDetailsComponent({productName, productId, productType, productSubType, productReleaseDate, productTotal, productRarityStats, isDataLoaded}) {

	const summaryRows = []
	summaryRows.push(['Product ID', productId])
	summaryRows.push(['Product Type', productType])
	summaryRows.push(['Product Sub-Type', productSubType])
	summaryRows.push(['American Release', productReleaseDate])

	const statRows = []
	statRows.push(['Product Total', productTotal])
		Object.keys(productRarityStats).forEach((key, value) => {
			statRows.push([key, productRarityStats[key]])
		})

	return(
		<Box className='sticky' >
			<LeftBoxPaper style={{ backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)' }} >

				{(isDataLoaded)?
					<Typography
						style={{color: 'white'}}
						variant='h4' >
						{productName}
					</Typography>
					: <Skeleton
						variant='rectangular'
						height={30}
						width={250}
						style={{marginBottom: '.8rem'}}
						/>
				}


				<Typography
					style={{color: 'white'}}
					variant='h5' >
					Summary
				</Typography>
				{createTable([], summaryRows, () => console.log('No Action'))}

				<br />

				<Typography
					style={{color: 'white'}}
					variant='h5' >
					Product Stats
				</Typography>
				{createTable([], statRows, () => console.log('No Action'))}
			</LeftBoxPaper>

		</Box>
	)
}