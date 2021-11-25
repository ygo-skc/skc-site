import {FunctionComponent, ReactNode} from 'react'
import { Box, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Variant } from '@material-ui/core/styles/createTypography'

type args = {
	children: ReactNode,
	variant: Variant | 'inherit',
	backgroundColor: string,
	textColor: string
}

const Hint:FunctionComponent<args> = ( { children, variant, backgroundColor='#f6f2fb', textColor='#4f5c6a' } ) =>
{

	const HintBox = styled(Box)`
		&&
		{
			background-color: ${backgroundColor};
			padding: 1.4rem;
			max-width: 70%;
			width: 85%;
			border-radius: 1.25rem;
			margin: auto;
			margin-top: 1rem;
			margin-bottom: 2rem;
		}
	`


	const HintText = styled(Typography)`
		&&
		{
			color: ${textColor};
			margin: 0rem;
		}
	`


	return(
		<HintBox>
			<HintText variant={variant} align='center' >
				{ children }
			</HintText>
		</HintBox>
	)
}


export {Hint}