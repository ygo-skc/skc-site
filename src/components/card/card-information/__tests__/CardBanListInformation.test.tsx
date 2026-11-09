import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import CardBanListInformation from '../CardBanListInformation'
import MuiTheme from '../../../MuiTheme'

// skc-rcl pulls in esm only chart libraries (the shared column head's module uses its card art)
jest.mock('skc-rcl', () => ({ CardImageRounded: () => null }))

const restrictedIn = {
	TCG: [
		{ banListDate: '2015-11-09', banStatus: 'Forbidden' },
		{ banListDate: '2016-08-29', banStatus: 'Semi Limited' },
	],
	MD: [{ banListDate: '2026-09-01', banStatus: 'Limited' }],
	DL: [{ banListDate: '2026-01-01', banStatus: 'Forbidden' }],
} as unknown as YGOCard.Restrictions

function renderBanLists(lists: YGOCard.Restrictions = restrictedIn, banListDates: { TCG?: string[]; MD?: string[] } = {}) {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<CardBanListInformation restrictedIn={lists} banListDates={banListDates} cardName='Sangan' />
			</MemoryRouter>
		</ThemeProvider>
	)
}

const rows = (column: HTMLElement) =>
	within(column)
		.getAllByRole('listitem')
		.map((row) => row.textContent)

test('a column per format with lists, each newest first with its status in its tint - no Duel Links', () => {
	renderBanLists()

	const tcg = screen.getByRole('region', { name: 'TCG' })
	expect(within(tcg).getByText('Lists Sangan was on, newest first')).toBeInTheDocument()
	expect(rows(tcg)).toEqual(['Aug 29, 2016Semi-Limited', 'Nov 9, 2015Forbidden'])
	expect(within(tcg).getByText('Forbidden').closest('.ban-status-chip')).toHaveClass('ban-status--forbidden')
	expect(rows(screen.getByRole('region', { name: 'Master Duel' }))).toEqual(['Sep 1, 2026Limited'])
	expect(screen.queryByRole('region', { name: 'Duel Links' })).not.toBeInTheDocument()
})

test('a format with no lists keeps its column, with an unlimited row', () => {
	renderBanLists({ TCG: [], MD: restrictedIn.MD, DL: [] })

	const tcg = screen.getByRole('region', { name: 'TCG' })
	expect(within(tcg).getByText('Up to 3 copies a deck')).toBeInTheDocument()
	expect(rows(tcg)).toEqual(['Not on a listUnlimited'])
	expect(within(tcg).getByText('Unlimited').closest('.ban-status-chip')).toHaveClass('ban-status--unlimited')
	expect(rows(screen.getByRole('region', { name: 'Master Duel' }))).toEqual(['Sep 1, 2026Limited'])
})

test('a card never listed keeps both columns, saying how far back the lists reach when their dates are in', () => {
	renderBanLists({ TCG: [], MD: [], DL: [] }, { TCG: ['2026-10-19', '2015-11-09'], MD: ['2026-10-01', '2022-01-19'] })

	expect(screen.getByText('Not on a TCG or Master Duel list')).toBeInTheDocument()
	expect(rows(screen.getByRole('region', { name: 'TCG' }))).toEqual(['Not on a list since Nov 2015Unlimited'])
	expect(rows(screen.getByRole('region', { name: 'Master Duel' }))).toEqual(['Not on a list since Jan 2022Unlimited'])
})

test('a card off the newest list starts its column with where it stands now', () => {
	renderBanLists(restrictedIn, { TCG: ['2026-10-19', '2016-11-14', '2016-08-29', '2016-04-11', '2015-11-09'], MD: ['2026-09-01'] })

	// unlimited since the TCG list after its last one; still on Master Duel's newest list, so no row before its lists
	expect(rows(screen.getByRole('region', { name: 'TCG' }))).toEqual(['Since Nov 14, 2016Unlimited', 'Aug 29, 2016Semi-Limited', 'Nov 9, 2015Forbidden'])
	expect(rows(screen.getByRole('region', { name: 'Master Duel' }))).toEqual(['Sep 1, 2026Limited'])
})

test('past eight lists the rest open in a popup', () => {
	const many = {
		TCG: Array.from({ length: 12 }, (_, i) => ({ banListDate: `2025-${String(i + 1).padStart(2, '0')}-01`, banStatus: 'Limited' })),
		MD: [],
		DL: [],
	} as unknown as YGOCard.Restrictions
	renderBanLists(many)

	expect(rows(screen.getByRole('region', { name: 'TCG' }))).toHaveLength(8)
	fireEvent.click(screen.getByRole('button', { name: 'Show all 12' }))
	expect(within(screen.getByRole('dialog', { name: 'TCG' })).getAllByRole('listitem')).toHaveLength(12)
})
