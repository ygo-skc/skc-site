import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import ProductLatestRelease from '../ProductLatestRelease'
import MuiTheme from '../../MuiTheme'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	ProductImage: ({ productID }: { productID: string }) => <img alt={`Product - ${productID}`} />,
}))

const product = (productId: string, productReleaseDate: string) =>
	({ productId, productReleaseDate, productName: `${productId} name`, productType: 'Pack', productSubType: 'Core Set', productTotal: 101, productLocale: 'en' } as YGOProduct.Info)

const renderLatest = (products: YGOProduct.Info[], isLoading = false) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<ProductLatestRelease products={products} isLoading={isLoading} />
			</MemoryRouter>
		</ThemeProvider>
	)

beforeEach(() => {
	jest.useFakeTimers({ now: new Date(2026, 9, 23) })
})

afterEach(() => {
	jest.useRealTimers()
})

test('calls out the newest product that is already out, skipping upcoming ones', () => {
	renderLatest([product('OLD', '2026-05-08'), product('NEW', '2026-09-04'), product('SOON', '2026-11-13')])

	expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('NEW name')
	expect(screen.getByText('Latest release ·', { exact: false })).toHaveTextContent('Latest release · Sep 4, 2026')
	expect(screen.getByText('NEW · 101 cards · out for 49 days')).toBeInTheDocument()
	expect(screen.getByRole('link', { name: 'View product' })).toHaveAttribute('href', '/product/NEW')
})

test('says a product released today is out today', () => {
	renderLatest([product('TODAY', '2026-10-23')])

	expect(screen.getByText('TODAY · 101 cards · out today')).toBeInTheDocument()
})

test('holds its place with a skeleton while products load, and hides with nothing released', () => {
	const { rerender } = renderLatest([], true)
	expect(screen.getByTestId('product-latest-release-skeleton')).toHaveAttribute('aria-hidden', 'true')

	rerender(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<ProductLatestRelease products={[product('SOON', '2026-11-13')]} isLoading={false} />
			</MemoryRouter>
		</ThemeProvider>
	)
	expect(screen.queryByRole('heading')).not.toBeInTheDocument()
})
