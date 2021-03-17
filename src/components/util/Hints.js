import React from 'react'
import { Box, Typography } from '@material-ui/core'
import styled from 'styled-components'


const HintText = styled(Typography)`
	&&
	{
		color: #5e6d7d;
		margin: 0rem;
	}
`

const HintBox = styled(Box)`
	&&
	{
		background-color: #f6f2fb;
		padding: 1.4rem;
		max-width: 85%;
		width: 85%;
		border-radius: 1.25rem;
		margin: auto;
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
`


const Hint = ( { text, textVariant } ) =>
{
	return(
		<HintBox>
			<HintText variant={textVariant} align='center' >
				{ text }
			</HintText>
		</HintBox>
	)
}


export {Hint}