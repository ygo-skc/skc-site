import { Link, Typography } from '@mui/material'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import DateGlance from '../DateGlance'

const EventItem: FC<{ event: HeartApiEventItem }> = ({ event }) => {
	return (
		<div className='event-item'>
			<div className='event-item-header'>
				<Typography className='event-name' variant='h6'>
					{event.name}
				</Typography>
				<DateGlance date={new Date(event.eventDate)} />
			</div>

			<Typography className='event-notes-header' variant='subtitle1'>
				Notes
			</Typography>
			<Typography className='event-notes' variant='body2'>
				<ReactMarkdown children={`${event.notes}`} />
			</Typography>
			<Typography className='event-url' variant='body1' align='right'>
				<Link color='secondary' className='link' href={event.url} target='_blank'>
					{'More Info >'}
				</Link>
			</Typography>
		</div>
	)
}

export default EventItem
