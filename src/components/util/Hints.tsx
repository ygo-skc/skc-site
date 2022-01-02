import { FunctionComponent, ReactNode } from 'react'
import { Typography } from '@mui/material'

import '../../css/util/hint.css'

type _Hint = {
	children?: ReactNode
	backgroundColor?: string
	textColor?: string
}

const Hint: FunctionComponent<_Hint> = ({ children, backgroundColor = '#f6f2fb', textColor = 'black' }) => {
	return (
		<div className='hint' style={{ backgroundColor: backgroundColor }}>
			<Typography className='hint-text' style={{ color: textColor }} variant='h6' align='center'>
				{children}
			</Typography>
		</div>
	)
}

export { Hint }
