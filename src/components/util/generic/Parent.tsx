import { Box } from '@mui/material'
import { FC } from 'react'

import Styled from 'styled-components'

const OuterParent = Styled(Box)`
	&&
	{
		@media screen and (min-width: 800px)
		{
			display: flex;
		}
`

const Parent: FC<{ children: JSX.Element[] }> = ({ children }) => {
	return <OuterParent>{children}</OuterParent>
}

export default Parent
