import { FunctionComponent, ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import styled from 'styled-components'

type _Hint = {
	children?: ReactNode
	backgroundColor?: string
	textColor?: string
}

const Hint: FunctionComponent<_Hint> = ({ children, backgroundColor = '#f6f2fb', textColor = 'black' }) => {
	const HintBox = styled(Box)`
		&& {
			background-color: ${backgroundColor};
			padding: 1.8rem;
			max-width: 70%;
			width: 80%;
			border-radius: 1.25rem;
			margin: auto;
			margin-top: 2rem;
			margin-bottom: 2rem;
		}
	`

	const HintText = styled(Typography)`
		&& {
			color: ${textColor};
			margin: 0rem;
		}
	`

	return (
		<HintBox>
			<HintText variant='h6' align='center'>
				{children}
			</HintText>
		</HintBox>
	)
}

export { Hint }
