import { Divider } from '@mui/material'
import Styled from 'styled-components'

const BaseDivider = Styled(Divider)`
	&&
	{
		margin: auto;
		margin-top: 1.25rem;
		margin-bottom: 1.75rem;
		height: 3px;
		border-radius: 1000rem;
		max-width: 97%;
	}
`

const LightTranslucentDivider = Styled(BaseDivider)`
	&&
	{
		background-color: rgba(255, 255, 255, .25);
	}
`

export { LightTranslucentDivider }
