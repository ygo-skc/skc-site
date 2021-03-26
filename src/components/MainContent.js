import Styled from 'styled-components'

import { Box, Paper } from '@material-ui/core'


const MainContentContainer = Styled(Box)`
	&&
	{
		padding-left: 0rem;
		padding-right: 0rem;
		padding-bottom: 0rem;

		max-width: 100%;
		width: 100%;
	}
`

const ChildPaper = Styled(Paper)`
	&&
	{
		background: white;
		border-radius: 2rem;

		@media screen and (min-width: 0px)
		{
			max-width: 87%;
			margin: auto;
			margin-bottom: 3rem;
			padding: 1.8rem;
		}
		@media screen and (min-width: 600px)
		{
			max-width: 87%;
			margin: auto;
			margin-bottom: 3rem;
			padding: 2.5rem;
		}
		@media screen and (min-width: 960px)
		{
			max-width: 85%;
			margin: auto;
			margin-bottom: 4rem;
			padding: 3rem;
		}
		@media screen and (min-width: 1280px)
		{
			max-width: 85%;
			margin: auto;
			margin-bottom: 4.5rem;
			padding: 3.5rem;
		}
		@media screen and (min-width: 1920px)
		{
			max-width: 80%;
			margin: auto;
			margin-bottom: 5rem;
			padding: 4rem;
		}
	}
`

const ChildBox = Styled(Box)`
	&&
	{
		@media screen and (min-width: 0px)
		{
			padding: .25rem;
		}
		@media screen and (min-width: 600px)
		{
			padding: .3rem;
		}
		@media screen and (min-width: 960px)
		{
			padding: .4rem;
		}
		@media screen and (min-width: 1280px)
		{
			padding: .7rem;
		}
		@media screen and (min-width: 1920px)
		{
			padding: 1.5rem;
		}
	}
`

export { MainContentContainer, ChildPaper, ChildBox }