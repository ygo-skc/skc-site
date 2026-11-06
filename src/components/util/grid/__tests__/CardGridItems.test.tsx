import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ReactNode } from 'react'

// skc-rcl pulls in the ESM-only nivo chart stack, which jest cannot load, and the card visuals
// are not what these tests are about
jest.mock('skc-rcl', () => ({
	YGOCardWithImage: ({ card }: { card: { cardName: string; cardEffect: string } }) => (
		<div>
			{card.cardName}
			<p data-testid='effect'>{card.cardEffect}</p>
		</div>
	),
}))

// jest maps entities to a pass-through mock - this decodes one level, so decoding twice would show
jest.mock('entities', () => ({ decodeHTML: (text: string) => text.replace(/&(amp|lt|gt);/g, (_, name: 'amp' | 'lt' | 'gt') => ({ amp: '&', lt: '<', gt: '>' }[name])) }))

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

test('verify the effect is decoded once, without changing the cards it was given', () => {
	// the api double encodes text the effect means literally
	const card = { ...stratos, cardEffect: 'Tribute 1 &amp;lt;Fiend&amp;gt; monster' }
	const { rerender } = renderWithProviders(<CardGridItems cards={[card]} />)
	rerender(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={['/']}>
				<CardGridItems cards={[card]} />
			</MemoryRouter>
		</ThemeProvider>
	)

	expect(screen.getByTestId('effect')).toHaveTextContent('Tribute 1 &lt;Fiend&gt; monster')
	expect(card.cardEffect).toBe('Tribute 1 &amp;lt;Fiend&amp;gt; monster')
})
