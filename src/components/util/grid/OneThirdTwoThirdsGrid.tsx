import { Box } from '@mui/material'
import Parent from '../Parent'
import { FC, ReactNode } from 'react'

type _OneThirdTwoThirdsGrid = {
	oneThirdComponent: ReactNode
	twoThirdComponent: ReactNode
	mirrored?: boolean
}

const OneThirdTwoThirdsGrid: FC<_OneThirdTwoThirdsGrid> = ({ oneThirdComponent, twoThirdComponent, mirrored = false }) => {
	return (
		<Parent>
			{mirrored ? <Box className='two-third-section-mirrored'>{twoThirdComponent}</Box> : <Box className='one-third-section-mirrored'>{oneThirdComponent}</Box>}
			{mirrored ? <Box className='one-third-section'>{oneThirdComponent}</Box> : <Box className='two-third-section'>{twoThirdComponent}</Box>}
		</Parent>
	)
}

export default OneThirdTwoThirdsGrid
