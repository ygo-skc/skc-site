import React from 'react'
import { Typography, Box, Paper } from '@material-ui/core'

import Styled from 'styled-components'

const InnerParent = Styled(Box)`
	&&
	{
		width: 100%;
		max-width: 100%;

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

const OuterParent = Styled(Box)`
	&&
	{
		margin-right: .2rem;
		margin-left: .2rem;

		@media screen and (min-width: 800px)
		{
			margin-right: .8rem;
			margin-left: .8rem;
		}
`


export default function Parent( { children } )
{

	return(
		<OuterParent>
			<InnerParent >
				{children}
			</InnerParent>
		</OuterParent>
	)
}