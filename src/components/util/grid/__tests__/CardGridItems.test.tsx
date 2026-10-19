import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ReactNode } from 'react'

// skc-rcl pulls in the ESM-only nivo chart stack, which jest cannot load, and the card visuals
// are not what these tests are about
jest.mock('skc-rcl', () => ({
	YGOCardWithImage: ({ card }: { card: { cardName: string } }) => <div>{card.cardName}</div>,
}))

import CardGridItems from '../CardGridItems'
import MuiTheme from '../../../MuiTheme'

const stratos: YGOCard.Deets = {
	cardID: '40044918',
	cardName: 'Elemental HERO Stratos',
	cardColor: 'effect',
	cardEffect: 'When this card is Normal or Special Summoned: You can activate 1 of these effects.',
	monsterType: 'Warrior/Effect',
}

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
					<Route path='/card/:cardId' element={<div data-testid='route-probe'>card</div>} />
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('verify card grid item navigates to card without reloading page', async () => {
	renderWithProviders(<CardGridItems cards={[stratos]} />)
	const cardLink = await screen.findByRole('link')

	expect(cardLink).toHaveAttribute('href', `/card/${stratos.cardID}`)

	fireEvent.click(cardLink)

	expect(screen.getByTestId('route-probe').textContent).toBe('card')
	expect(window.location.assign).not.toHaveBeenCalled()
})
