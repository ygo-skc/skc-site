import '../../css/nav/navigation-icon.css'
import '../../css/nav/messages.css'

import { useState, useEffect } from 'react'
import { Typography, IconButton, Popover, Chip, Divider, Badge } from '@mui/material'
import NotificationsIcon from '@material-ui/icons/Notifications'
import ReactMarkdown from 'react-markdown'

import {HEART_API_HOST_NAME} from '../../helper/DownstreamServices'
import { handleFetch } from '../../helper/FetchHandler'
import { getDateString } from '../../helper/Dates'
import { MessageItem } from '../types/HeartApiTypes'


export default function Messages() {
	const [communicationAnchor, setCommunicationAnchor] = useState<HTMLButtonElement | undefined>(undefined)
	const [communicationList, setCommunicationList] = useState([])
	const [communicationListSize, setCommunicationListSize] = useState(0)

	const isDisplayingNotifications = Boolean(communicationAnchor)

	useEffect(() => {
		handleFetch(`${HEART_API_HOST_NAME}/api/v1/message?service=skc&tags=general`, json => {
			const totalCommunicationItems = json.messages.length
			setCommunicationListSize(totalCommunicationItems)

			setCommunicationList(
				json.messages.map((message: MessageItem, index: number) => {
					return(
						<div>
							<Typography className='communication-message-header' variant='h5'>{message.title}</Typography>
							<Typography className='communication-message-sub-header' variant='subtitle2' >{getDateString(new Date(message.createdAt))}</Typography>
							<Typography className='communication-message-body' variant='body1' >
								<ReactMarkdown children={`${message.content}`} />
							</Typography>
							{
								message.tags.map((tag: string) => <Chip className='communication-message-tag' label={tag} />)
							}
							{
								(index === totalCommunicationItems - 1)? undefined: <Divider className='communication-divider' />
							}
						</div>
					)
				})
			)
		})
	}, [])


	return(
		<div>
			<Badge
				className='communication-message-badge'
				badgeContent={communicationListSize}
				variant='standard'
				color='error' >
				<IconButton
					className='styled-icon-button'
					onClick={(event: React.MouseEvent<HTMLButtonElement>) => {setCommunicationAnchor(event.currentTarget)}}
					aria-label="show 17 new notifications"
					color="inherit">
						<NotificationsIcon />
				</IconButton>
			</Badge>

			<Popover
				id={(isDisplayingNotifications)? 'notification-popover' : undefined}
				open={isDisplayingNotifications}
				anchorEl={communicationAnchor}
				onClose={() => setCommunicationAnchor(undefined)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<div className='communication-popper-container' >
					<Typography className='communication-message-body' variant='h4' >
						Messages ({communicationListSize})
					</Typography>

					{communicationList}
				</div>
			</Popover>
		</div>
	)
}