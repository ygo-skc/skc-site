import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import DatabaseInfo from '../DatabaseInfo'
import MuiTheme from '../../MuiTheme'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	Section: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
	Tile: ({ total, subject }: { total: number; subject: string }) => <p>{`${total} ${subject}`}</p>,
}))

// the search field needs the site search provider, which isn't what these tests are about
jest.mock('../search/SearchField', () => () => null)

const renderInfo = (isFetchingData: boolean) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<DatabaseInfo stats={{ cardTotal: 13502, banListTotal: 104, productTotal: 379, isFetchingData }} />
			</MemoryRouter>
		</ThemeProvider>
	)

test('a tile-shaped skeleton for each tile while the totals load', () => {
	renderInfo(true)

	expect(screen.getByTestId('database-summary-skeleton').querySelectorAll('.database-summary__tile-skeleton')).toHaveLength(3)
	expect(screen.queryByText('13502 Cards')).not.toBeInTheDocument()
})

test('the tiles replace the skeleton once loaded', () => {
	renderInfo(false)

	expect(screen.queryByTestId('database-summary-skeleton')).not.toBeInTheDocument()
	expect(screen.getByText('13502 Cards')).toBeInTheDocument()
	expect(screen.getByText('379 Products')).toBeInTheDocument()
})
