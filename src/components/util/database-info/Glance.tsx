import { Typography, Box } from '@mui/material'
import { FC } from 'react'

import '../../../css/util/glance.css'

type _DatabaseInfo = {
	total: number
	subject: string
	color: string
	action: any
}

const DatabaseInfo: FC<_DatabaseInfo> = ({ total, subject, color, action }) => {
	return (
		<Box className='glance' onClick={() => action()}>
			<Typography className='glance-prominent-text' variant='h2' align='center'>
				{total}
			</Typography>
			<Typography variant='h5' align='center' style={{ color: color }}>
				{subject}
			</Typography>
		</Box>
	)
}

export default DatabaseInfo
