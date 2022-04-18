import { Link, Typography } from '@mui/material'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import DateGlance from '../DateGlance'

const EventItem: FC<{ event: HeartApiEventItem }> = ({ event }) => {
	return (
		<div
			style={{
				padding: '.5rem',
				width: '24rem',
				borderRadius: '1.5rem',
				background: 'white',
				marginRight: '1rem',
				marginBottom: '1rem',
				border: '3px solid #ef7ea4',
			}}
		>
			<DateGlance date={new Date(event.eventDate)} />

			<Typography style={{ maxLines: '2', height: '3rem', fontWeight: '800', marginBottom: '0' }} align='center' variant='h5'>
				{event.name}
			</Typography>
			<Typography style={{ height: '10rem', overflowY: 'auto' }} variant='body2'>
				<ReactMarkdown children={`${event.notes}`} />
			</Typography>
			<Typography style={{ marginBottom: '.25rem', marginRight: '.25rem' }} variant='subtitle1' align='right'>
				<Link color='secondary' className='link' href={event.url}>
					{'More Info >'}
				</Link>
			</Typography>
		</div>
	)
}

export default EventItem
