import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import ProductBrowse from '../ProductBrowse'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	Section: ({ sectionName, children }: { sectionName: string; children: React.ReactNode }) => <section aria-label={sectionName}>{children}</section>,
}))

// the products request never answers, so the page stays in its loading state
jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(() => new Promise(() => {}))

test('holds the product grid with tile skeletons while products load', async () => {
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<ProductBrowse />
			</MemoryRouter>
		</ThemeProvider>
	)

	const skeleton = await screen.findByTestId('product-browse-skeleton')
	expect(skeleton).toHaveAttribute('aria-hidden', 'true')
	expect(skeleton.querySelectorAll('.product-grid-item-parent')).toHaveLength(6)
})
