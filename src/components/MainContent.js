import Styled from 'styled-components'

import { Box, Paper } from '@material-ui/core'


const MainContentContainer = Styled(Box)`
	&&
	{
		@media screen and (min-width: 0px)
		{
			padding: .6rem;
		}
		@media screen and (min-width: 550px)
		{
			padding: .8rem;
		}
		@media screen and (min-width: 900px)
		{
			padding: 1.35rem;
		}
	}
`

const ChildPaper = Styled(Box)`
	&&
	{
		margin-bottom: 2rem;
		background: white;
		@media screen and (min-width: 0px)
		{
			padding: 1rem;
		}
		@media screen and (min-width: 400px)
		{
			padding: 1.4rem;
		}
		@media screen and (min-width: 900px)
		{
			padding: 3rem;
		}
	}
`

export { MainContentContainer, ChildPaper }