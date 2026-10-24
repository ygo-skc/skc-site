import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import CardInformation from '../CardInformation'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	Section: ({ sectionName, children }: { sectionName: string; children: React.ReactNode }) => <section aria-label={sectionName}>{children}</section>,
	CardImageRounded: () => null,
}))

// the page's requests never answer, so it stays in its loading state
jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(() => new Promise(() => {}))

test('holds the releases with a skeleton instead of a zero count while the card loads', () => {
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={['/card/83461421']}>
				<Routes>
					<Route path='/card/:cardId' element={<CardInformation />} />
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	)

	expect(screen.getByText('Releases')).toBeInTheDocument()
	expect(screen.getByTestId('card-releases-skeleton')).toHaveAttribute('aria-hidden', 'true')
	expect(screen.queryByText(/unique rarit/)).not.toBeInTheDocument()
})
