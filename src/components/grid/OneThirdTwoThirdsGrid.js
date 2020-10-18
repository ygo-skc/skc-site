import React from 'react'
import { Grid, Divider } from '@material-ui/core'

import Styled from 'styled-components'
import withWidth from '@material-ui/core/withWidth'


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


function OneThirdTwoThirdsGrid( { oneThirdComponent, twoThirdComponent, width } )
{

	return(
		<ParentGrid container spacing={0} >
			<LeftGrid item xs={12} sm={6} md={4} lg={3} xl={3} >
					{oneThirdComponent}
					{ (width === 'xs')? <Divider /> : undefined }
			</LeftGrid>

			<RightGrid item xs={12} sm={6} md={8} lg={9} xl={9} >
				{twoThirdComponent}
			</RightGrid>
		</ParentGrid>
	)
}


export default withWidth()(OneThirdTwoThirdsGrid)