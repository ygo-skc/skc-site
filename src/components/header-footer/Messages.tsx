import '../../css/header-footer/navigation-icon.css'
import '../../css/header-footer/messages.css'

import { useState, useEffect, startTransition, useCallback, useMemo } from 'react'
import { Typography, IconButton, Popover, Badge, Chip } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CheckIcon from '@mui/icons-material/Check'

import * as DownstreamServices from '../../helper/DownstreamServices'
import FetchHandler from '../../helper/FetchHandler'
import * as Dates from '../../helper/Dates'
import MessageItemComponent from './MessageItemComponent'
import MessageRow from './MessageRow'
import { GenericNonBreakingErr } from 'skc-rcl'

const PREVIOUS_NEWEST_MESSAGE_KEY = 'previousNewestMessage'

function CaughtUp({ label, isTop = false }: { label: string; isTop?: boolean }) {
	return (
		<div className={isTop ? 'messages__caught-up messages__caught-up--top' : 'messages__caught-up'}>
			<Chip size='small' icon={<CheckIcon />} label={label} />
		</div>
	)
}

function Messages() {
	const [messagesAnchor, setMessagesAnchor] = useState<HTMLButtonElement | undefined>(undefined)
	const [messages, setMessages] = useState<HeartAPI.MessageInstance[]>([])

	// messages created after this were posted since the last time the popup was closed
	const [lastSeenDate, setLastSeenDate] = useState(() => new Date(localStorage.getItem(PREVIOUS_NEWEST_MESSAGE_KEY) as string))
	const [errorFetchingMessages, setErrorFetchingMessages] = useState(false)

	const isDisplayingMessages = Boolean(messagesAnchor)
	const isNew = (message: HeartAPI.MessageInstance) => lastSeenDate < new Date(message.createdAt)
	const numNewMessages = messages.filter(isNew).length

	// messages arrive newest first, so the new ones lead. with nothing new the latest stays in full, so the popup is never only folded rows
	const numFullMessages = numNewMessages > 0 ? numNewMessages : Math.min(messages.length, 1)
	const earlierByYear = useMemo(() => {
		const years = new Map<string, HeartAPI.MessageInstance[]>()
		messages.slice(numFullMessages).forEach((message) => {
			const year = Dates.getYear(new Date(message.createdAt))
			years.set(year, [...(years.get(year) ?? []), message])
		})
		return [...years]
	}, [messages, numFullMessages])

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
		localStorage.setItem(PREVIOUS_NEWEST_MESSAGE_KEY, messages[0].createdAt)
	}, [messages])

	// new posts fold into rows once the popup has faded out, rather than reshuffling while it fades
	const handlePopupExited = useCallback(() => {
		if (messages.length > 0) setLastSeenDate(new Date(messages[0].createdAt))
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
				slotProps={{ paper: { className: 'messages' }, transition: { onExited: handlePopupExited } }}
			>
				<section className='messages__panel' aria-labelledby='messages-heading'>
					<header className='messages__header'>
						<Typography id='messages-heading' variant='h5' component='h2' className='messages__heading'>
							What&apos;s new on SKC
						</Typography>
						{!errorFetchingMessages &&
							(numNewMessages > 0 ? (
								<Chip size='small' label={`${numNewMessages} new`} className='messages__count-new' />
							) : (
								<Typography variant='caption' className='messages__count'>
									{messages.length} updates
								</Typography>
							))}
					</header>

					{errorFetchingMessages ? (
						<GenericNonBreakingErr errExplanation='No meaningful impact to the site functionality expected.' />
					) : (
						messages.length > 0 && (
							<>
								{numNewMessages === 0 && <CaughtUp label='You’re all caught up' isTop />}
								<ol className='messages__posts'>
									{messages.slice(0, numFullMessages).map((message) => (
										<MessageItemComponent key={message.createdAt} message={message} isNew={isNew(message)} />
									))}
								</ol>
								{numNewMessages > 0 && <CaughtUp label='You’re caught up' />}

								{earlierByYear.map(([year, yearMessages]) => (
									<section key={year} className='messages__year' aria-labelledby={`messages-year-${year}`}>
										<header className='messages__year-header'>
											<Typography id={`messages-year-${year}`} variant='overline' component='h3' className='messages__year-heading'>
												{year}
											</Typography>
											<Typography variant='caption' className='messages__year-count'>
												{yearMessages.length} {yearMessages.length === 1 ? 'update' : 'updates'}
											</Typography>
										</header>
										<ol className='messages__rows'>
											{yearMessages.map((message) => (
												<MessageRow key={message.createdAt} message={message} />
											))}
										</ol>
									</section>
								))}
							</>
						)
					)}
				</section>
			</Popover>
		</>
	)
}

export default Messages
