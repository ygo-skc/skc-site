import '../../css/header-footer/navigation-icon.css'
import '../../css/header-footer/messages.css'

import { useState, useEffect, startTransition, useCallback } from 'react'
import { Typography, IconButton, Popover, Badge } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

import DownstreamServices from '../../helper/DownstreamServices'
import FetchHandler from '../../helper/FetchHandler'
import MessageItemComponent from './MessageItemComponent'
import { GenericNonBreakingErr } from 'skc-rcl'

const PREVIOUS_NEWEST_MESSAGE_KEY = 'previousNewestMessage'

function Messages() {
	const [messagesAnchor, setMessagesAnchor] = useState<HTMLButtonElement | undefined>(undefined)
	const [messages, setMessages] = useState<HeartAPI.MessageInstance[]>([])

	// messages created after this were posted since the last time the popup was closed
	const [lastSeenDate, setLastSeenDate] = useState(() => new Date(localStorage.getItem(PREVIOUS_NEWEST_MESSAGE_KEY) as string))
	const [errorFetchingMessages, setErrorFetchingMessages] = useState(false)

	const isDisplayingMessages = Boolean(messagesAnchor)
	const isNew = (message: HeartAPI.MessageInstance) => lastSeenDate < new Date(message.createdAt)
	const numNewMessages = messages.filter(isNew).length

	useEffect(() => {
		FetchHandler.handleFetch(
			`${DownstreamServices.HEART_API_ENDPOINTS.messages}?service=skc&tags=skc-site,skc-api`,
			(messageData: HeartAPI.Message) => startTransition(() => setMessages(messageData.messages)),
			false
		)?.catch(() => {
			startTransition(() => setErrorFetchingMessages(true))
		})
	}, [])

	const handleMessagesIconClicked = useCallback((event: React.MouseEvent<HTMLButtonElement>) => setMessagesAnchor(event.currentTarget), [])

	const handleMessagePopupClosed = useCallback(() => {
		setMessagesAnchor(undefined)
		if (messages.length === 0) return

		// messages arrive newest first
		const newestMessageSeen = messages[0].createdAt
		setLastSeenDate(new Date(newestMessageSeen))
		localStorage.setItem(PREVIOUS_NEWEST_MESSAGE_KEY, newestMessageSeen)
	}, [messages])

	return (
		<>
			<Badge className='communication-message-badge' badgeContent={numNewMessages} variant='standard' color='error'>
				<IconButton
					className='styled-icon-button'
					onClick={handleMessagesIconClicked}
					aria-label={numNewMessages === 0 ? 'Messages' : `Messages, ${numNewMessages} new`}
					aria-haspopup='dialog'
					color='inherit'
				>
					<NotificationsIcon />
				</IconButton>
			</Badge>

			<Popover
				open={isDisplayingMessages}
				anchorEl={messagesAnchor}
				onClose={handleMessagePopupClosed}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				marginThreshold={12}
				slotProps={{ paper: { className: 'messages' } }}
			>
				<section className='messages__panel' aria-labelledby='messages-heading'>
					<header className='messages__header'>
						<Typography id='messages-heading' variant='inherit' component='h2' className='messages__heading'>
							What&apos;s new on SKC
						</Typography>
						{!errorFetchingMessages && (
							<Typography variant='inherit' className='messages__count'>
								{messages.length} updates
							</Typography>
						)}
					</header>

					{errorFetchingMessages ? (
						<GenericNonBreakingErr errExplanation='No meaningful impact to the site functionality expected.' />
					) : (
						<ol className='messages__timeline'>
							{messages.map((message) => (
								<MessageItemComponent key={message.createdAt} message={message} isNew={isNew(message)} />
							))}
						</ol>
					)}
				</section>
			</Popover>
		</>
	)
}

export default Messages
