import React from 'react'
import { Skeleton } from '@material-ui/lab'
import createTable from '../../helper/TableHelpers'

import {LightTranslucentDivider} from '../util/Divider'

import {StickyBox} from '../util/StyledContainers'

import {LeftBoxHeaderTypography, LeftBoxSectionTypography, LeftBoxSectionHeaderTypography, LeftBoxPaper} from '../util/grid/OneThirdTwoThirdsGrid'


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
		<StickyBox>

			<LeftBoxPaper style={{ backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)' }} >

				{(isDataLoaded)?
					<LeftBoxHeaderTypography
						variant='h4' >
						{productName}
					</LeftBoxHeaderTypography>
					: <Skeleton
						variant='rect'
						height={30}
						width={250}
						style={{marginBottom: '.8rem'}}
						/>
				}


				<LeftBoxSectionHeaderTypography variant='h6' >
					Summary
				</LeftBoxSectionHeaderTypography>
				{createTable([], summaryRows, () => console.log('yoo'))}

				<LightTranslucentDivider  />

				<LeftBoxSectionHeaderTypography variant='h6' >
					Product Stats
				</LeftBoxSectionHeaderTypography>
				{createTable([], statRows, () => console.log('yoo'))}
			</LeftBoxPaper>

		</StickyBox>
	)
}