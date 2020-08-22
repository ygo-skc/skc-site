import React from 'react'

import {Box, Typography} from '@material-ui/core'
import Styled from 'styled-components'


const FooterComponent = Styled(Box)`
	&&
	{
		margin-bottom: 1.5rem;
		margin-top: auto 1.5rem;

		width: 100%;
	}
`


export default function Footer()
{
	return(
		<FooterComponent>
			<Typography
				variant='body2'
				align='center'
				style={{color: 'rgb(101, 119, 134)'}} >
				Copyright 2020
			</Typography>

			<Typography
				variant='body2'
				align='center'
				style={{color: 'rgb(101, 119, 134)'}} >
				Konami Digital Entertainment owns all rights to Yu-Gi-Oh!
			</Typography>
		</FooterComponent>
	)
}