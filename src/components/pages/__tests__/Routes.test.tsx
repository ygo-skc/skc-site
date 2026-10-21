import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

// every screen is stubbed so this verifies routing only - the real pages fetch on mount. jest.mock
// factories are hoisted above imports, so each one has to be self contained
jest.mock('../../header-footer/NavigationBar', () => ({ __esModule: true, default: () => <div>nav</div> }))
jest.mock('../../header-footer/Footer', () => ({ __esModule: true, default: () => <div>footer</div> }))
jest.mock('../Home', () => ({ __esModule: true, default: () => <div>home screen</div> }))
jest.mock('../BanList', () => ({ __esModule: true, default: () => <div>ban list screen</div> }))
jest.mock('../ProductBrowse', () => ({ __esModule: true, default: () => <div>product browse screen</div> }))
jest.mock('../ProductInformation', () => ({ __esModule: true, default: () => <div>product information screen</div> }))
jest.mock('../CardsBrowse', () => ({ __esModule: true, default: () => <div>cards browse screen</div> }))
jest.mock('../CardInformation', () => ({ __esModule: true, default: () => <div>card information screen</div> }))
jest.mock('../About', () => ({ __esModule: true, default: () => <div>about screen</div> }))
jest.mock('../Privacy', () => ({ __esModule: true, default: () => <div>privacy screen</div> }))
jest.mock('../HttpErr', () => ({ __esModule: true, default: () => <div>http err screen</div> }))

import routes from '../Routes'
import MuiTheme from '../../MuiTheme'
import AppRoutes from '../../../helper/AppRoutes'

afterEach(() => {
	cleanup()
})

function renderAt(path: string) {
	const router = createMemoryRouter(routes, { initialEntries: [path] })

	return render(
		<ThemeProvider theme={MuiTheme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	)
}

async function expectScreenAt(path: string, screenName: string) {
	renderAt(path)

	expect(await screen.findByText(screenName)).toBeInTheDocument()
	cleanup()
}

test('verify each app path resolves to its screen', async () => {
	await expectScreenAt(AppRoutes.Home, 'home screen')
	await expectScreenAt(AppRoutes.BanList, 'ban list screen')
	await expectScreenAt(`${AppRoutes.BanList}/TCG`, 'ban list screen')
	await expectScreenAt('/card/40044918', 'card information screen')
	await expectScreenAt(AppRoutes.CardBrowse, 'cards browse screen')
	await expectScreenAt(AppRoutes.ProductBrowse, 'product browse screen')
	await expectScreenAt('/product/LOB', 'product information screen')
	await expectScreenAt(AppRoutes.About, 'about screen')
	await expectScreenAt(AppRoutes.Privacy, 'privacy screen')
})

test('verify err paths and unknown paths resolve to the err screen', async () => {
	await expectScreenAt(AppRoutes.BadRequest, 'http err screen')
	await expectScreenAt(AppRoutes.RequestTimeout, 'http err screen')
	await expectScreenAt(AppRoutes.UnprocessableEntity, 'http err screen')
	await expectScreenAt(AppRoutes.GenericServerError, 'http err screen')
	await expectScreenAt(AppRoutes.ServiceUnavailable, 'http err screen')
	await expectScreenAt(AppRoutes.Server404Error, 'http err screen')
	await expectScreenAt('/no-such-page', 'http err screen')
})

test('verify site chrome is rendered around every screen', async () => {
	renderAt(AppRoutes.Home)

	expect(await screen.findByText('nav')).toBeInTheDocument()
	expect(await screen.findByText('footer')).toBeInTheDocument()
	expect(await screen.findByText('home screen')).toBeInTheDocument()
})
