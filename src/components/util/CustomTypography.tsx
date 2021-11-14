import {FunctionComponent, ReactNode} from 'react'
import { Typography } from '@mui/material'
import Styled from 'styled-components'
import { Variant } from '@mui/material/styles/createTypography'

type args = {
	className: string,
	children: ReactNode,
	variant: Variant | 'inherit',
	align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
}

const LightTypographyStyle = Styled(Typography)`
	&&
	{
		color: rgba(255, 255, 255, .97);
	}
`

const LightTypography:FunctionComponent<args> = ({ className, children, variant, align }) =>
{
	return(
		<LightTypographyStyle align={align} variant={variant} className={className} >
			{children}
		</LightTypographyStyle>
	)
}


export { LightTypography }