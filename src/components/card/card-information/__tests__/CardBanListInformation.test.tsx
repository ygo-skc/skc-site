import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
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
			<CardBanListInformation restrictedIn={restrictedIn} />
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
