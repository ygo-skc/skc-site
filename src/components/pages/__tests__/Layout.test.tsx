import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

// the chrome fetches versions and messages on mount, which is not what these tests are about
jest.mock('../../header-footer/NavigationBar', () => ({
	__esModule: true,
	default: () => <nav>nav bar</nav>,
}))
jest.mock('../../header-footer/Footer', () => ({
	__esModule: true,
	default: () => <footer>footer</footer>,
}))

import Layout from '../Layout'
import MuiTheme from '../../MuiTheme'
import AppRoutes from '../../../helper/AppRoutes'

afterEach(() => {
	cleanup()
})

function renderLayout(initialPath = AppRoutes.Home) {
	const router = createMemoryRouter([{ element: <Layout />, children: [{ path: AppRoutes.Home, element: <div>screen content</div> }] }], { initialEntries: [initialPath] })

	return render(
		<ThemeProvider theme={MuiTheme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	)
}

test('verify layout renders site chrome around the matched route', async () => {
	renderLayout()

	expect(await screen.findByText('nav bar')).toBeInTheDocument()
	expect(await screen.findByText('footer')).toBeInTheDocument()
	expect(screen.getByText('screen content')).toBeInTheDocument()
})

// ScrollRestoration calls useMatches, which throws outside a data router - rendering the layout at
// all proves we are on createBrowserRouter and not the declarative BrowserRouter
test('verify layout renders inside a data router so scroll restoration is supported', async () => {
	expect(() => renderLayout()).not.toThrow()

	expect(await screen.findByText('nav bar')).toBeInTheDocument()
})
