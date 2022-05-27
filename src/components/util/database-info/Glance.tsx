import { Typography } from '@mui/material'
import { FC } from 'react'

import '../../../css/util/glance.css'

type _Glance = {
	total: number
	subject: string
	color: string
	action: any
}

const Glance: FC<_Glance> = ({ total, subject, color, action }) => {
	return (
		<div className='glance' onClick={() => action()}>
			<Typography className='glance-prominent-text' variant='h1' align='center'>
				{total}
			</Typography>
			<Typography variant='h5' align='center' style={{ color: color }}>
				{subject}
			</Typography>
		</div>
	)
}

export default Glance
