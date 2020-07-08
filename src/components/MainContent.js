import Styled from 'styled-components'

import { Box, Paper } from '@material-ui/core'


const MainContentContainer = Styled(Box)`
	&&
	{
		padding: .75rem;
	}
`

const ChildPaper = Styled(Box)`
	&&
	{
		margin-bottom: 2rem;
		background: white;
		padding-top: 3rem;
		padding-bottom: 3rem;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}
`

export { MainContentContainer, ChildPaper }