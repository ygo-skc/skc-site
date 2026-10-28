import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import CardInformation from '../CardInformation'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'
import { readRecentlyViewed, recordCardView } from '../../../helper/RecentlyViewed'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	Section: ({ sectionName, children }: { sectionName: string; children: React.ReactNode }) => <section aria-label={sectionName}>{children}</section>,
	CardImageRounded: () => null,
	YGOCard: () => null,
	Hint: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// the page's lazy sections aren't what these tests are about
jest.mock('../../card/suggestion/CardSuggestions', () => ({ __esModule: true, default: () => null }))
jest.mock('../../card/card-information/CardInformationRelatedContent', () => ({ __esModule: true, default: () => null }))

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
		onSuccess({ cardID: '83461421', cardName: 'Pendulum Storm', cardColor: 'spell', cardEffect: '', foundIn: [], restrictedIn: { TCG: [], MD: [], DL: [] } })
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

	expect(readRecentlyViewed()).toEqual([expect.objectContaining({ kind: 'card', id: '83461421', name: 'Pendulum Storm' })])
})

test('coming back to the card shows it without fetching again, and moves it back to the top of the recents', async () => {
	localStorage.clear()
	const card = { cardID: '83461421', cardName: 'Pendulum Storm', cardColor: 'spell', cardEffect: '', foundIn: [], restrictedIn: { TCG: [], MD: [], DL: [] } }
	const handleFetch = jest.mocked(FetchHandler.handleFetch)
	handleFetch.mockClear()
	// the card answers, suggestions and support fail - every section has settled
	handleFetch.mockImplementation((url, onSuccess) => {
		if (url.includes('83461421?allInfo')) {
			onSuccess(card)
			return Promise.resolve()
		}
		return Promise.reject(new Error('down'))
	})
	const renderCard = () =>
		render(
			<ThemeProvider theme={MuiTheme}>
				<MemoryRouter initialEntries={['/card/83461421']}>
					<Routes>
						<Route path='/card/:cardId' element={<CardInformation />} />
					</Routes>
				</MemoryRouter>
			</ThemeProvider>
		)

	const { unmount } = renderCard()
	await waitFor(() => expect(screen.queryByTestId('card-releases-skeleton')).not.toBeInTheDocument())
	expect(handleFetch).toHaveBeenCalledTimes(3)
	await screen.findByText('Not tied to any archetype')
	unmount()

	// another card is opened, then the reader comes back
	recordCardView({ ...card, cardID: '89631139', cardName: 'Blue-Eyes White Dragon' } as YGOCard.Deets)
	renderCard()

	expect(screen.queryByTestId('card-releases-skeleton')).not.toBeInTheDocument()
	expect(handleFetch).toHaveBeenCalledTimes(3)
	expect(readRecentlyViewed()[0]).toEqual(expect.objectContaining({ id: '83461421' }))
})
