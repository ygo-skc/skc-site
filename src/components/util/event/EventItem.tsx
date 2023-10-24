import { IconButton, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import { FC, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { DateComponent } from 'skc-rcl'
import { Dates } from '../../../helper/Dates'

type _EventItem =
	| {
			event: HeartApiEventItem
			isWithinDialog: true
			showEventDialog?: React.Dispatch<React.SetStateAction<boolean>>
			setEventDialogEventData?: React.Dispatch<React.SetStateAction<HeartApiEventItem>>
	  }
	| {
			event: HeartApiEventItem
			isWithinDialog: false
			showEventDialog: React.Dispatch<React.SetStateAction<boolean>>
			setEventDialogEventData: React.Dispatch<React.SetStateAction<HeartApiEventItem>>
	  }

const EventItem: FC<_EventItem> = ({ event, showEventDialog, setEventDialogEventData, isWithinDialog }) => {
	const eventDate = new Date(event.eventDate)

	let parentStyle, notesStyle
	if (isWithinDialog) {
		parentStyle = 'dialog-event-item'
		notesStyle = 'markdown'
	} else {
		parentStyle = 'event-item very-light-shadow'
		notesStyle = 'event-notes markdown'
	}

	const handleExpandEvent = useCallback(() => {
		if (!isWithinDialog) {
			showEventDialog(true)
			setEventDialogEventData(event)
		}
	}, [showEventDialog, setEventDialogEventData, event])

	return (
		<div className={parentStyle}>
			<div>
				<DateComponent month={Dates.getMonth(eventDate)} day={+Dates.getDay(eventDate)} year={+Dates.getYear(eventDate)} variant='normal' />
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
					<ReactMarkdown className={notesStyle}>{event.notes}</ReactMarkdown>
				</Typography>
			</div>
		</div>
	)
}

export default EventItem
