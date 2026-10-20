import { memo } from 'react'
import { Typography, Chip } from '@mui/material'
import ReactMarkdown from 'react-markdown'

import { Dates } from '../../helper/Dates'

type MessageItemComponentArgs = {
	message: HeartAPI.MessageInstance
	isNew: boolean
}

/*
 * One post on the messages timeline - the date sits in its own gutter column beside the rail so posts can be scanned by when they shipped.
 */
const MessageItemComponent = memo(({ message, isNew }: MessageItemComponentArgs) => {
	const creationDate = new Date(message.createdAt)

	return (
		<li className={isNew ? 'messages__post messages__post--new' : 'messages__post'}>
			<time className='messages__date' dateTime={message.createdAt} title={`${Dates.getDateString(creationDate)} ${Dates.getTimeString(creationDate)}`}>
				<Typography variant='inherit' component='span' className='messages__month'>
					{Dates.getMonth(creationDate)}
				</Typography>
				<Typography variant='inherit' component='span' className='messages__day'>
					{Dates.getDay(creationDate)}
				</Typography>
				<Typography variant='inherit' component='span' className='messages__year'>
					{Dates.getYear(creationDate)}
				</Typography>
			</time>

			<span className='messages__node' aria-hidden='true' />

			<article className='messages__content'>
				{isNew && <Chip size='small' label='New' className='messages__new' />}
				<Typography variant='inherit' component='h3' className='messages__title'>
					{message.title}
				</Typography>
				<Typography variant='inherit' component='div' className='messages__body'>
					<ReactMarkdown>{message.content}</ReactMarkdown>
				</Typography>

				<div className='messages__tags'>
					{message.tags.map((tag: string) => (
						<Chip key={tag} size='small' label={tag} />
					))}
				</div>
			</article>
		</li>
	)
})

MessageItemComponent.displayName = 'MessageItemComponent'
export default MessageItemComponent
