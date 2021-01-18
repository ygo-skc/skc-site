import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react'
import { Grid } from '@material-ui/core'
import {RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography, RightBoxHeaderContainer} from '../grid/OneThirdTwoThirdsGrid'
import Footer from '../Footer'

const CardInformationSection = lazy( () => import('./CardInformationSection') )


const CardInformationRelatedContent = ( { cardName, isLoading, productInfo, productInfoChips, banListInfo, banListInfoChips } ) =>
{
	return (
		<RightBoxPaper>
			<RightBoxHeaderContainer >
				<RightBoxHeaderTypography variant='h4' >
					Explore
				</RightBoxHeaderTypography>
				<RightBoxSubHeaderTypography variant='subtitle1' style={{marginBottom: '3rem'}} >
					Related Content For <i>{cardName}</i>
				</RightBoxSubHeaderTypography>
			</RightBoxHeaderContainer>

			<Grid container spacing={1} >
				<Grid item xs={12} sm={12} md={12} lg={6} xl={6}  style={ { display: 'inline-grid' } } >
					{(isLoading)? undefined
					: <CardInformationSection
						isLoading={isLoading}
						hasInfo={ (productInfo.length === 0)? false : true }
						infoChips={productInfoChips}
						headerText={'Products'}
						noInfoText={'Not Found In Any Product'}
						background='#a4508b'
						backgroundImage='linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)'
					/>
					}
				</Grid>

				<Grid item xs={12} sm={12} md={12} lg={6} xl={6} style={ { display: 'inline-grid' } } >
					{(isLoading)? undefined
					: <CardInformationSection
						isLoading={isLoading}
						hasInfo={ (banListInfo.length === 0)? false : true }
						infoChips={banListInfoChips}
						headerText={'Ban Lists'}
						noInfoText={`Not Found In Any Ban List`}
						background='#fc9842'
						backgroundImage='linear-gradient(315deg, #fc9842 0%, #fe5f75 74%)'
					/>
					}

				</Grid>
				<Footer />

			</Grid>
		</RightBoxPaper>
	)
}


export default CardInformationRelatedContent