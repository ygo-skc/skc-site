import React from 'react'

import {Box, Typography} from '@material-ui/core'


export default function Footer()
{
	return(
		<Box className='footer' >
			<Typography
				className='footer-font'
				variant='body2'
				align='center' >
				Copyright 2021
			</Typography>

			<Typography
				className='footer-font'
				variant='body2'
				align='center' >
				Konami Digital Entertainment owns all rights to Yu-Gi-Oh!
			</Typography>
		</Box>
	)
}