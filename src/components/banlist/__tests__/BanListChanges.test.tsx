import { fireEvent, render, screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import BanListChanges, { BanListChangeColumn } from '../BanListChanges'
import MuiTheme from '../../MuiTheme'

jest.mock('skc-rcl', () => ({
	CardImageRounded: () => null,
}))

const card = (cardID: string, cardName: string, cardColor: YGOCard.Color, monsterType?: string): YGOCard.Deets => ({ cardID, cardName, cardColor, monsterType, cardEffect: '' })

const columns: BanListChangeColumn[] = [
	{
		status: 'Forbidden',
		cards: [
			{ card: card('1', 'Elfnote Tinia', 'effect', 'Spellcaster/Effect'), previousBanStatus: 'Limited' },
			{ card: card('2', 'Pot of Greed', 'spell'), previousBanStatus: 'Semi Limited' },
		],
	},
	{ status: 'Limited', cards: [] },
	{ status: 'Semi-Limited', cards: [] },
	{ status: 'Unlimited', cards: [{ card: card('3', 'Mirror Force', 'trap'), previousBanStatus: 'Forbidden' }] },
]

function renderChanges(props: Partial<React.ComponentProps<typeof BanListChanges>> = {}) {
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<BanListChanges isLoading={false} columns={columns} previousDate='Jun 1, 2026' {...props} />
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('shows a column per new status, skipping statuses nothing moved to', () => {
	renderChanges()

	expect(screen.getByText('3 cards · compared to Jun 1, 2026')).toBeInTheDocument()
	expect(screen.getByRole('region', { name: 'Now Forbidden' })).toBeInTheDocument()
	expect(screen.getByRole('region', { name: 'Back to Unlimited' })).toBeInTheDocument()
	expect(screen.queryByRole('region', { name: 'Now Limited' })).not.toBeInTheDocument()
})

test('lists each card with its type and previous status, linking to the card', () => {
	renderChanges()
	const forbidden = within(screen.getByRole('region', { name: 'Now Forbidden' }))

	expect(forbidden.getByText("Can't be used in the Main, Extra or Side Deck")).toBeInTheDocument()
	const rows = forbidden.getAllByRole('link')
	expect(rows.map((row) => row.getAttribute('href'))).toEqual(['/card/1', '/card/2'])
	expect(rows[0].textContent).toMatch(/ Spellcaster\/Effect was Limited$/)
	expect(within(rows[0]).getByText('Spellcaster/Effect')).toBeInTheDocument()
	expect(within(rows[0]).getByText('Limited')).toBeInTheDocument()
	// the API's "Semi Limited" spelling is shown the site's way
	expect(within(rows[1]).getByText('Spell')).toBeInTheDocument()
	expect(within(rows[1]).getByText('Semi-Limited')).toBeInTheDocument()
})

test('says when nothing changed', () => {
	renderChanges({ columns: columns.map((column) => ({ ...column, cards: [] })) })

	expect(screen.getByText('No cards changed status on this list.')).toBeInTheDocument()
})

test('says when there is no earlier list to compare to', () => {
	renderChanges({ columns: [], previousDate: undefined })

	expect(screen.getByText(/first list in the database/)).toBeInTheDocument()
})

test('holds the columns with a skeleton while loading', () => {
	renderChanges({ isLoading: true })

	const skeleton = screen.getByTestId('ban-list-changes-skeleton')
	expect(skeleton.children).toHaveLength(3)
	// as many rows as a loaded column shows, so the section doesn't grow when the cards arrive
	expect(skeleton.querySelectorAll('.ban-list-changes__rows')[0].children).toHaveLength(8)
	expect(screen.queryByRole('link')).not.toBeInTheDocument()
	expect(screen.queryByText(/compared to/)).not.toBeInTheDocument()
	// the count's line is held too
	expect(screen.getByTestId('ban-list-changes-hint-skeleton')).toBeInTheDocument()
})

test('shows 8 rows per column and the rest in a popup', async () => {
	const many = Array.from({ length: 12 }, (_, i) => ({ card: card(`${i}`, `Card ${i}`, 'spell'), previousBanStatus: 'Unlimited' }))
	renderChanges({ columns: [{ status: 'Limited', cards: many }] })
	const limited = within(screen.getByRole('region', { name: 'Now Limited' }))

	expect(limited.getAllByRole('link')).toHaveLength(8)

	fireEvent.click(limited.getByRole('button', { name: 'Show all 12' }))

	const popup = within(screen.getByRole('dialog', { name: 'Now Limited' }))
	expect(popup.getAllByRole('link')).toHaveLength(12)
	expect(popup.getByText('Max 1 copy across the Main, Extra and Side Deck')).toBeInTheDocument()
	// the column on the page stays at 8
	expect(within(screen.getByRole('region', { name: 'Now Limited', hidden: true })).getAllByRole('link', { hidden: true })).toHaveLength(8)

	fireEvent.click(popup.getByRole('button', { name: 'Close' }))
	await waitForElementToBeRemoved(() => screen.queryByRole('dialog'))
})

test('has no Show all button when a column fits', () => {
	renderChanges()

	expect(screen.queryByRole('button', { name: /Show all/ })).not.toBeInTheDocument()
})
