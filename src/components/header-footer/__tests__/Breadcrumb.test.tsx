import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ReactNode } from 'react'

import Breadcrumb from '../Breadcrumb'
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
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('verify breadcrumb navigates to a parent crumb without reloading page', async () => {
	renderWithProviders(<Breadcrumb crumbs={['Home', 'Ban List']} />, AppRoutes.BanList)
	const homeCrumb = await screen.findByRole('link', { name: /Home/ })

	expect(homeCrumb).toHaveAttribute('href', AppRoutes.Home)
	expect(screen.getByTestId('route-probe').textContent).toBe(AppRoutes.BanList)

	fireEvent.click(homeCrumb)

	expect(screen.getByTestId('route-probe').textContent).toBe(AppRoutes.Home)
	expect(window.location.assign).not.toHaveBeenCalled()
})

test('verify breadcrumb leaves the current page unlinked', async () => {
	renderWithProviders(<Breadcrumb crumbs={['Home', 'Ban List']} />, AppRoutes.BanList)
	await screen.findByRole('link', { name: /Home/ })

	expect(screen.queryByRole('link', { name: /Ban List/ })).not.toBeInTheDocument()
})
