import React from 'react'
import { Grid } from '@material-ui/core'

import Styled from 'styled-components'


const LeftGrid = Styled(Grid)`
	&&
	{
		padding-right: 1.25rem;
		padding-left: 1.25rem;
	}
`


const RightGrid = Styled(Grid)`
	&&
	{
		display: inline-grid;

		@media screen and (min-width: 600px)
		{
			padding-right: 1.25rem
		}
	}
`


export const OneThirdTwoThirdsGrid = ( { match, history, oneThirdComponent, twoThirdComponent } ) =>
{

	return(
		<Grid container spacing={0} style={{ margin: 'auto', width: '100%' }} >
			<LeftGrid item xs={12} sm={5} md={4} lg={3} xl={2} >
					{oneThirdComponent}
			</LeftGrid>

			<RightGrid item xs={12} sm={7} md={8} lg={9} xl={10} >
				{twoThirdComponent}
			</RightGrid>
		</Grid>
	)
}