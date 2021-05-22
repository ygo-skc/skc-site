import React from 'react'

import {Paper, Typography} from '@material-ui/core'
import Styled from 'styled-components'


const FooterComponent = Styled(Paper)`
	&&
	{
		background-color: #2b4162;
		background-image: linear-gradient(315deg, #2b4162 0%, #12100e 74%);


		padding: 2.5rem;
		padding-bottom: 3.5rem;
		border-top-left-radius: 2.5rem;
		border-top-right-radius: 2.5rem;
		flex-shrink: 0;
		margin-top: 6rem;
	}
`


const FooterTypography = Styled(Typography)`
	&&
	{
		font-weight: 600;
		font-size: .86rem;
		color: white;
	}
`


export default function Footer()
{
	return(
		<FooterComponent>
			<FooterTypography
				variant='body1'
				align='center' >
				Copyright 2021
			</FooterTypography>

			<FooterTypography
				variant='body1'
				align='center' >
				Konami Digital Entertainment owns all rights to Yu-Gi-Oh!
			</FooterTypography>
		</FooterComponent>
	)
}