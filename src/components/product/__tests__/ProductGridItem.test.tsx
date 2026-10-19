import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ReactNode } from 'react'

// skc-rcl pulls in the ESM-only nivo chart stack, which jest cannot load, and the product visuals
// are not what these tests are about
jest.mock('skc-rcl', () => ({
	ProductImage: ({ productID }: { productID: string }) => <div>{productID}</div>,
	InlineDate: ({ year }: { year: number }) => <div>{year}</div>,
}))

import ProductGridItem from '../ProductGridItem'
import MuiTheme from '../../MuiTheme'

// jest-location-mock (wired up in setupTests) spies on window.location.assign in a beforeAll hook,
// so call history has to be cleared between tests
beforeEach(() => {
	jest.clearAllMocks()
})

afterEach(() => {
	cleanup()
})

function renderWithProviders(ui: ReactNode) {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={['/']}>
				{ui}
				<Routes>
					<Route path='/' element={<div data-testid='route-probe'>home</div>} />
					<Route path='/product/:productId' element={<div data-testid='route-probe'>product</div>} />
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('verify product grid item navigates to product without reloading page', () => {
	renderWithProviders(<ProductGridItem id='LOB' name='Legend of Blue Eyes White Dragon' type='Pack' subType='Core Set' totalItems={126} releaseDate={new Date('2002-03-08')} />)
	const productLink = screen.getByRole('link')

	expect(productLink).toHaveAttribute('href', '/product/LOB')

	fireEvent.click(productLink)

	expect(screen.getByTestId('route-probe').textContent).toBe('product')
	expect(window.location.assign).not.toHaveBeenCalled()
})
