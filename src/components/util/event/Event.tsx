import { Link, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import DownstreamServices from '../../../helper/DownstreamServices'
import Fetch from '../../../helper/FetchHandler'
import DateGlance from '../DateGlance'

const Event = () => {
	const [events, setEvents] = useState<HeartApiEventItem[]>([])
	const [eventsUI, setEventsUI] = useState<JSX.Element[]>([])

	useEffect(() => {
		Fetch.handleFetch(
			`${DownstreamServices.HEART_API_HOST_NAME}/api/v1/events?service=skc&tags=product-release`,
			(eventOutput: HeartApiEventOutput) => {
				setEvents(eventOutput.events)
			},
			false
		)?.catch((_err) => {
			// setErrorFetchingMessages(true)
		})
	}, [])

	useEffect(() => {
		const eUI = events.map((event: HeartApiEventItem) => {
			return (
				<div
					style={{
						padding: '1rem',
						width: '25rem',
						borderRadius: '1.5rem',
						background: 'white',
						marginRight: '1rem',
						marginBottom: '1rem',
						border: '3px solid #eb608f',
					}}
				>
					<DateGlance date={new Date(event.eventDate)} />

					<Typography style={{ maxLines: '2', height: '3rem' }} align='center' variant='h5'>
						{event.name}
					</Typography>
					<Typography variant='body2'>
						<ReactMarkdown children={`${event.notes}`} />
					</Typography>
					<Typography variant='subtitle1' align='right'>
						<Link color='secondary' className='link' href={event.url}>
							{'More Info >'}
						</Link>
					</Typography>
				</div>
			)
		})

		setEventsUI(eUI)
	}, [events])

	return (
		<div style={{ marginBottom: '2rem' }}>
			<Typography variant='h4'>Upcoming Yu-Gi-Oh! Products</Typography>

			<div style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'auto', overflowX: 'auto' }}>{eventsUI}</div>
		</div>
	)
}

export default Event
