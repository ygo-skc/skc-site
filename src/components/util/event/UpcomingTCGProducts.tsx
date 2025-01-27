import '../../../css/util/event.css'
import { useCallback, lazy, useEffect, useState, JSX, FC, Suspense } from 'react'
import { Alert, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Snackbar, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import EventItem from './EventItem'

const GenericNonBreakingErr = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.GenericNonBreakingErr }
	})
)

const UpcomingTCGProducts: FC<{ upcomingTCGProducts: APIRequest<HeartAPI.Event> }> = ({ upcomingTCGProducts }) => {
	const [eventsUI, setEventsUI] = useState<JSX.Element[]>([])
	const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false)

	const [eventDialogIsOpen, setEventDialogIsOpen] = useState(false)
	const [eventDialogEventData, setEventDialogEventData] = useState<HeartAPI.EventItem>({} as HeartAPI.EventItem)

	useEffect(() => {
		const eUI = upcomingTCGProducts.events.map((event: HeartAPI.EventItem) => (
			<EventItem
				key={`${event.name} ${event.createdAt}`}
				isWithinDialog={false}
				event={event}
				showEventDialog={setEventDialogIsOpen}
				setEventDialogEventData={setEventDialogEventData}
			/>
		))
		setEventsUI(eUI)
	}, [upcomingTCGProducts])

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

			{!upcomingTCGProducts.isFetchingData && <div className='event-container'>{eventsUI}</div>}
			{!upcomingTCGProducts.isFetchingData && upcomingTCGProducts.requestHasError && (
				<div style={{ backgroundColor: 'white', maxWidth: '60rem', padding: '1rem', borderRadius: '1rem', margin: 'auto' }}>
					<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='7rem' />}>
						<GenericNonBreakingErr errExplanation='Come back at a different time to see upcoming TCG products!' />
					</Suspense>
				</div>
			)}
			{upcomingTCGProducts.isFetchingData && <Skeleton variant='rectangular' height='200px' width='100%' className='rounded-skeleton' />}

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
