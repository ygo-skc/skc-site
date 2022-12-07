import { IconButton, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import DateComponent from '../generic/DateComponent'

const EventItem: FC<{ event: HeartApiEventItem; showEventDialog?: any; setEventDialogEventData?: any }> = ({ event, showEventDialog, setEventDialogEventData }) => {
	const isWithinDialog = showEventDialog === undefined && setEventDialogEventData === undefined ? true : false
	let parentStyle, notesStyle
	if (isWithinDialog) {
		parentStyle = 'event-item'
		notesStyle = 'markdown'
	} else {
		parentStyle = 'event-item very-light-shadow'
		notesStyle = 'event-notes markdown'
	}

	return (
		<div className={parentStyle}>
			<div className='event-item-header'>
				<Typography className='event-name' variant='h6'>
					{event.name}
				</Typography>
				<DateComponent date={new Date(event.eventDate)} />
			</div>

			<Typography className='event-notes-header' variant='subtitle1'>
				Notes
			</Typography>
			<Typography variant='body2'>
				<ReactMarkdown className={notesStyle} children={`${event.notes}`} />
			</Typography>

			<div className='event-icon-container'>
				{isWithinDialog ? undefined : (
					<IconButton
						className='event-icon-button'
						aria-label='info'
						onClick={() => {
							showEventDialog(true)
							setEventDialogEventData(event)
						}}
					>
						<InfoOutlinedIcon />
					</IconButton>
				)}
				<IconButton className='event-icon-button' href={event.url} target='_blank' aria-label='visit site'>
					<LaunchOutlinedIcon />
				</IconButton>
			</div>
		</div>
	)
}

export default EventItem
