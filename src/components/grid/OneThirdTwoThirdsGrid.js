import React from 'react'
import { Grid, Box } from '@material-ui/core'

import Styled from 'styled-components'
import withWidth from '@material-ui/core/withWidth'


const LeftBox = Styled(Box)`
	&&
	{
		margin-bottom: 2.5rem;
		padding-left: .8rem;
		padding-right: .8rem;

		@media screen and (min-width: 800px)
		{

			min-width: 380px;
			max-width: 380px;
		}
	}
`


const RightBox = Styled(Box)`
	&&
	{
		@media screen and (min-width: 800px)
		{
			padding-right: .8rem;
			flex-grow: 1;
		}
	}
`

const Parent = Styled(Box)`
	&&
	{
		width: 100%;

		@media screen and (min-width: 0px)
		{
			margin-bottom: 2.75rem;
			display: block;
		}

		@media screen and (min-width: 800px)
		{
			margin-bottom: 1rem;
			display: inline-flex;
		}
	}
`


function OneThirdTwoThirdsGrid( { oneThirdComponent, twoThirdComponent, width } )
{

	return(
		<Parent >
			<LeftBox>
			{oneThirdComponent}
			</LeftBox>

			<RightBox >
			{twoThirdComponent}
			</RightBox>
		</Parent>
	)
}


export default withWidth()(OneThirdTwoThirdsGrid)