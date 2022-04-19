import { Link, Typography } from '@mui/material'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import DateGlance from '../DateGlance'

const EventItem: FC<{ event: HeartApiEventItem }> = ({ event }) => {
	return (
		<div className='event-parent'>
			<DateGlance date={new Date(event.eventDate)} />

			<Typography className='event-name' align='center' variant='h5'>
				{event.name}
			</Typography>
			<Typography className='event-notes' variant='body2'>
				<ReactMarkdown children={`${event.notes}`} />
			</Typography>
			<Typography className='event-url' variant='subtitle1' align='right'>
				<Link color='secondary' className='link' href={event.url} target='_blank'>
					{'More Info >'}
				</Link>
			</Typography>
		</div>
	)
}

export default EventItem
