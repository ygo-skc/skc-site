import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
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

test('verify breadcrumb is a labelled landmark listing each crumb in order', async () => {
	renderWithProviders(<Breadcrumb crumbs={['Home', 'Card Browse', 'Blue-Eyes White Dragon']} />)

	const trail = screen.getByRole('navigation', { name: 'Breadcrumb' })
	const crumbs = within(trail).getAllByRole('listitem')
	expect(crumbs.map((crumb) => crumb.textContent)).toEqual(['Home', 'Card Browse', 'Blue-Eyes White Dragon'])
})

test('verify breadcrumb links every parent crumb to its page', async () => {
	renderWithProviders(<Breadcrumb crumbs={['Home', 'Product Browse', 'LOB']} />)

	expect(await screen.findByRole('link', { name: 'Home' })).toHaveAttribute('href', AppRoutes.Home)
	expect(screen.getByRole('link', { name: 'Product Browse' })).toHaveAttribute('href', AppRoutes.ProductBrowse)
})

test('verify breadcrumb marks the last crumb as the current page', async () => {
	renderWithProviders(<Breadcrumb crumbs={['Home', 'Ban List']} />, AppRoutes.BanList)

	expect(screen.getByText('Ban List')).toHaveAttribute('aria-current', 'page')
	expect(screen.getByText('Home')).not.toHaveAttribute('aria-current')
})

test('verify breadcrumb keeps parent crumbs while the current page name is loading', async () => {
	renderWithProviders(<Breadcrumb crumbs={['Home', 'Card Browse', '']} />)

	expect(await screen.findByRole('link', { name: 'Card Browse' })).toBeInTheDocument()
	expect(document.querySelector('[aria-current="page"]')).toBeNull()
})
