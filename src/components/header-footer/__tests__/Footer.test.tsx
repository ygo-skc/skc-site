import { render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import Footer from '../Footer'
import MuiTheme from '../../MuiTheme'
import AppRoutes from '../../../helper/AppRoutes'
import FetchHandler from '../../../helper/FetchHandler'

afterEach(() => {
	jest.restoreAllMocks()
})

function renderFooter() {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<Footer />
			</MemoryRouter>
		</ThemeProvider>
	)
}

// the version a service reports for itself, keyed by the term the footer lists it under
function versionFor(term: string) {
	const dt = within(screen.getByRole('contentinfo')).getByText(term, { selector: 'dt' })
	return dt.nextElementSibling?.textContent
}

test('verify footer links to every explore destination', () => {
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(() => new Promise<void>(() => {}))
	renderFooter()

	const explore = screen.getByRole('navigation', { name: 'Explore' })
	expect(within(explore).getByRole('link', { name: 'Ban List' })).toHaveAttribute('href', AppRoutes.BanList)
	expect(within(explore).getByRole('link', { name: 'Card Browse' })).toHaveAttribute('href', AppRoutes.CardBrowse)
	expect(within(explore).getByRole('link', { name: 'Product Browse' })).toHaveAttribute('href', AppRoutes.ProductBrowse)
	expect(within(explore).getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', AppRoutes.Privacy)
})

test('verify footer shows a placeholder version until each service responds', () => {
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(() => new Promise<void>(() => {}))
	renderFooter()

	expect(versionFor('SKC API')).toBe('v---')
	expect(versionFor('Heart API')).toBe('v---')
	expect(versionFor('Suggestion Engine')).toBe('v---')
})

test('verify footer lists the version each service reports', async () => {
	// keyed by call order - service base urls come from env vars that are unset under test, so endpoints can collide
	let calls = 0
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(<T,>(_endPoint: string, onJsonReceived: (res: T) => void) => {
		onJsonReceived({ version: `1.${calls++}.0`, status: 'UP' } as T)
		return Promise.resolve()
	})
	renderFooter()

	expect(await screen.findByText('v1.0.0')).toBeInTheDocument()
	expect(versionFor('SKC API')).toBe('v1.0.0')
	expect(versionFor('Heart API')).toBe('v1.1.0')
	expect(versionFor('Suggestion Engine')).toBe('v1.2.0')
})
