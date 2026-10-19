import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ReactNode } from 'react'

import SubNav from '../SubNav'
import MuiTheme from '../../MuiTheme'
import AppRoutes from '../../../helper/AppRoutes'

// jest-location-mock (wired up in setupTests) spies on window.location.assign in a beforeAll hook,
// so call history has to be cleared between tests
beforeEach(() => {
	jest.clearAllMocks()
})

afterEach(() => {
	cleanup()
})

// rendered the way index.tsx renders it - MuiTheme supplies the LinkBehavior that routes internal
// hrefs, and that needs router context. the probe route reports where the router ended up
function renderWithProviders(ui: ReactNode, initialPath = '/') {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={[initialPath]}>
				{ui}
				<Routes>
					<Route path={AppRoutes.Home} element={<div data-testid='route-probe'>{AppRoutes.Home}</div>} />
					<Route path={AppRoutes.BanList} element={<div data-testid='route-probe'>{AppRoutes.BanList}</div>} />
					<Route path={AppRoutes.CardBrowse} element={<div data-testid='route-probe'>{AppRoutes.CardBrowse}</div>} />
					<Route path={AppRoutes.ProductBrowse} element={<div data-testid='route-probe'>{AppRoutes.ProductBrowse}</div>} />
					<Route path={AppRoutes.About} element={<div data-testid='route-probe'>{AppRoutes.About}</div>} />
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('verify sub nav renders every destination as an anchor', () => {
	renderWithProviders(<SubNav />)

	expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', AppRoutes.Home)
	expect(screen.getByRole('link', { name: 'Ban List' })).toHaveAttribute('href', AppRoutes.BanList)
	expect(screen.getByRole('link', { name: 'Card Browse' })).toHaveAttribute('href', AppRoutes.CardBrowse)
	expect(screen.getByRole('link', { name: 'Product Browse' })).toHaveAttribute('href', AppRoutes.ProductBrowse)
	expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', AppRoutes.About)
})

test('verify sub nav navigates client-side without reloading page', () => {
	const destinations = [
		[AppRoutes.BanList, 'Ban List'],
		[AppRoutes.CardBrowse, 'Card Browse'],
		[AppRoutes.ProductBrowse, 'Product Browse'],
		[AppRoutes.About, 'About'],
	]

	destinations.forEach(([href, label]) => {
		renderWithProviders(<SubNav />)
		fireEvent.click(screen.getByRole('link', { name: label }))

		expect(screen.getByTestId('route-probe').textContent).toBe(href)
		cleanup()
	})

	expect(window.location.assign).not.toHaveBeenCalled()
})

test('verify sub nav marks only the link for the current page', () => {
	renderWithProviders(<SubNav />, AppRoutes.BanList)

	expect(screen.getByRole('link', { name: 'Ban List' })).toHaveAttribute('aria-current', 'page')
	expect(screen.getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))).toHaveLength(1)
})

test('verify sub nav only marks home on the root path', () => {
	renderWithProviders(<SubNav />, AppRoutes.About)

	expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
	expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
})

test('verify sub nav marks nothing on a page without its own link', () => {
	renderWithProviders(<SubNav />, '/card/12345')

	expect(screen.getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))).toHaveLength(0)
})
