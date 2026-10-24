import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import BanListHeader from '../BanListHeader'
import MuiTheme from '../../MuiTheme'
import { AcceptableBanListFormat } from '../../../helper/BanListUtil'

jest.mock('skc-rcl', () => ({
	DateBadge: ({ month, day, year }: { month: string; day: number; year: number }) => <span data-testid='date-badge'>{`${month} ${day} ${year}`}</span>,
}))

const dates = ['2026-12-01', '2026-06-01', '2026-01-15']

function renderHeader(props: Partial<React.ComponentProps<typeof BanListHeader>> = {}) {
	const setFormat = jest.fn()
	const setSelectedBanList = jest.fn()

	render(
		<ThemeProvider theme={MuiTheme}>
			<BanListHeader
				format={AcceptableBanListFormat.TCG}
				setFormat={setFormat}
				isFetchingBanListDates={false}
				banListStartDates={dates}
				selectedBanList='2026-06-01'
				setSelectedBanList={setSelectedBanList}
				isFetchingTotals={false}
				totals={[
					{ status: 'Forbidden', count: 156 },
					{ status: 'Limited', count: 93 },
					{ status: 'Semi-Limited', count: 7 },
				]}
				numChanged={43}
				previousDate='Jan 15, 2026'
				{...props}
			/>
		</ThemeProvider>
	)

	return { setFormat, setSelectedBanList }
}

beforeEach(() => {
	jest.useFakeTimers({ now: new Date(2026, 10, 21) })
})

afterEach(() => {
	jest.useRealTimers()
})

test('shows the format, effective date and how many lists there are', () => {
	renderHeader()

	expect(screen.getByRole('heading', { level: 1, name: 'TCG ban list' })).toBeInTheDocument()
	expect(screen.getByText('Effective Jun 1, 2026')).toBeInTheDocument()
	expect(screen.getByText('3 lists in the database')).toBeInTheDocument()
	expect(screen.queryByText(/Takes effect in/)).not.toBeInTheDocument()
})

test('offers TCG and Master Duel only, and switches format', () => {
	const { setFormat } = renderHeader()
	const formats = screen.getByRole('group', { name: 'Ban list format' })

	expect(
		within(formats)
			.getAllByRole('button')
			.map((b) => b.textContent)
	).toEqual(['TCG', 'Master Duel'])
	expect(within(formats).getByRole('button', { name: 'TCG' })).toHaveAttribute('aria-pressed', 'true')

	fireEvent.click(within(formats).getByRole('button', { name: 'Master Duel' }))
	expect(setFormat).toHaveBeenCalledWith('MD')
})

test('keeps the format when the selected one is clicked again', () => {
	const { setFormat } = renderHeader()

	fireEvent.click(screen.getByRole('button', { name: 'TCG' }))
	expect(setFormat).not.toHaveBeenCalled()
})

test('marks a list that has not taken effect yet', () => {
	renderHeader({ selectedBanList: '2026-12-01' })

	expect(screen.getByText('Takes effect in 10 days')).toBeInTheDocument()
	expect(screen.queryByText(/The current list/)).not.toBeInTheDocument()
})

test('calls the newest list that is in effect the current one', () => {
	renderHeader({ banListStartDates: dates.slice(1), selectedBanList: '2026-06-01' })

	expect(screen.getByText('The current list · 2 lists in the database')).toBeInTheDocument()
})

test('picks another list from the date menu', () => {
	const { setSelectedBanList } = renderHeader()

	fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Ban list date' }))
	fireEvent.click(screen.getByRole('option', { name: 'Jan 15, 2026 - Jun 1, 2026' }))

	expect(setSelectedBanList).toHaveBeenCalledWith(2)
})

test('groups the date menu by year, newest first, and shows the full range when closed', () => {
	renderHeader({ banListStartDates: ['2026-03-01', '2025-11-10', '2025-02-01'], selectedBanList: '2026-03-01' })
	const picker = screen.getByRole('combobox', { name: 'Ban list date' })

	expect(picker).toHaveTextContent('Mar 1, 2026 - Present')

	fireEvent.mouseDown(picker)
	const menu = within(screen.getByRole('listbox'))

	const items = Array.from(screen.getByRole('listbox', { hidden: true }).children).map((item) => item.textContent)
	expect(items).toEqual(['2026', 'Mar 1 – Present', '2025', 'Nov 10 – Mar 1', 'Feb 1 – Nov 10'])
	// headings are hidden from screen readers; each option carries its full dates
	expect(menu.getAllByRole('option').map((option) => option.getAttribute('aria-label'))).toEqual([
		'Mar 1, 2026 - Present',
		'Nov 10, 2025 - Mar 1, 2026',
		'Feb 1, 2025 - Nov 10, 2025',
	])
})

test('holds the heading and date menu with skeletons while dates load', () => {
	renderHeader({ isFetchingBanListDates: true, selectedBanList: '' })

	expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
	expect(screen.queryByText(/lists in the database/)).not.toBeInTheDocument()
})

test('shows the effective date on a date badge', () => {
	renderHeader()

	expect(screen.getByTestId('date-badge')).toHaveTextContent('Jun 1 2026')
	// rcl's badge renders headings - the eyebrow reads the date instead
	expect(screen.getByTestId('date-badge').parentElement).toHaveAttribute('aria-hidden', 'true')
})

test('lists the status totals and how many cards changed as pills', () => {
	renderHeader()
	const totals = within(screen.getByRole('list', { name: 'Totals' }))

	expect(totals.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['156 Forbidden', '93 Limited', '7 Semi-Limited', '43 changed since Jan 15, 2026'])
})

test('leaves out the changed pill when there is no earlier list', () => {
	renderHeader({ previousDate: undefined })

	expect(screen.queryByText(/changed since/)).not.toBeInTheDocument()
})

test('holds the totals with a skeleton while the list loads', () => {
	renderHeader({ isFetchingTotals: true })

	expect(screen.queryByText('Forbidden')).not.toBeInTheDocument()
	// one placeholder pill per total
	expect(within(screen.getByRole('list', { name: 'Totals' })).getAllByRole('listitem')).toHaveLength(4)
})
