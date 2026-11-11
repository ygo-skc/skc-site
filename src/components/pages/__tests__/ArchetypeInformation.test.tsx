import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import ArchetypeInformation from '../ArchetypeInformation'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	CardImageRounded: () => null,
	YGOCardColorIndicator: () => null,
	YGOCardWithImage: ({ card }: { card: YGOCard.Deets }) => <span data-testid='grid-card'>{card.cardName}</span>,
	YGOCardPreview: ({ card }: { card: YGOCard.Deets }) => <div data-testid='preview'>{card.cardName}</div>,
}))

const monster = (cardID: string, cardName: string, cardColor: string, cardAttribute: string, monsterType: string, monsterAttack: number, monsterDefense?: number) =>
	({ cardID, cardName, cardColor, cardAttribute, cardEffect: `${cardName} effect`, monsterType, monsterAttack, monsterDefense } as unknown as YGOCard.Deets)

// the shape the suggestion engine answers with - capitalised frames, numeric stats
const hero: YGOArchetype.Data = {
	archetype: 'HERO',
	inheritMembers: [
		monster('89943723', 'Elemental HERO Neos', 'Normal', 'Light', 'Warrior/Normal', 2500, 2000),
		monster('40044918', 'Elemental HERO Stratos', 'Effect', 'Wind', 'Warrior/Effect', 1800, 300),
		monster('90050480', 'Elemental HERO Cosmo Neos', 'Fusion', 'Light', 'Warrior/Fusion/Effect', 3500, 3000),
		{ cardID: '21143940', cardName: 'Mask Change', cardColor: 'Spell' as YGOCard.Color, cardAttribute: 'Spell', cardEffect: 'Target 1 "HERO" monster you control' },
	],
	qualifiedMembers: [monster('24103628', 'Phantom Magician', 'Effect', 'Dark', 'Spellcaster/Effect', 600, 700)],
	excludedMembers: [],
}

function renderPage() {
	const router = createMemoryRouter(
		[
			{ path: '/archetype/:archetypeName', element: <ArchetypeInformation /> },
			{ path: '/card/:cardId', element: <p>Card</p> },
		],
		{ initialEntries: ['/archetype/HERO'] }
	)
	render(
		<ThemeProvider theme={MuiTheme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	)
	return router
}

beforeEach(() => {
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation((url, onSuccess) => {
		if (url.endsWith('/suggestions/archetype/HERO')) onSuccess(hero)
		return Promise.resolve()
	})
})

afterEach(() => jest.restoreAllMocks())

test('the totals count the qualified members too', async () => {
	renderPage()

	const totals = await screen.findByRole('list', { name: 'Totals' })
	expect(
		within(totals)
			.getAllByRole('listitem')
			.map((item) => item.textContent)
	).toEqual(['5cards', '4monsters', '1Spells & Traps'])
	expect(screen.getByRole('heading', { level: 1, name: 'HERO' })).toBeInTheDocument()
})

test('the stat sheets and the highest ATK, each row linking to its card', async () => {
	renderPage()

	const attribute = await screen.findByRole('region', { name: 'Attribute' })
	expect(
		within(attribute)
			.getAllByRole('listitem')
			.map((item) => item.textContent)
	).toEqual(['Light2', 'Dark1', 'Wind1'])

	const highest = screen.getByRole('region', { name: 'Highest ATK' })
	expect(within(highest).getAllByRole('link')[0]).toHaveAttribute('href', '/card/90050480')
	expect(within(highest).getAllByRole('link')[0]).toHaveTextContent('Elemental HERO Cosmo Neos')
})

test('members are the cards named after it - qualified cards get their own column, and an empty one is left out', async () => {
	renderPage()

	const members = await screen.findByRole('region', { name: 'Members' })
	expect(within(members).getByText('4 cards')).toBeInTheDocument()
	// the header's 5 cards include the qualified one, so the count points to it
	expect(within(members).getByText('· 1 more under Not by name')).toBeInTheDocument()
	expect(within(members).queryByText('Phantom Magician')).not.toBeInTheDocument()

	const notByName = screen.getByRole('region', { name: 'Not by name' })
	expect(within(notByName).getByRole('region', { name: 'Also members' })).toHaveTextContent('Phantom Magician')
	expect(within(notByName).queryByRole('region', { name: 'Not members' })).not.toBeInTheDocument()
})

test('searching the members matches names and effects', async () => {
	renderPage()

	const members = await screen.findByRole('region', { name: 'Members' })
	fireEvent.change(within(members).getByRole('searchbox', { name: 'Search members' }), { target: { value: 'target 1' } })

	expect(within(members).getByText('1 of 4 cards')).toBeInTheDocument()
	expect(within(members).getByRole('button', { name: /Mask Change/ })).toBeInTheDocument()
})

test('going back shows the page as it was left, without fetching again', async () => {
	const router = renderPage()
	const members = await screen.findByRole('region', { name: 'Members' })
	fireEvent.click(within(members).getByRole('button', { name: 'Grid' }))

	await act(() => router.navigate('/card/90050480'))
	const fetches = jest.mocked(FetchHandler.handleFetch).mock.calls.length
	await act(() => router.navigate(-1))

	expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true')
	expect(screen.getAllByTestId('grid-card')).toHaveLength(4)
	expect(FetchHandler.handleFetch).toHaveBeenCalledTimes(fetches)
})
