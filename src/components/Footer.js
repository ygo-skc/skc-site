import React from 'react'

import {Box, Typography} from '@material-ui/core'
import Styled from 'styled-components'


const FooterComponent = Styled(Box)`
	&&
	{
		margin-top: 3.5rem;

		width: 100%;
	}
`


const FooterTypography = Styled(Typography)`
	&&
	{
		font-weight: 500;
		font-size: .86rem;
		color: rgb(102, 102, 102);
	}
`


export default function Footer()
{
	return(
		<FooterComponent>
			<FooterTypography
				variant='body2'
				align='center' >
				Copyright 2021
			</FooterTypography>

			<FooterTypography
				variant='body2'
				align='center' >
				Konami Digital Entertainment owns all rights to Yu-Gi-Oh!
			</FooterTypography>
		</FooterComponent>
	)
}