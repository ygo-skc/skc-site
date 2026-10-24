import '../../../css/util/event.css'
import { CSSProperties, FC, Suspense, lazy, useCallback, useMemo, useState } from 'react'
import { Alert, Button, ButtonBase, Chip, IconButton, Skeleton, Snackbar, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Markdown from 'react-markdown'
import { Dates } from '../../../helper/Dates'

const GenericNonBreakingErr = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.GenericNonBreakingErr }
	})
)
const DateBadge = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.DateBadge }
	})
)

type Release = HeartAPI.EventItem & { date: Date; daysAway: number }

const shortDate = (d: Date) => `${Dates.getMonth(d)} ${Dates.getDay(d)}`

export const countdown = (daysAway: number): string => {
	if (daysAway <= 0) return 'Out now'
	if (daysAway === 1) return 'Tomorrow'
	if (daysAway < 60) return `In ${daysAway} days`
	return `In ${Math.round(daysAway / 7)} weeks`
}

// first of each month between today and the last release - the rail's month ticks
const monthStarts = (from: Date, to: Date): Date[] => {
	const starts: Date[] = []
	for (let d = new Date(from.getFullYear(), from.getMonth() + 1, 1); d <= to; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
		starts.push(d)
	}
	return starts
}

// the empty rail and a release panel - badge, countdown, name, a few lines of notes and the link - held while releases load
const UpcomingSkeleton: FC = () => (
	<>
		<div className='upcoming__rail' aria-hidden='true'>
			<span className='upcoming__line' />
			<span className='upcoming__today' />
		</div>
		<div className='upcoming__detail' aria-hidden='true' data-testid='upcoming-skeleton'>
			<Skeleton className='upcoming__badge-skeleton' variant='rounded' width={112} />
			<div className='upcoming__body'>
				<div className='upcoming__top'>
					<Skeleton className='upcoming__pill-skeleton' variant='rounded' width='6.5rem' height={32} />
					<Skeleton className='upcoming__pill-skeleton' variant='rounded' width='7.5rem' height={38} />
				</div>
				<Typography variant='h6'>
					<Skeleton width='14rem' />
				</Typography>
				{/* phones wrap the notes onto more lines, so the extra lines only show in a narrow sheet */}
				<div className='upcoming__notes-skeleton'>
					{['100%', '100%', '70%', '100%', '100%', '100%', '100%', '60%'].map((width, i) => (
						<Typography key={i} variant='body2'>
							<Skeleton width={width} />
						</Typography>
					))}
				</div>
				<Skeleton className='upcoming__pill-skeleton' variant='rounded' width={148} height={32} />
			</div>
		</div>
	</>
)

const UpcomingTCGProducts: FC<{ upcomingTCGProducts: APIRequest<HeartAPI.Event> }> = ({ upcomingTCGProducts }) => {
	const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false)
	const [selected, setSelected] = useState(0)

	const releases: Release[] = useMemo(() => {
		const now = new Date()
		return upcomingTCGProducts.events
			.map((event) => {
				const date = new Date(event.eventDate)
				return { ...event, date, daysAway: Dates.isFutureDate(date) ? Dates.daysBetweenTwoDates(now, date) : 0 }
			})
			.sort((a, b) => a.date.getTime() - b.date.getTime())
	}, [upcomingTCGProducts])

	// the rail runs from today to just past the last release, so each dot sits where its date falls
	const last = releases[releases.length - 1]
	const railDays = Math.max(1, (last?.daysAway ?? 0) * 1.04)
	const at = (daysAway: number) => ({ '--at': `${(Math.max(0, daysAway) / railDays) * 100}%` } as CSSProperties)
	const months = useMemo(() => (last ? monthStarts(new Date(), last.date) : []), [last])

	const current = Math.min(selected, releases.length - 1)
	const release = releases[current]

	const handleSnackbarIsClosed = useCallback(() => setIsSnackbarOpen(false), [])

	const handleShowSnackbar = useCallback(() => {
		// origin + path, so a page opened from a shared link doesn't copy the hash twice
		navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#upcoming-tcg-products`)
		setIsSnackbarOpen(true)
	}, [])

	return (
		<section id='upcoming-tcg-products' className='upcoming' aria-labelledby='upcoming-tcg-products__title'>
			<div className='upcoming__sheet'>
				<div className='upcoming__header'>
					<div>
						<Typography id='upcoming-tcg-products__title' variant='h4' component='h2'>
							Upcoming TCG products
						</Typography>
						{release !== undefined && (
							<Typography variant='caption' component='p' className='upcoming__summary'>
								{releases.length} release{releases.length === 1 ? '' : 's'} through {Dates.getMonth(last.date)}
							</Typography>
						)}
						{upcomingTCGProducts.isFetchingData && (
							<Typography variant='caption' component='p' aria-hidden='true'>
								<Skeleton width='9rem' />
							</Typography>
						)}
					</div>
					<IconButton className='upcoming__copy' aria-label='Copy link to this section' onClick={handleShowSnackbar}>
						<LinkIcon />
					</IconButton>
				</div>

				{upcomingTCGProducts.isFetchingData && <UpcomingSkeleton />}
				{!upcomingTCGProducts.isFetchingData && upcomingTCGProducts.requestHasError && (
					<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='7rem' />}>
						<GenericNonBreakingErr errExplanation='Come back at a different time to see upcoming TCG products!' />
					</Suspense>
				)}
				{!upcomingTCGProducts.isFetchingData && !upcomingTCGProducts.requestHasError && release === undefined && (
					<Typography variant='body2' className='upcoming__empty'>
						No upcoming releases right now.
					</Typography>
				)}

				{!upcomingTCGProducts.isFetchingData && release !== undefined && (
					<>
						<div className='upcoming__rail'>
							<span className='upcoming__line' aria-hidden='true' />
							<span className='upcoming__today' aria-hidden='true' />
							{months.map((month) => (
								<Typography key={month.getTime()} variant='caption' className='upcoming__month' style={at(Dates.daysBetweenTwoDates(new Date(), month))} aria-hidden='true'>
									{Dates.getMonth(month)}
								</Typography>
							))}
							{releases.map((r, i) => (
								<Typography
									key={`label ${r.name} ${r.eventDate}`}
									variant='caption'
									className={`upcoming__label${i % 2 ? ' upcoming__label--low' : ''}`}
									style={at(r.daysAway)}
									aria-hidden='true'
								>
									{shortDate(r.date)}
								</Typography>
							))}
							<div role='group' aria-label='Releases'>
								{releases.map((r, i) => (
									<ButtonBase
										key={`${r.name} ${r.eventDate}`}
										className='upcoming__dot'
										style={at(r.daysAway)}
										aria-label={`${r.name.trim()}, ${shortDate(r.date)}`}
										aria-pressed={r === release}
										onClick={() => setSelected(i)}
									/>
								))}
							</div>
						</div>

						{/* the panel holds the notes too - announce just which release is showing */}
						<Typography variant='body2' component='p' className='visually-hidden' aria-live='polite'>
							{current + 1} of {releases.length}: {release.name.trim()}, {shortDate(release.date)}
						</Typography>

						<div className='upcoming__detail'>
							{/* rcl's badge renders its month, day and year as headings - the countdown chip reads the date instead */}
							<span className='upcoming__badge' aria-hidden='true'>
								<Suspense fallback={<Skeleton variant='rectangular' width='7rem' height={79} className='rounded-skeleton' />}>
									<DateBadge month={Dates.getMonth(release.date)} day={+Dates.getDay(release.date)} year={+Dates.getYear(release.date)} variant='normal' />
								</Suspense>
							</span>
							<div className='upcoming__body'>
								<div className='upcoming__top'>
									<Chip
										className='upcoming__countdown'
										label={
											<>
												{countdown(release.daysAway)}
												<span className='visually-hidden'>, {Dates.getDateString(release.date)}</span>
											</>
										}
									/>
									{/* steps through releases for anyone who doesn't think to click the dots */}
									<div className='upcoming__stepper'>
										<IconButton size='small' aria-label='Previous product' disabled={current === 0} onClick={() => setSelected(current - 1)}>
											<ChevronLeftIcon />
										</IconButton>
										<Typography variant='caption' className='upcoming__position'>
											{current + 1} of {releases.length}
										</Typography>
										<IconButton size='small' aria-label='Next product' disabled={current === releases.length - 1} onClick={() => setSelected(current + 1)}>
											<ChevronRightIcon />
										</IconButton>
									</div>
								</div>
								<Typography variant='h6' component='h3'>
									{release.name}
								</Typography>
								<Typography variant='body2' component='div' className='upcoming__notes markdown'>
									<Markdown>{release.notes}</Markdown>
								</Typography>
								<Button className='upcoming__link' href={release.url} target='_blank' rel='noopener' endIcon={<LaunchOutlinedIcon />}>
									Product page
								</Button>
							</div>
						</div>
					</>
				)}
			</div>

			<Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={isSnackbarOpen} autoHideDuration={3000} onClose={handleSnackbarIsClosed}>
				<Alert onClose={handleSnackbarIsClosed} severity='success'>
					Link copied to clipboard. Share that shit!
				</Alert>
			</Snackbar>
		</section>
	)
}

export default UpcomingTCGProducts
