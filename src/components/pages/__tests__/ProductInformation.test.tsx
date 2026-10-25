import { render, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import ProductInformation from '../ProductInformation'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'
import { readRecentlyViewed } from '../../../helper/RecentlyViewed'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	Section: ({ sectionName, children }: { sectionName: string; children: React.ReactNode }) => <section aria-label={sectionName}>{children}</section>,
	ProductImage: () => null,
	SKCTable: () => null,
	Hint: () => null,
	Pie: () => null,
}))

test('remembers the product as recently viewed once it loads', async () => {
	localStorage.clear()
	// the product answers, the suggestions never do
	jest
		.spyOn(FetchHandler, 'handleFetch')
		.mockImplementationOnce((_url, onSuccess) => {
			onSuccess({
				productId: 'PHNI',
				productLocale: 'EN',
				productName: 'Phantom Nightmare',
				productType: 'Pack',
				productSubType: 'Core Set',
				productReleaseDate: '2024-02-09',
				productTotal: 100,
				productRarityStats: {},
				productContent: [],
			})
			return new Promise(() => {})
		})
		.mockImplementation(() => new Promise(() => {}))

	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={['/product/PHNI']}>
				<Routes>
					<Route path='/product/:productId' element={<ProductInformation />} />
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	)

	// the page waits on its lazy pieces before it asks for the product
	await waitFor(() =>
		expect(readRecentlyViewed()).toEqual([expect.objectContaining({ kind: 'product', id: 'PHNI', name: 'Phantom Nightmare', productType: 'Pack', productSubType: 'Core Set' })])
	)
})
