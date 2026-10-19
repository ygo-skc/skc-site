import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { Link } from '@mui/material'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ReactNode } from 'react'

import MuiTheme from '../MuiTheme'
import { isExternalHref } from '../LinkBehavior'
import AppRoutes from '../../helper/AppRoutes'

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
					<Route path={AppRoutes.About} element={<div data-testid='route-probe'>{AppRoutes.About}</div>} />
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('verify app paths are not treated as external links', () => {
	expect(isExternalHref(AppRoutes.Home)).toBe(false)
	expect(isExternalHref(AppRoutes.About)).toBe(false)
	expect(isExternalHref('/ban_list/TCG')).toBe(false)
	expect(isExternalHref('/card/40044918')).toBe(false)
})

test('verify off-origin links are treated as external', () => {
	expect(isExternalHref('https://www.paypal.com/donate')).toBe(true)
	expect(isExternalHref('http://example.com')).toBe(true)
	expect(isExternalHref('mailto:admin@skc.cards')).toBe(true)
	expect(isExternalHref('tel:+15555555555')).toBe(true)
	expect(isExternalHref('//cdn.example.com/x.png')).toBe(true)
})

test('verify internal href routes through react router without reloading page', () => {
	renderWithProviders(<Link href={AppRoutes.About}>About</Link>)
	const link = screen.getByRole('link', { name: 'About' })

	expect(link).toHaveAttribute('href', AppRoutes.About)

	fireEvent.click(link)

	expect(screen.getByTestId('route-probe').textContent).toBe(AppRoutes.About)
	expect(window.location.assign).not.toHaveBeenCalled()
})

test('verify external href is left to the browser and does not change route', () => {
	renderWithProviders(<Link href='https://www.paypal.com/donate'>Donate</Link>)
	const link = screen.getByRole('link', { name: 'Donate' })

	expect(link).toHaveAttribute('href', 'https://www.paypal.com/donate')
	expect(screen.getByTestId('route-probe').textContent).toBe(AppRoutes.Home)
})
