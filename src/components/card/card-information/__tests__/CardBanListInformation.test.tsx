import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import { ReactNode } from 'react'

import CardBanListInformation from '../CardBanListInformation'
import MuiTheme from '../../../MuiTheme'

// skc-rcl pulls in esm-only charting code jest can't load - the list items just need to show their content
jest.mock('skc-rcl', () => ({
	DatedListItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	Hint: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

const restrictedIn = {
	TCG: [{ banListDate: '2026-10-19', banStatus: 'Forbidden' }],
	MD: [{ banListDate: '2026-09-01', banStatus: 'Limited' }],
	DL: [],
} as unknown as YGOCard.Restrictions

function renderBanLists() {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<CardBanListInformation restrictedIn={restrictedIn} />
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('verify the format control marks the selected format and switches lists', () => {
	renderBanLists()

	const tcg = screen.getByRole('button', { name: 'TCG — 1' })
	const md = screen.getByRole('button', { name: 'Master Duel — 1' })
	expect(tcg).toHaveAttribute('aria-pressed', 'true')
	expect(md).toHaveAttribute('aria-pressed', 'false')
	expect(screen.getByText('Forbidden')).toBeInTheDocument()

	fireEvent.click(md)

	expect(md).toHaveAttribute('aria-pressed', 'true')
	expect(tcg).toHaveAttribute('aria-pressed', 'false')
	expect(screen.getByText('Selected Format — Master Duel')).toBeInTheDocument()
	expect(screen.getByText('Limited')).toBeInTheDocument()

	// pressing the selected format again keeps it selected rather than clearing the choice
	fireEvent.click(md)
	expect(md).toHaveAttribute('aria-pressed', 'true')
})

test('verify a format with no ban lists cannot be picked', () => {
	renderBanLists()

	expect(screen.getByRole('button', { name: 'Duel Links — 0' })).toBeDisabled()
})

test('verify coming back keeps the picked format and loaded lists, and another format folds back to its first few', () => {
	const many = {
		TCG: Array.from({ length: 12 }, (_, i) => ({ banListDate: `2025-${String(i + 1).padStart(2, '0')}-01`, banStatus: 'Limited' })),
		MD: Array.from({ length: 12 }, (_, i) => ({ banListDate: `2024-${String(i + 1).padStart(2, '0')}-01`, banStatus: 'Semi-Limited' })),
		DL: [],
	} as unknown as YGOCard.Restrictions
	const renderMany = () =>
		render(
			<ThemeProvider theme={MuiTheme}>
				<MemoryRouter>
					<CardBanListInformation restrictedIn={many} />
				</MemoryRouter>
			</ThemeProvider>
		)

	const { unmount } = renderMany()
	fireEvent.click(screen.getByRole('button', { name: 'Master Duel — 12' }))
	fireEvent.click(screen.getByRole('button', { name: 'Load All' }))
	expect(screen.getAllByText('Semi-Limited')).toHaveLength(12)
	unmount()

	// same history entry, so the format and the loaded lists are still there
	renderMany()
	expect(screen.getByRole('button', { name: 'Master Duel — 12' })).toHaveAttribute('aria-pressed', 'true')
	expect(screen.getAllByText('Semi-Limited')).toHaveLength(12)
	expect(screen.queryByRole('button', { name: 'Load All' })).not.toBeInTheDocument()

	fireEvent.click(screen.getByRole('button', { name: 'TCG — 12' }))
	expect(screen.getAllByText('Limited')).toHaveLength(10)
	expect(screen.getByRole('button', { name: 'Load All' })).toBeInTheDocument()
})
