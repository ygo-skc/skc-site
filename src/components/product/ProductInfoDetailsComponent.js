import React from 'react'
import { Skeleton } from '@material-ui/lab'

import {LightTranslucentDivider} from '../util/Divider'

import {StickyBox} from '../util/StyledContainers'

import {LeftBoxHeaderTypography, LeftBoxSectionTypography, LeftBoxSectionHeaderTypography, RightBoxPaper} from '../util/grid/OneThirdTwoThirdsGrid'


export default function ProductInfoDetailsComponent({productName, productId, productType, productSubType, productReleaseDate, productTotal, isDataLoaded}) {

	return(
		<StickyBox>

			<RightBoxPaper style={{ backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)' }} >

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

				<LeftBoxSectionTypography variant='body1' >
					<strong>Product ID:</strong> {productId}
				</LeftBoxSectionTypography>
				<LeftBoxSectionTypography variant='body1' >
					<strong>Product Type:</strong> {productType}
				</LeftBoxSectionTypography>
				<LeftBoxSectionTypography variant='body1'>
					<strong>Product Sub-Type:</strong> {productSubType}
				</LeftBoxSectionTypography >
				<LeftBoxSectionTypography variant='body1'>
					<strong>American Release:</strong> {productReleaseDate}
				</LeftBoxSectionTypography>

				<LightTranslucentDivider  />

				<LeftBoxSectionHeaderTypography variant='h6' >
					Product Stats
				</LeftBoxSectionHeaderTypography>
				<LeftBoxSectionTypography variant='body1'>
					<strong>Product Total:</strong> {productTotal}
				</LeftBoxSectionTypography>
			</RightBoxPaper>

		</StickyBox>
	)
}