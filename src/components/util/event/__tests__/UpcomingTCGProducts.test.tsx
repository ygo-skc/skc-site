import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import UpcomingTCGProducts, { countdown } from '../UpcomingTCGProducts'
import MuiTheme from '../../../MuiTheme'

// react-markdown ships as esm only, which jest can't load - rendering markdown isn't what these tests are about
jest.mock('react-markdown', () => ({
	__esModule: true,
	default: ({ children }: { children: string }) => <p>{children}</p>,
}))

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	GenericNonBreakingErr: ({ errExplanation }: { errExplanation: string }) => <p>{errExplanation}</p>,
	DateBadge: ({ month, day }: { month: string; day: number }) => <span>{`badge ${month} ${day}`}</span>,
}))

const event = (name: string, eventDate: string): HeartAPI.EventItem => ({
	name,
	notes: `${name} notes`,
	location: '',
	eventDate,
	url: `https://example.com/${name}`,
	tags: ['product-release', 'tcg'],
	createdAt: '',
	updatedAt: '',
})

const renderUpcoming = (events: HeartAPI.EventItem[], requestHasError = false) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<UpcomingTCGProducts upcomingTCGProducts={{ service: 'skc', events, isFetchingData: false, requestHasError }} />
		</ThemeProvider>
	)

describe('UpcomingTCGProducts', () => {
	beforeEach(() => {
		jest.useFakeTimers()
		jest.setSystemTime(new Date('2026-10-23T12:00:00Z'))
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('holds the rail and a release panel with a skeleton while releases load', () => {
		render(
			<ThemeProvider theme={MuiTheme}>
				<UpcomingTCGProducts upcomingTCGProducts={{ service: 'skc', events: [], isFetchingData: true, requestHasError: false }} />
			</ThemeProvider>
		)

		expect(screen.getByTestId('upcoming-skeleton')).toHaveAttribute('aria-hidden', 'true')
		expect(screen.queryByRole('group', { name: 'Releases' })).not.toBeInTheDocument()
		expect(screen.queryByText('No upcoming releases right now.')).not.toBeInTheDocument()
	})

	it('shows the soonest release first, whatever order the api sends', async () => {
		renderUpcoming([event('Glorious Victors', '2026-12-04T12:00:00Z'), event('Ultimate Tournament Pack 2', '2026-11-04T12:00:00Z')])

		expect(await screen.findByText('badge Nov 4')).toBeInTheDocument()
		// rcl's badge renders headings, so it's hidden and the countdown reads the date
		expect(screen.getByText('badge Nov 4').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true')
		expect(screen.getByRole('heading', { level: 3, name: 'Ultimate Tournament Pack 2' })).toBeInTheDocument()
		expect(screen.getByText('In 12 days')).toHaveTextContent('In 12 days, Nov 4, 2026')
		expect(screen.getByText('2 releases through Dec')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Ultimate Tournament Pack 2, Nov 4' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByRole('link', { name: 'Product page' })).toHaveAttribute('href', 'https://example.com/Ultimate Tournament Pack 2')
	})

	it('shows a release when its dot is picked', async () => {
		renderUpcoming([event('Ultimate Tournament Pack 2', '2026-11-04T12:00:00Z'), event('Glorious Victors', '2026-12-04T12:00:00Z')])

		await screen.findByText('badge Nov 4')
		fireEvent.click(screen.getByRole('button', { name: 'Glorious Victors, Dec 4' }))

		expect(screen.getByText('badge Dec 4')).toBeInTheDocument()
		expect(screen.getByRole('heading', { level: 3, name: 'Glorious Victors' })).toBeInTheDocument()
		expect(screen.getByText('Glorious Victors notes')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Glorious Victors, Dec 4' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByRole('button', { name: 'Ultimate Tournament Pack 2, Nov 4' })).toHaveAttribute('aria-pressed', 'false')
	})

	it('steps through releases with the previous and next buttons', async () => {
		renderUpcoming([event('Ultimate Tournament Pack 2', '2026-11-04T12:00:00Z'), event('Glorious Victors', '2026-12-04T12:00:00Z')])

		await screen.findByText('badge Nov 4')
		expect(screen.getByText('1 of 2')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Previous product' })).toBeDisabled()

		fireEvent.click(screen.getByRole('button', { name: 'Next product' }))

		expect(screen.getByRole('heading', { level: 3, name: 'Glorious Victors' })).toBeInTheDocument()
		// only the release's name and date are announced, not its notes
		expect(screen.getByText('2 of 2: Glorious Victors, Dec 4')).toHaveAttribute('aria-live', 'polite')
		expect(screen.getByText('Glorious Victors notes').closest('[aria-live]')).toBeNull()
		expect(screen.getByText('2 of 2')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Glorious Victors, Dec 4' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByRole('button', { name: 'Next product' })).toBeDisabled()

		fireEvent.click(screen.getByRole('button', { name: 'Previous product' }))

		expect(screen.getByRole('heading', { level: 3, name: 'Ultimate Tournament Pack 2' })).toBeInTheDocument()
	})

	it('copies a link to the section without doubling the hash', () => {
		const writeText = jest.fn()
		Object.assign(navigator, { clipboard: { writeText } })
		window.history.pushState({}, '', '/#upcoming-tcg-products')
		renderUpcoming([event('Glorious Victors', '2026-12-04T12:00:00Z')])

		fireEvent.click(screen.getByRole('button', { name: 'Copy link to this section' }))

		expect(writeText).toHaveBeenCalledWith('http://localhost/#upcoming-tcg-products')
	})

	it('says so when nothing is coming up', () => {
		renderUpcoming([])

		expect(screen.getByText('No upcoming releases right now.')).toBeInTheDocument()
		expect(screen.queryByRole('group', { name: 'Releases' })).not.toBeInTheDocument()
	})

	it('counts down in days, then weeks', () => {
		expect(countdown(0)).toBe('Out now')
		expect(countdown(1)).toBe('Tomorrow')
		expect(countdown(42)).toBe('In 42 days')
		expect(countdown(98)).toBe('In 14 weeks')
	})
})
