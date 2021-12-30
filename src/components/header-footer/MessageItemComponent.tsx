import '../../css/nav/messages.css'

import { FC, ReactElement } from 'react'
import { Typography, Chip, Divider } from '@mui/material'
import ReactMarkdown from 'react-markdown'

import { Dates } from '../../helper/Dates'

type MessageItemComponentArgs = {
	creationDate: Date
	messageTitle: string
	messageContent: string
	messageTags: string[]
	isLastMessage: boolean
}

const MessageItemComponent: FC<MessageItemComponentArgs> = ({ creationDate, messageTitle, messageContent, messageTags, isLastMessage }): ReactElement => {
	return (
		<div>
			<Typography className='communication-message-header' variant='h6'>
				{messageTitle}
			</Typography>
			<Typography className='communication-message-sub-header' variant='subtitle1'>
				{Dates.getDateString(creationDate)} {Dates.getTimeString(creationDate)}
			</Typography>
			<Typography className='communication-message-body link-container' variant='body1'>
				<ReactMarkdown children={`${messageContent}`} />
			</Typography>
			{messageTags.map((tag: string) => (
				<Chip className='communication-message-tag' label={tag} />
			))}
			{isLastMessage ? <div /> : <Divider className='communication-divider' />}
		</div>
	)
}

export default MessageItemComponent
