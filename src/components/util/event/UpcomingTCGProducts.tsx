import '../../../css/util/event.css'
import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import DownstreamServices from '../../../helper/DownstreamServices'
import Fetch from '../../../helper/FetchHandler'
import EventItem from './EventItem'

const UpcomingTCGProducts = () => {
	const [events, setEvents] = useState<HeartApiEventItem[]>([])
	const [eventsUI, setEventsUI] = useState<JSX.Element[]>([])

	const upcomingTCGProductsCB = (eventOutput: HeartApiEventOutput) => {
		setEvents(eventOutput.events)
	}

	useEffect(() => {
		Fetch.handleFetch(`${DownstreamServices.HEART_API_HOST_NAME}/api/v1/events?service=skc&tags=product-release`, upcomingTCGProductsCB, false)?.catch((_err) => {
			// setErrorFetchingMessages(true)
		})
	}, [])

	useEffect(() => {
		const eUI = events.map((event: HeartApiEventItem) => <EventItem event={event} />)

		setEventsUI(eUI)
	}, [events])

	return (
		<div className='event-container-end'>
			<Typography variant='h4'>Upcoming Yu-Gi-Oh! TCG Products</Typography>

			<div className='event-container'>{eventsUI}</div>
		</div>
	)
}

export default UpcomingTCGProducts
