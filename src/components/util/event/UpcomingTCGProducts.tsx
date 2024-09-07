import '../../../css/util/event.css'
import { useCallback, lazy, startTransition, useEffect, useState } from 'react'
import { Alert, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Snackbar, Typography } from '@mui/material'
import DownstreamServices from '../../../helper/DownstreamServices'
import FetchHandler from '../../../helper/FetchHandler'
import LinkIcon from '@mui/icons-material/Link'

const GenericNonBreakingErr = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.GenericNonBreakingErr }
	})
)
const EventItem = lazy(() => import('./EventItem'))

const UpcomingTCGProducts = () => {
	const [eventsUI, setEventsUI] = useState<JSX.Element[]>([])
	const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false)
	const [isFetchingData, setIsFetchingData] = useState(true)
	const [errFetchingData, setErrFetchingData] = useState(false)

	const [eventDialogIsOpen, setEventDialogIsOpen] = useState(false)
	const [eventDialogEventData, setEventDialogEventData] = useState<HeartApiEventItem>({} as HeartApiEventItem)

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch(
				`${DownstreamServices.HEART_API_ENDPOINTS.events}?service=skc&tags=product-release`,
				(eventOutput: HeartApiEventOutput) => {
					const eUI = eventOutput.events.map((event: HeartApiEventItem) => (
						<EventItem
							key={`${event.name} ${event.createdAt}`}
							isWithinDialog={false}
							event={event}
							showEventDialog={setEventDialogIsOpen}
							setEventDialogEventData={setEventDialogEventData}
						/>
					))

					startTransition(() => {
						setEventsUI(eUI)
						setIsFetchingData(false)
					})
				},
				false
			)?.catch(() => {
				setErrFetchingData(true)
				setIsFetchingData(false)
			})
		})
	}, [])

	const handleSnackbarIsClosed = useCallback(() => setIsSnackbarOpen(false), [])

	const handleShowSnackbar = useCallback(() => {
		navigator.clipboard.writeText(`${window.location.href}#upcoming-tcg-products`)
		setIsSnackbarOpen(true)
	}, [])

	const handleDisplayDialog = useCallback(() => setEventDialogIsOpen(false), [])

	return (
		<div id='upcoming-tcg-products' style={{ marginBottom: '3.5rem' }}>
			<img alt='Yu-Gi-Oh! TCG Logo' src={'/assets/yugioh-tcg-official-logo.png'} />
			<div className='event-header-container search-icon-container'>
				<Typography className='event-header' variant='h4'>
					Upcoming Yu-Gi-Oh! TCG Products
				</Typography>
				<IconButton onClick={handleShowSnackbar}>
					<LinkIcon />
				</IconButton>
			</div>

			{!isFetchingData && <div className='event-container'>{eventsUI}</div>}
			{!isFetchingData && errFetchingData && (
				<div style={{ backgroundColor: 'white', maxWidth: '60rem', padding: '1rem', borderRadius: '1rem' }}>
					<GenericNonBreakingErr errExplanation='Come back at a different time to see upcoming TCG products!' />
				</div>
			)}
			{isFetchingData && <Skeleton variant='rectangular' height='280px' width='100%' className='rounded-skeleton' />}

			<Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={isSnackbarOpen} autoHideDuration={3000} onClose={handleSnackbarIsClosed}>
				<Alert onClose={handleSnackbarIsClosed} severity='success'>
					Link copied to clipboard. Share that shit!
				</Alert>
			</Snackbar>

			<Dialog maxWidth='xs' onClose={handleDisplayDialog} open={eventDialogIsOpen}>
				<DialogTitle>TCG Product Details</DialogTitle>
				<DialogContent>{eventDialogEventData !== undefined ? <EventItem isWithinDialog={true} event={eventDialogEventData} /> : undefined}</DialogContent>
			</Dialog>
		</div>
	)
}

export default UpcomingTCGProducts
