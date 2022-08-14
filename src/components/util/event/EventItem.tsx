import { IconButton, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import DateGlance from '../DateGlance'

const EventItem: FC<{ event: HeartApiEventItem }> = ({ event }) => {
	return (
		<div className='event-item very-light-shadow'>
			<div className='event-item-header'>
				<Typography className='event-name' variant='h6'>
					{event.name}
				</Typography>
				<DateGlance date={new Date(event.eventDate)} />
			</div>

			<Typography className='event-notes-header' variant='subtitle1'>
				Notes
			</Typography>
			<Typography variant='body2'>
				<ReactMarkdown className='event-notes markdown' children={`${event.notes}`} />
			</Typography>

			<div className='event-icon-container'>
				<IconButton className='event-icon-button'>
					<InfoOutlinedIcon />
				</IconButton>
				<IconButton className='event-icon-button' href={event.url} target='_blank'>
					<LaunchOutlinedIcon />
				</IconButton>
			</div>
		</div>
	)
}

export default EventItem
