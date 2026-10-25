import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import CardInformation from '../CardInformation'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'
import { readRecentlyViewed } from '../../../helper/RecentlyViewed'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	Section: ({ sectionName, children }: { sectionName: string; children: React.ReactNode }) => <section aria-label={sectionName}>{children}</section>,
	CardImageRounded: () => null,
	YGOCard: () => null,
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

test('remembers the card as recently viewed once it loads', () => {
	localStorage.clear()
	jest.mocked(FetchHandler.handleFetch).mockImplementationOnce((_url, onSuccess) => {
		onSuccess({ cardID: '83461421', cardName: 'Mist Valley Falcon', cardColor: 'effect', cardEffect: '', foundIn: [], restrictedIn: { TCG: [], MD: [], DL: [] } })
		return new Promise(() => {})
	})

	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={['/card/83461421']}>
				<Routes>
					<Route path='/card/:cardId' element={<CardInformation />} />
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	)

	expect(readRecentlyViewed()).toEqual([expect.objectContaining({ kind: 'card', id: '83461421', name: 'Mist Valley Falcon', cardColor: 'effect' })])
})
