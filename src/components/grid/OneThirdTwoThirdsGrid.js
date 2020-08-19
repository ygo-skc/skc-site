import React from 'react'
import { Grid } from '@material-ui/core'

import Styled from 'styled-components'


const LeftGrid = Styled(Grid)`
	&&
	{
		margin-bottom: 2.5rem;
		@media screen and (min-width: 0px)
		{
			padding-right: 1.25rem;
			padding-left: 1.25rem;
		}

		@media screen and (min-width: 600px)
		{
			padding-left: 0rem;
			padding-right: 1.25rem;
		}
	}
`


const RightGrid = Styled(Grid)`
	&&
	{
		width: 100%;
	}
`

const ParentGrid = Styled(Grid)`
	&&
	{
		width: 100%;

		@media screen and (min-width: 0px)
		{
			margin-bottom: 2.75rem;
		}

		@media screen and (min-width: 600px)
		{
			margin-bottom: 1rem;
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
	}
`


export const OneThirdTwoThirdsGrid = ( { oneThirdComponent, twoThirdComponent } ) =>
{

	return(
		<ParentGrid container spacing={0} >
			<LeftGrid item xs={12} sm={5} md={4} lg={3} xl={2} >
					{oneThirdComponent}
			</LeftGrid>

			<RightGrid item xs={12} sm={7} md={8} lg={9} xl={10} >
				{twoThirdComponent}
			</RightGrid>
		</ParentGrid>
	)
}