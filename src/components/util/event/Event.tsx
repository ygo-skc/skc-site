import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import DownstreamServices from '../../../helper/DownstreamServices'
import Fetch from '../../../helper/FetchHandler'
import EventItem from './EventItem'

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
			return <EventItem event={event} />
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
