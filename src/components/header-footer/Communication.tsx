import { useState, useEffect } from 'react'
import { Typography, IconButton, Popover, Chip } from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications'

import {HEART_API_HOST_NAME} from '../../helper/DownstreamServices'
import { handleFetch } from '../../helper/FetchHandler'
import { getDateString } from '../../helper/Dates'
import { CommunicationItem } from '../types/HeartApiTypes'

export default function Communication() {
	const [communicationAnchor, setCommunicationAnchor] = useState<HTMLButtonElement | undefined>(undefined)
	const [communicationList, setCommunicationList] = useState([])

	const isDisplayingNotifications = Boolean(communicationAnchor)

	useEffect(() => {
		handleFetch(`${HEART_API_HOST_NAME}/api/v1/communication?service=skc&tags=general`, json => {
			setCommunicationList(
				json.communications.map((communication: CommunicationItem) => {
					return(
						<div>
							<Typography variant='h5' style={{ marginTop: '1rem', color: 'black' }} >{communication.title}</Typography>
							<Typography variant='subtitle2' style={{ marginBottom: '1rem', color: 'black' }} >{getDateString(new Date(communication.createdAt))}</Typography>
							<Typography variant='body1' style={{ color: '#555' }} >{communication.content}</Typography>
							{
								communication.tags.map((tag: string) => <Chip style={{background: ' rgba(135, 120, 229, .8)', backdropFilter: 'blur(60px)'}} label={tag} />)
							}
						</div>
					)
				})
			)
		})
	}, [])


	return(
		<div>
			<IconButton
				onClick={(event: React.MouseEvent<HTMLButtonElement>) => {setCommunicationAnchor(event.currentTarget)}}
				style={{fontSize: '1.4rem'}}
				aria-label="show 17 new notifications"
				color="inherit">
					<NotificationsIcon />
			</IconButton>

			<Popover
				id={(isDisplayingNotifications)? 'notification-popover' : undefined}
				open={isDisplayingNotifications}
				anchorEl={communicationAnchor}
				onClose={() => setCommunicationAnchor(undefined)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<div style={{padding: '1rem', maxWidth: '400px', background: 'rgb(255, 255, 255, .4)', backdropFilter: 'blur(60px)' }}>
					<Typography variant='h4' style={{ marginTop: '1rem', color: 'black' }} >
						Communication
					</Typography>
					{communicationList}
				</div>
			</Popover>
		</div>
	)
}