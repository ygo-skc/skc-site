import React from 'react'
import { Paper, Typography } from '@material-ui/core'

import Styled from 'styled-components'

const MainBrowseInfoTypography2 = Styled(Typography)`
	&&
	{
		color: rgba(0, 0, 0, .79);
	}
`


const ProductInstance = Styled(Paper)`
	&&
	{
		background-color: #cdc1ff;
		background-image: linear-gradient(316deg, #cdc1ff 0%, #e5d9f2 74%);
		padding: 1.75rem;

		cursor: pointer;
	}
`


const ProductCardGridItem = ({productName, productId, productType, productSubType}) =>
{
	return(
		<ProductInstance
		style={{padding: '.75rem'}}>
			<MainBrowseInfoTypography2
				style={{marginBottom: '1rem'}}
				variant='subtitle1'
				align='center' >
				{productName}
			</MainBrowseInfoTypography2>
			<MainBrowseInfoTypography2
				variant='subtitle2' >
				ID: {productId}
			</MainBrowseInfoTypography2>
			<MainBrowseInfoTypography2
				variant='subtitle2' >
				Type: {productType}
			</MainBrowseInfoTypography2>
			<MainBrowseInfoTypography2
				variant='subtitle2' >
				Sub-Type: {productSubType}
			</MainBrowseInfoTypography2>
	</ProductInstance>
	)
}

export default ProductCardGridItem