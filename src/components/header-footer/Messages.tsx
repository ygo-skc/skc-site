import '../../css/nav/navigation-icon.css'
import '../../css/nav/messages.css'

import { useState, useEffect } from 'react'
import { Typography, IconButton, Popover, Chip, Divider, Badge } from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications'
import ReactMarkdown from 'react-markdown'

import {HEART_API_HOST_NAME} from '../../helper/DownstreamServices'
import { handleFetch } from '../../helper/FetchHandler'
import { getDateString, getTimeString } from '../../helper/Dates'
import { MessageItem } from '../types/HeartApiTypes'


export default function Messages() {
	const [messagesAnchor, setMessagesAnchor] = useState<HTMLButtonElement | undefined>(undefined)
	const [messagesList, setMessagesList] = useState([])

	const [numMessages, setNumMessages] = useState(0)
	const [numNewMessages, setNumNewMessages] = useState(0)

	const [newestMessageSeen, setNewestMessageSeen] = useState<string>('')

	const isDisplayingNotifications = Boolean(messagesAnchor)


	useEffect(() => {
		handleFetch(`${HEART_API_HOST_NAME}/api/v1/message?service=skc&tags=skc-site`, json => {
			const totalMessages = json.messages.length
			setNumMessages(totalMessages)


			let findNumNewMessages = false
			let _numNewMessages = 0
			const previousNewestMessageTimeStamp = localStorage.getItem('previousNewestMessage') as string
			const previousNewestMessageDate = new Date(previousNewestMessageTimeStamp)

			if (totalMessages > 0) {
				setNewestMessageSeen(json.messages[0].createdAt)

				if (previousNewestMessageTimeStamp !== json.messages[0].createdAt) {
					findNumNewMessages = true
				}
			}

			setMessagesList(
				json.messages.map((message: MessageItem, index: number) => {
					const creationDate = new Date(message.createdAt)

					if (findNumNewMessages) {
						if (previousNewestMessageDate >= creationDate ) {
							findNumNewMessages = false
						} else {
							_numNewMessages++
						}
					}


					return(
						<div>
							<Typography className='communication-message-header' variant='h5'>{message.title}</Typography>
							<Typography className='communication-message-sub-header' variant='subtitle2' >
								{getDateString(creationDate)} {getTimeString(creationDate)}
							</Typography>
							<Typography className='communication-message-body' variant='body1' >
								<ReactMarkdown children={`${message.content}`} />
							</Typography>
							{
								message.tags.map((tag: string) => <Chip className='communication-message-tag' label={tag} />)
							}
							{
								(index === totalMessages - 1)? <div> <br /> </div>: <Divider className='communication-divider' />
							}
						</div>
					)
				})
			)


			setNumNewMessages(_numNewMessages)
		})
	}, [])


	return(
		<div>
			<Badge
				className='communication-message-badge'
				badgeContent={numNewMessages}
				variant='standard'
				color='error' >
				<IconButton
					className='styled-icon-button'
					onClick={(event: React.MouseEvent<HTMLButtonElement>) => {setMessagesAnchor(event.currentTarget)}}
					aria-label="show 17 new notifications"
					color="inherit">
						<NotificationsIcon />
				</IconButton>
			</Badge>

			<Popover
				id={(isDisplayingNotifications)? 'notification-popover' : undefined}
				open={isDisplayingNotifications}
				anchorEl={messagesAnchor}
				onClose={() => {
					setNumNewMessages(0)
					setMessagesAnchor(undefined)
					console.log(newestMessageSeen)
					localStorage.setItem('previousNewestMessage', newestMessageSeen)
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<div className='communication-popper-container' >
					<Typography className='communication-message-body' variant='h4' >
						Messages ({numMessages})
					</Typography>

					{messagesList}
				</div>
			</Popover>
		</div>
	)
}