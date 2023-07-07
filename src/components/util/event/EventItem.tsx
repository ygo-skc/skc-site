import { IconButton, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import { FC, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { DateComponent } from 'skc-rcl'
import { Dates } from '../../../helper/Dates'

const EventItem: FC<{ event: HeartApiEventItem; showEventDialog?: any; setEventDialogEventData?: any }> = ({ event, showEventDialog, setEventDialogEventData }) => {
	const eventDate = new Date(event.eventDate)

	const isWithinDialog = showEventDialog === undefined && setEventDialogEventData === undefined ? true : false
	let parentStyle, notesStyle
	if (isWithinDialog) {
		parentStyle = 'dialog-event-item'
		notesStyle = 'markdown'
	} else {
		parentStyle = 'event-item very-light-shadow'
		notesStyle = 'event-notes markdown'
	}

	const handleExpandEvent = useCallback(() => {
		showEventDialog(true)
		setEventDialogEventData(event)
	}, [showEventDialog, setEventDialogEventData])

	return (
		<div className={parentStyle}>
			<div>
				<DateComponent month={Dates.getMonth(eventDate)} day={+Dates.getDay(eventDate)} year={+Dates.getYear(eventDate)} />
				<div className='event-icon-container'>
					<IconButton disabled={isWithinDialog} className='event-icon-button' aria-label='info' onClick={isWithinDialog ? undefined : handleExpandEvent}>
						<InfoOutlinedIcon />
					</IconButton>
					<IconButton className='event-icon-button' href={event.url} target='_blank' aria-label='visit site'>
						<LaunchOutlinedIcon />
					</IconButton>
				</div>
			</div>
			<div>
				<Typography className='event-name' variant='h6'>
					{event.name}
				</Typography>
				<Typography variant='body2'>
					<ReactMarkdown className={notesStyle} children={`${event.notes}`} />
				</Typography>
			</div>
		</div>
	)
}

export default EventItem
