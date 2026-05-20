import '../../css/header-footer/messages.css'

import { FC, ReactElement } from 'react'
import { Typography, Chip } from '@mui/material'
import ReactMarkdown from 'react-markdown'

import { Dates } from '../../helper/Dates'

type MessageItemComponentArgs = {
	creationDate: Date
	message: HeartAPI.MessageInstance
}

const MessageItemComponent: FC<MessageItemComponentArgs> = ({ creationDate, message }): ReactElement => {
	return (
		<div className='communication-message-item'>
			<Typography className='communication-message-header' variant='h6'>
				{message.title}
			</Typography>

			<div className='communication-message-content'>
				<Typography className='communication-message-sub-header' variant='body2'>
					{Dates.getDateString(creationDate)} {Dates.getTimeString(creationDate)}
				</Typography>
				<Typography className='communication-message-body link-container' variant='body1'>
					<ReactMarkdown>{message.content}</ReactMarkdown>
				</Typography>

				{message.tags.map((tag: string) => (
					<Chip key={tag} className='dark-chip-condensed' label={tag} />
				))}
			</div>
		</div>
	)
}

export default MessageItemComponent
