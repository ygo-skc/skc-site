import '../../css/nav/messages.css'

import { FC, Fragment, ReactElement } from 'react'
import { Typography, Chip, Divider } from '@mui/material'
import ReactMarkdown from 'react-markdown'

import { Dates } from '../../helper/Dates'

type MessageItemComponentArgs = {
	creationDate: Date
	message: HeartApiMessageItem
	isLastMessage: boolean
}

const MessageItemComponent: FC<MessageItemComponentArgs> = ({ creationDate, message, isLastMessage }): ReactElement => {
	return (
		<Fragment>
			<Typography className='communication-message-header' variant='h6'>
				{message.title}
			</Typography>

			<div className='communication-message-content'>
				<Typography className='communication-message-sub-header' variant='subtitle1'>
					{Dates.getDateString(creationDate)} {Dates.getTimeString(creationDate)}
				</Typography>
				<Typography className='communication-message-body link-container' variant='body1'>
					<ReactMarkdown children={`${message.content}`} />
				</Typography>

				<div className='communication-message-tag-container'>
					{message.tags.map((tag: string) => (
						<Chip className='communication-message-tag' label={tag} />
					))}
				</div>
			</div>
			{isLastMessage ? <div /> : <Divider className='communication-divider' />}
		</Fragment>
	)
}

export default MessageItemComponent
