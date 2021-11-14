import { useState, useEffect } from 'react'
import { Typography, IconButton, Popover, Chip, Divider } from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications'

import Styled from 'styled-components'

import {HEART_API_HOST_NAME} from '../../helper/DownstreamServices'
import { handleFetch } from '../../helper/FetchHandler'
import { getDateString } from '../../helper/Dates'
import { MessageItem } from '../types/HeartApiTypes'


const CommunicationMessageHeader = Styled(Typography)`
	&& {
		margin-bottom: 1rem;
		color: black;
	}
`

const CommunicationMessageBody = Styled(Typography)`
	&& {
		color: #555;
	}
`

const CommunicationMessageTag = Styled(Chip)`
	&& {
		background: rgba(135, 120, 229, .8);
		backdrop-filter: blur(60px);
	}
`

const Icon = Styled(NotificationsIcon)`
	&&& {
		font-size: 1.7rem;
	}
`

const IconButtonStyled = Styled(IconButton)`
	&&& {
		border-radius: 50rem;
		background: rgb(0, 0, 0, .6);
		padding: 8px;

		:hover
			{
				background: rgb(255, 255, 255, .4);
				backdrop-filter: blur(60px)
			}
	}
`

const CommunicationPopperContainer = Styled.div`
	&& {
		padding: 1rem;
		max-width: 400px;
		max-height: 500px;
		background: rgb(255, 255, 255, .4);
		backdrop-filter: blur(60px)
	}
`

const CommunicationDivider = Styled(Divider)`
	&& {
		margin-top: .75rem;
		margin-bottom: 1rem;
	}
`


export default function Messages() {
	const [communicationAnchor, setCommunicationAnchor] = useState<HTMLButtonElement | undefined>(undefined)
	const [communicationList, setCommunicationList] = useState([])

	const isDisplayingNotifications = Boolean(communicationAnchor)

	useEffect(() => {
		handleFetch(`${HEART_API_HOST_NAME}/api/v1/message?service=skc&tags=general`, json => {
			const totalCommunicationItems = json.messages.length

			setCommunicationList(
				json.messages.map((message: MessageItem, index: number) => {
					return(
						<div>
							<CommunicationMessageHeader variant='h5'>{message.title}</CommunicationMessageHeader>
							<CommunicationMessageHeader variant='subtitle2' >{getDateString(new Date(message.createdAt))}</CommunicationMessageHeader>
							<CommunicationMessageBody variant='body1' >{message.content}</CommunicationMessageBody>
							{
								message.tags.map((tag: string) => <CommunicationMessageTag label={tag} />)
							}
							{
								(index === totalCommunicationItems - 1)? undefined: <CommunicationDivider />
							}
						</div>
					)
				})
			)
		})
	}, [])


	return(
		<div>
			<IconButtonStyled
				onClick={(event: React.MouseEvent<HTMLButtonElement>) => {setCommunicationAnchor(event.currentTarget)}}
				aria-label="show 17 new notifications"
				color="inherit">
					<Icon />
			</IconButtonStyled>

			<Popover
				id={(isDisplayingNotifications)? 'notification-popover' : undefined}
				open={isDisplayingNotifications}
				anchorEl={communicationAnchor}
				onClose={() => setCommunicationAnchor(undefined)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<CommunicationPopperContainer >
					<CommunicationMessageBody variant='h4' >
						Messages
					</CommunicationMessageBody>
					{communicationList}
				</CommunicationPopperContainer>
			</Popover>
		</div>
	)
}