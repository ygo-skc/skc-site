import '../../../css/util/event.css'
import { Alert, Dialog, DialogTitle, IconButton, Snackbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import DownstreamServices from '../../../helper/DownstreamServices'
import Fetch from '../../../helper/FetchHandler'
import EventItem from './EventItem'
import LinkIcon from '@mui/icons-material/Link'
import GenericNonBreakingErr from '../exception/GenericNonBreakingErr'

const UpcomingTCGProducts = () => {
	const [events, setEvents] = useState<HeartApiEventItem[]>([])
	const [eventsUI, setEventsUI] = useState<JSX.Element[]>([])
	const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false)
	const [errFetchingData, setErrFetchingData] = useState(false)

	const [eventDialogIsOpen, setEventDialogIsOpen] = useState(false)
	const [eventDialogEventData, setEventDialogEventData] = useState<HeartApiEventItem | undefined>(undefined)

	const upcomingTCGProductsCB = (eventOutput: HeartApiEventOutput) => {
		setEvents(eventOutput.events)
	}

	useEffect(() => {
		Fetch.handleFetch(`${DownstreamServices.HEART_API_HOST_NAME}/api/v1/events?service=skc&tags=product-release`, upcomingTCGProductsCB, false)?.catch((_err) => {
			setErrFetchingData(true)
		})
	}, [])

	useEffect(() => {
		const eUI = events.map((event: HeartApiEventItem) => <EventItem event={event} showEventDialog={setEventDialogIsOpen} setEventDialogEventData={setEventDialogEventData} />)

		setEventsUI(eUI)
	}, [events])

	return (
		<div className='event-container-end'>
			<img src={'/assets/yugioh-tcg-official-logo.png'} />
			<div className='event-header-container search-icon-container'>
				<Typography className='event-header' variant='h4'>
					Upcoming Yu-Gi-Oh! TCG Products
				</Typography>
				<IconButton
					onClick={() => {
						navigator.clipboard.writeText(`${window.location.href}#upcoming-tcg-products`)
						setIsSnackbarOpen(true)
					}}
				>
					<LinkIcon />
				</IconButton>
			</div>

			{errFetchingData ? (
				<div style={{ backgroundColor: 'white', maxWidth: '60rem', padding: '1rem', borderRadius: '1rem' }}>
					<GenericNonBreakingErr errExplanation='Come back at a different time to see upcoming TCG products!' />
				</div>
			) : (
				<div className='event-container'>{eventsUI}</div>
			)}
			<Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={isSnackbarOpen} autoHideDuration={3000} onClose={() => setIsSnackbarOpen(false)}>
				<Alert onClose={() => setIsSnackbarOpen(false)} severity='success'>
					Link copied to clipboard. Share that shit!
				</Alert>
			</Snackbar>

			<Dialog
				maxWidth='xs'
				onClose={() => {
					setEventDialogIsOpen(false)
				}}
				open={eventDialogIsOpen}
			>
				<DialogTitle>TCG Product Details</DialogTitle>
				{eventDialogEventData != undefined ? <EventItem event={eventDialogEventData} /> : undefined}
			</Dialog>
		</div>
	)
}

export default UpcomingTCGProducts
