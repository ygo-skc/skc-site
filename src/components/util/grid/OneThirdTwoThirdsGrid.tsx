import { FC, ReactNode } from 'react'

type _OneThirdTwoThirdsGrid = {
	oneThirdComponent: ReactNode
	twoThirdComponent: ReactNode
	mirrored?: boolean
}

const OneThirdTwoThirdsGrid: FC<_OneThirdTwoThirdsGrid> = ({ oneThirdComponent, twoThirdComponent, mirrored = false }) => {
	return (
		<div className='one-third-two-thirds-container'>
			{mirrored ? <div className='two-third-section'>{twoThirdComponent}</div> : <div className='one-third-section'>{oneThirdComponent}</div>}
			{mirrored ? <div className='one-third-section'>{oneThirdComponent}</div> : <div className='two-third-section'>{twoThirdComponent}</div>}
		</div>
	)
}

export default OneThirdTwoThirdsGrid
