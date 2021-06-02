import React, { memo } from 'react'
import { Grid } from '@material-ui/core'
import {RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography, RightBoxHeaderContainer} from '../../util/grid/OneThirdTwoThirdsGrid'

import {DarkTranslucentDivider} from '../../util/Divider'

import CardProductInformation from './CardProductInformation'
import CardBanListInformation from './CardBanListInformation'


const CardInformationRelatedContent = memo( ({ cardName, isLoading, productInfo, banListInfo, cardID } ) =>
{
	return (
		<RightBoxPaper>
			<RightBoxHeaderContainer >
				<RightBoxHeaderTypography variant='h4' >
					Explore
				</RightBoxHeaderTypography>
				<RightBoxSubHeaderTypography variant='h5'>
					Related Content For <i>{cardName}</i>
				</RightBoxSubHeaderTypography>

				<DarkTranslucentDivider />
			</RightBoxHeaderContainer>

			<Grid container spacing={1} >
				<Grid item xs={12} sm={12} md={12} lg={6} xl={6} >
					<CardProductInformation
						isLoading={isLoading}
						hasInfo={ (productInfo.length === 0)? false : true }
						cardInfo={productInfo}
						cardID={cardID}
					/>
				</Grid>

				<Grid item xs={12} sm={12} md={12} lg={6} xl={6} >
					<CardBanListInformation
						isLoading={isLoading}
						hasInfo={ (banListInfo.length === 0)? false : true }
						cardInfo={banListInfo}
					/>
				</Grid>
			</Grid>
		</RightBoxPaper>
	)
},  (prevProps, newProps) => {
	if ( prevProps.isLoading !== newProps.isLoading )
		return false

	return true
})


export default CardInformationRelatedContent