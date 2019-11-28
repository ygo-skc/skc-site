import Styled from 'styled-components'

import { Box } from '@material-ui/core'


const MainContentContainer = Styled(Box)`
	&&
	{
		@media screen and (min-width: 0px)
		{
			padding: .55rem;
		}
		@media screen and (min-width: 550px)
		{
			padding: .75rem;
		}
		@media screen and (min-width: 900px)
		{
			padding: 1.25rem;
		}
	}
`

export { MainContentContainer }