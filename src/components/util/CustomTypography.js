import React from 'react'
import { Typography } from '@material-ui/core'
import Styled from 'styled-components'

const LightTypographyStyle = Styled(Typography)`
	&&
	{
		color: rgba(255, 255, 255, .97);
	}
`

const LightTypography = ({ className, children, variant, align }) =>
{
	return(
		<LightTypographyStyle align={align} variant={variant} className={className} >
			{children}
		</LightTypographyStyle>
	)
}


export { LightTypography }