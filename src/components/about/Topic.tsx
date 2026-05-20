import { FC, ReactNode, memo } from 'react'
import { Typography } from '@mui/material'

type _Topic = {
	header: string
	details: ReactNode
}

const Topic: FC<_Topic> = memo(({ header, details }) => {
	return (
		<div className='topic'>
			<Typography variant='h6'>{header}</Typography>
			{details}
		</div>
	)
})

Topic.displayName = 'Topic'
export default Topic
