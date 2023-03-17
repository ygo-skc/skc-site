import { Box } from '@mui/material'
import { FC, ReactNode } from 'react'
import Styled from 'styled-components'

type _OneThirdTwoThirdsGrid = {
	oneThirdComponent: ReactNode
	twoThirdComponent: ReactNode
	mirrored?: boolean
}

const Parent = Styled(Box)`
	&&
	{
		@media screen and (min-width: 800px)
		{
			display: flex;
		}
`

const OneThirdTwoThirdsGrid: FC<_OneThirdTwoThirdsGrid> = ({ oneThirdComponent, twoThirdComponent, mirrored = false }) => {
	return (
		<Parent>
			{mirrored ? <Box className='two-third-section-mirrored'>{twoThirdComponent}</Box> : <Box className='one-third-section-mirrored'>{oneThirdComponent}</Box>}
			{mirrored ? <Box className='one-third-section'>{oneThirdComponent}</Box> : <Box className='two-third-section'>{twoThirdComponent}</Box>}
		</Parent>
	)
}

export default OneThirdTwoThirdsGrid
