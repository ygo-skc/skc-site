import React from 'react'
import { Typography } from '@material-ui/core'
import Styled from 'styled-components'

const LightTypographyStyle = Styled(Typography)`
	&&
	{
		color: rgba(255, 255, 255, .97);
	}
`

const LightTypography = ({ children, variant, align }) =>
{
	return(
		<LightTypographyStyle align={align} variant={variant} >
			{children}
		</LightTypographyStyle>
	)
}


export { LightTypography }