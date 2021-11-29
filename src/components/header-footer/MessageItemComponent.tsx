
import '../../css/nav/messages.css'

import { FC} from 'react'
import { Typography, Chip, Divider } from '@material-ui/core'
import ReactMarkdown from 'react-markdown'

import { getDateString, getTimeString } from '../../helper/Dates'

type MessageItemComponentArgs = {
	creationDate: Date,
	messageTitle: string,
	messageContent: string,
	messageTags: string[],
	isLastMessage: boolean
}

const MessageItemComponent:FC<MessageItemComponentArgs> = ({creationDate, messageTitle, messageContent, messageTags, isLastMessage}) => {
	return(
		<div>
			<Typography className='communication-message-header' variant='h5'>{messageTitle}</Typography>
			<Typography className='communication-message-sub-header' variant='subtitle2' >
				{getDateString(creationDate)} {getTimeString(creationDate)}
			</Typography>
			<Typography className='communication-message-body' variant='body1' >
				<ReactMarkdown children={`${messageContent}`} />
			</Typography>
			{
				messageTags.map((tag: string) => <Chip className='communication-message-tag' label={tag} />)
			}
			{
				(isLastMessage)? <div />: <Divider className='communication-divider' />
			}
		</div>
	)
}


export default MessageItemComponent