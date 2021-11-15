import { useState, useEffect } from 'react'
import { Typography, IconButton, Popover, Chip, Divider, Badge } from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications'
import ReactMarkdown from 'react-markdown'

import Styled from 'styled-components'

import {HEART_API_HOST_NAME} from '../../helper/DownstreamServices'
import { handleFetch } from '../../helper/FetchHandler'
import { getDateString } from '../../helper/Dates'
import { MessageItem } from '../types/HeartApiTypes'


const MessageBadge = Styled(Badge)`
	&& {
		.MuiBadge-badge {
			padding: 0rem;
			top: 5;
			right: 5;
		}
	}
`

const CommunicationMessageHeader = Styled(Typography)`
	&& {
		margin-bottom: 1rem;
		color: black;
	}
`

const CommunicationMessageSubHeader = Styled(CommunicationMessageHeader)`
	&&&& {
		margin-bottom: .5rem;
	}
`

const CommunicationMessageBody = Styled(Typography)`
	&& {
		color: #555;

		a {
			background: rgba(253, 237, 221, 1);
			padding: .15rem;
			color: #ff8f44;
			text-decoration: none;

			:hover {
				text-decoration: underline;
			}
		}

		p {
			margin-block-start: 0rem;
			margin-block-end: .2rem;
		}
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
		border-radius: 100rem;
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
		background: rgba(93, 90, 107, .2);
		backdrop-filter: blur(60px);
	}
`


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
							<CommunicationMessageHeader variant='h5'>{message.title}</CommunicationMessageHeader>
							<CommunicationMessageSubHeader variant='subtitle2' >{getDateString(new Date(message.createdAt))}</CommunicationMessageSubHeader>
							<CommunicationMessageBody variant='body1' >
								<ReactMarkdown children={`${message.content}`} />
							</CommunicationMessageBody>
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
			<MessageBadge
				badgeContent={communicationListSize}
				variant='standard'
				overlap='rectangular'
				color='error' >
				<IconButtonStyled
					onClick={(event: React.MouseEvent<HTMLButtonElement>) => {setCommunicationAnchor(event.currentTarget)}}
					aria-label="show 17 new notifications"
					color="inherit">
						<Icon />
				</IconButtonStyled>
			</MessageBadge>

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