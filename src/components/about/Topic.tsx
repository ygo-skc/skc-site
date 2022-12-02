import { FC, ReactNode } from 'react'
import { Typography } from '@mui/material'

type _Topic = {
	header: string
	details: ReactNode
}

const Topic: FC<_Topic> = ({ header, details }) => {
	return (
		<div className='topic'>
			<Typography variant='h6'>{header}</Typography>
			{details}
		</div>
	)
}

export default Topic
