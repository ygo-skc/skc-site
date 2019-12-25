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

const ChildPaper = Styled(Paper)`
	&&
	{
		border-radius: .5rem;
		margin-bottom: 2.75rem;
		@media screen and (min-width: 0px)
		{
			padding: .9rem;
		}
		@media screen and (min-width: 400px)
		{
			padding: 1.05rem;
		}
		@media screen and (min-width: 550px)
		{
			padding: 1.35rem;
		}
		@media screen and (min-width: 750px)
		{
			padding: 1.6rem;
		}
		@media screen and (min-width: 900px)
		{
			padding: 2.15rem;
		}
		@media screen and (min-width: 1200px)
		{
			padding: 2.5rem;
		}
	}
`

export { MainContentContainer, ChildPaper }