import React from 'react'
import { Paper, Typography, Box } from '@material-ui/core'

import Styled from 'styled-components'

const MainBrowseInfoTypography2 = Styled(Typography)`
	&&
	{
		color: rgba(0, 0, 0, .79);
	}
`


const ProductInstance = Styled(Box)`
	&&
	{
		padding: 1.5rem;

		border-radius: 1.5rem;
		cursor: pointer;

		border: solid;
		border-width: .25rem;
		border-color: #DC5010;

		:hover
		{
			background: #eee;
		}
	}
`


const ProductCardGridItem = ({productName, productId, productType, productSubType}) =>
{
	return(
		<ProductInstance
		style={{padding: '.75rem'}}>
			<MainBrowseInfoTypography2
				style={{marginBottom: '1rem', fontWeight: '800'}}
				variant='subtitle1'
				>
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