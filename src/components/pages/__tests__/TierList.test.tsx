import { ReactNode } from 'react'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

jest.mock('skc-rcl', () => ({
	YGOCardWithImage: ({ card }: { card: YGOCard.Deets }) => <span data-testid='rcl-card'>{card.cardName}</span>,
	CardImageRounded: ({ cardID }: { cardID: string }) => <img data-testid='card-image' data-card-image={cardID} alt='' />,
}))

// dnd-kit needs what jsdom doesn't have (real layout, PointerEvent, a matching AbortSignal), so these capture the page's handlers and tests call them
type Drag = { canceled?: boolean; preventDefault?: () => void; operation: { source: object | null; target: object | null } }
const mockDragHandlers: { onDragStart?: () => void; onDragOver?: (event: Drag) => void; onDragEnd?: (event: Drag) => void } = {}
// each mount is a new dnd-kit manager
const mockProviderMounts = { count: 0 }

jest.mock('@dnd-kit/react', () => ({
	DragDropProvider: ({ children, ...handlers }: { children: ReactNode }) => {
		Object.assign(mockDragHandlers, handlers)
		jest.requireActual('react').useEffect(() => {
			mockProviderMounts.count++
		}, [])
		return children
	},
	DragOverlay: () => null,
	useDraggable: () => ({ ref: () => {}, isDragging: false }),
	useDroppable: () => ({ ref: () => {} }),
}))
jest.mock('@dnd-kit/react/sortable', () => ({
	useSortable: () => ({ ref: () => {}, isDragging: false }),
	isSortable: (entity?: { sortable?: object }) => Boolean(entity?.sortable),
}))
jest.mock('@dnd-kit/dom', () => ({
	PointerSensor: { configure: () => ({}) },
	PointerActivationConstraints: { Delay: class {}, Distance: class {} },
}))

import TierList from '../TierList'
import MuiTheme from '../../MuiTheme'
import { TIER_LIST_KEY } from '../../../helper/TierListStorage'

const card = (id: string, name: string, cardColor: YGOCard.Color = 'normal'): YGOCard.Deets => ({ cardID: id, cardName: name, cardColor, cardEffect: '' })
const blueEyes = card('89631139', 'Blue-Eyes White Dragon')
const redEyes = card('74677422', 'Red-Eyes Black Dragon')
const ravine = card('62265044', 'Dragon Ravine', 'spell')

// a window whose width can change mid test - media queries re-evaluate and notify their listeners like a real resize
let isPhoneWidth = false
const mediaListeners = new Set<() => void>()

function mockPhone(isPhone: boolean) {
	isPhoneWidth = isPhone
	window.matchMedia = jest.fn().mockImplementation((query: string) => ({
		get matches() {
			return isPhoneWidth && query.includes('max-width')
		},
		media: query,
		addEventListener: (_type: string, listener: () => void) => mediaListeners.add(listener),
		removeEventListener: (_type: string, listener: () => void) => mediaListeners.delete(listener),
		addListener: (listener: () => void) => mediaListeners.add(listener),
		removeListener: (listener: () => void) => mediaListeners.delete(listener),
	}))
}

function save(list: object) {
	localStorage.setItem(TIER_LIST_KEY, JSON.stringify(list))
}

const saved = () => JSON.parse(localStorage.getItem(TIER_LIST_KEY) as string)

function renderPage() {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<TierList />
			</MemoryRouter>
		</ThemeProvider>
	)
}

beforeEach(() => {
	localStorage.clear()
	mockPhone(false)
})

test('opens with the saved list', () => {
	save({ name: 'Coolest dragons', tray: [ravine], tiers: { S: [blueEyes], A: [redEyes] } })
	renderPage()

	expect(screen.getByRole('textbox', { name: 'List name' })).toHaveValue('Coolest dragons')
	expect(screen.getAllByRole('region', { name: / tier$/ }).map((tier) => tier.getAttribute('aria-label'))).toEqual(['S tier', 'A tier', 'B tier', 'C tier', 'D tier', 'F tier'])
	expect(within(screen.getByRole('region', { name: 'S tier' })).getByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).toBeInTheDocument()
	expect(within(screen.getByRole('region', { name: 'A tier' })).getByRole('button', { name: 'Rank Red-Eyes Black Dragon' })).toBeInTheDocument()
	expect(within(screen.getByRole('region', { name: 'Tray' })).getByText('Dragon Ravine')).toBeInTheDocument()
})

test('tiers show only the card art', () => {
	save({ name: 'x', tray: [], tiers: { S: [blueEyes], A: [redEyes] } })
	renderPage()

	expect(screen.queryByTestId('rcl-card')).not.toBeInTheDocument()
	expect(screen.getAllByTestId('card-image').map((img) => img.getAttribute('data-card-image'))).toEqual([blueEyes.cardID, redEyes.cardID])
})

test('the name field has a visible label and shows the default name while empty', () => {
	renderPage()
	const field = screen.getByLabelText('List name')

	expect(field).toHaveRole('textbox')
	fireEvent.change(field, { target: { value: '' } })
	expect(field).toHaveAttribute('placeholder', 'Untitled tier list')
})

test("the page's heading is for screen readers only - the name field leads the column", () => {
	renderPage()
	expect(screen.getByRole('heading', { level: 1, name: 'Tier list' })).toHaveClass('visually-hidden')
})

test('has a breadcrumb from Home', () => {
	renderPage()
	const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' })

	expect(within(crumbs).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
	expect(within(crumbs).getByText('Tier List')).toBeInTheDocument()
})

test('renames the list', () => {
	renderPage()
	fireEvent.change(screen.getByRole('textbox', { name: 'List name' }), { target: { value: 'Best hand traps' } })

	expect(saved().name).toBe('Best hand traps')
})

test('keyboard: pick a tray card and give it a tier', () => {
	save({ name: 'x', tray: [ravine], tiers: {} })
	renderPage()

	fireEvent.click(screen.getByRole('button', { name: 'Rank Dragon Ravine' }))
	const picker = screen.getByRole('group', { name: 'Move Dragon Ravine to' })
	fireEvent.click(within(picker).getByRole('button', { name: 'A' }))

	expect(within(screen.getByRole('region', { name: 'A tier' })).getByRole('button', { name: 'Rank Dragon Ravine' })).toBeInTheDocument()
	expect(screen.queryByRole('group', { name: 'Move Dragon Ravine to' })).not.toBeInTheDocument()
	expect(saved().tiers.A[0].cardID).toBe(ravine.cardID)
})

test('a ranked card can go back to the tray', () => {
	save({ name: 'x', tray: [], tiers: { S: [blueEyes] } })
	renderPage()

	fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))
	expect(within(screen.getByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).getByRole('button', { name: 'S' })).toHaveAttribute('aria-pressed', 'true')
	fireEvent.click(screen.getByRole('button', { name: 'Back to tray' }))

	expect(within(screen.getByRole('region', { name: 'Tray' })).getByText('Blue-Eyes White Dragon')).toBeInTheDocument()
})

test('removes a card from the tray', () => {
	save({ name: 'x', tray: [ravine], tiers: {} })
	renderPage()

	fireEvent.click(screen.getByRole('button', { name: 'Remove Dragon Ravine from tray' }))
	expect(screen.queryByText('Dragon Ravine')).not.toBeInTheDocument()
	expect(saved().tray).toEqual([])
})

test('desktop: Start over sits by the name, above the search', () => {
	renderPage()
	const startOver = screen.getByRole('button', { name: 'Start over' })

	expect(startOver.compareDocumentPosition(screen.getByRole('combobox')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
	expect(screen.getByLabelText('List name').compareDocumentPosition(startOver) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test.each([false, true])('the how-to sits in the tray, above its cards (phone: %s)', (isPhone) => {
	mockPhone(isPhone)
	save({ name: 'x', tray: [ravine], tiers: {} })
	renderPage()
	const tray = screen.getByRole('region', { name: 'Tray' })
	const hint = within(tray).getByText(/Your list stays on this device until you start over\./)

	expect(hint.compareDocumentPosition(within(tray).getByRole('button', { name: 'Rank Dragon Ravine' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test.each([false, true])('the tray is in A–Z order (phone: %s)', (isPhone) => {
	mockPhone(isPhone)
	save({ name: 'x', tray: [redEyes, ravine, blueEyes], tiers: {} })
	renderPage()

	expect(
		within(screen.getByRole('region', { name: 'Tray' }))
			.getAllByRole('button', { name: /^Rank / })
			.map((button) => button.getAttribute('aria-label'))
	).toEqual(['Rank Blue-Eyes White Dragon', 'Rank Dragon Ravine', 'Rank Red-Eyes Black Dragon'])
})

describe('tray filter', () => {
	const mirrorForce = card('44095762', 'Mirror Force', 'trap')
	const trayNames = () =>
		within(screen.getByRole('region', { name: 'Tray' }))
			.queryAllByRole('button', { name: /^Rank / })
			.map((button) => button.getAttribute('aria-label'))

	test.each([false, true])('shows only monsters, spells or traps (phone: %s)', (isPhone) => {
		mockPhone(isPhone)
		save({ name: 'x', tray: [ravine, blueEyes, mirrorForce, redEyes], tiers: {} })
		renderPage()
		const filter = screen.getByRole('group', { name: 'Show in tray' })

		expect(trayNames()).toHaveLength(4)
		fireEvent.click(within(filter).getByRole('button', { name: 'Monster' }))
		expect(trayNames()).toEqual(['Rank Blue-Eyes White Dragon', 'Rank Red-Eyes Black Dragon'])
		fireEvent.click(within(filter).getByRole('button', { name: 'Spell' }))
		expect(trayNames()).toEqual(['Rank Dragon Ravine'])
		fireEvent.click(within(filter).getByRole('button', { name: 'Trap' }))
		expect(trayNames()).toEqual(['Rank Mirror Force'])
		fireEvent.click(within(filter).getByRole('button', { name: 'All' }))
		expect(trayNames()).toHaveLength(4)
	})

	test("matches the API's capitalised colours", () => {
		save({
			name: 'x',
			tray: [
				{ ...ravine, cardColor: 'Spell' },
				{ ...mirrorForce, cardColor: 'Trap' },
				{ ...blueEyes, cardColor: 'Normal' },
			],
			tiers: {},
		})
		renderPage()

		fireEvent.click(within(screen.getByRole('group', { name: 'Show in tray' })).getByRole('button', { name: 'Spell' }))
		expect(trayNames()).toEqual(['Rank Dragon Ravine'])
		fireEvent.click(within(screen.getByRole('group', { name: 'Show in tray' })).getByRole('button', { name: 'Trap' }))
		expect(trayNames()).toEqual(['Rank Mirror Force'])
	})

	test('says when nothing in the tray matches', () => {
		save({ name: 'x', tray: [blueEyes], tiers: {} })
		renderPage()

		fireEvent.click(within(screen.getByRole('group', { name: 'Show in tray' })).getByRole('button', { name: 'Trap' }))
		const tray = within(screen.getByRole('region', { name: 'Tray' }))
		expect(tray.getByText('No traps')).toBeInTheDocument()
		expect(tray.getByText("The tray's 1 card is under another type.")).toBeInTheDocument()
	})

	test('Show all goes back to every card and keeps focus on the filter', () => {
		save({ name: 'x', tray: [blueEyes, redEyes], tiers: {} })
		renderPage()
		const filters = within(screen.getByRole('group', { name: 'Show in tray' }))

		fireEvent.click(filters.getByRole('button', { name: 'Trap' }))
		expect(screen.getByText("The tray's 2 cards are under other types.")).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Show all 2' }))

		expect(trayNames()).toEqual(['Rank Blue-Eyes White Dragon', 'Rank Red-Eyes Black Dragon'])
		expect(filters.getByRole('button', { name: 'All' })).toHaveFocus()
	})

	test('is hidden while the tray is empty', () => {
		renderPage()
		expect(screen.queryByRole('group', { name: 'Show in tray' })).not.toBeInTheDocument()
	})

	test('going back keeps the filter', () => {
		save({ name: 'x', tray: [ravine, blueEyes], tiers: {} })
		const { unmount } = renderPage()
		fireEvent.click(within(screen.getByRole('group', { name: 'Show in tray' })).getByRole('button', { name: 'Spell' }))
		unmount()

		renderPage()
		expect(within(screen.getByRole('group', { name: 'Show in tray' })).getByRole('button', { name: 'Spell' })).toHaveAttribute('aria-pressed', 'true')
		expect(trayNames()).toEqual(['Rank Dragon Ravine'])
	})
})

test('Start over asks first', async () => {
	save({ name: 'Coolest dragons', tray: [ravine], tiers: { S: [blueEyes] } })
	renderPage()

	fireEvent.click(screen.getByRole('button', { name: 'Start over' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }))
	await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
	expect(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).toBeInTheDocument()

	fireEvent.click(screen.getByRole('button', { name: 'Start over' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Start over' }))
	await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
	expect(screen.queryByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).not.toBeInTheDocument()
	expect(screen.getByRole('textbox', { name: 'List name' })).toHaveValue('Untitled tier list')
})

test('removing a tray card moves focus to the next card and announces it', () => {
	save({ name: 'x', tray: [blueEyes, ravine, redEyes], tiers: {} })
	renderPage()

	fireEvent.click(screen.getByRole('button', { name: 'Remove Dragon Ravine from tray' }))
	expect(screen.getByRole('button', { name: 'Rank Red-Eyes Black Dragon' })).toHaveFocus()
	expect(screen.getByText('Dragon Ravine removed')).toHaveAttribute('role', 'status')

	fireEvent.click(screen.getByRole('button', { name: 'Remove Red-Eyes Black Dragon from tray' }))
	expect(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).toHaveFocus()

	fireEvent.click(screen.getByRole('button', { name: 'Remove Blue-Eyes White Dragon from tray' }))
	expect(screen.getByRole('combobox')).toHaveFocus()
})

test('removing the last card from the expanded board moves focus to the collapse button', () => {
	save({ name: 'x', tray: [], tiers: { S: [blueEyes] } })
	renderPage()
	fireEvent.click(screen.getByRole('button', { name: 'Expand tier list' }))

	fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))
	fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
	expect(screen.getByRole('button', { name: 'Collapse tier list' })).toHaveFocus()
})

describe('dragging', () => {
	const tierCard = (id: string, group: string, index: number) => ({ id, sortable: { group, index } })
	const namesIn = (tier: string) => saved().tiers[tier].map((c: YGOCard.Deets) => c.cardName)

	test('a drag puts down the picked card', () => {
		save({ name: 'x', tray: [], tiers: { S: [blueEyes, redEyes] } })
		renderPage()
		fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))

		act(() => mockDragHandlers.onDragStart?.())
		expect(screen.queryByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).not.toBeInTheDocument()
	})

	test('cards only shuffle within their tier', () => {
		save({ name: 'x', tray: [ravine], tiers: { S: [blueEyes], A: [redEyes] } })
		renderPage()
		const over = (source: object, target: object) => {
			const preventDefault = jest.fn()
			act(() => mockDragHandlers.onDragOver?.({ preventDefault, operation: { source, target } }))
			return preventDefault
		}

		expect(over(tierCard(blueEyes.cardID, 'S', 0), tierCard('other', 'S', 1))).not.toHaveBeenCalled()
		expect(over(tierCard(blueEyes.cardID, 'S', 0), tierCard(redEyes.cardID, 'A', 0))).toHaveBeenCalled()
		expect(over({ id: ravine.cardID }, tierCard(redEyes.cardID, 'A', 0))).toHaveBeenCalled()
	})

	test('over another tier, the card shows there before the drop, and the drop keeps it', () => {
		save({ name: 'x', tray: [ravine], tiers: { S: [blueEyes], A: [redEyes] } })
		renderPage()
		const cardsIn = (tier: string) =>
			within(screen.getByRole('region', { name: `${tier} tier` }))
				.queryAllByRole('button')
				.map((b) => b.getAttribute('aria-label'))

		act(() => mockDragHandlers.onDragStart?.())
		act(() => mockDragHandlers.onDragOver?.({ preventDefault: jest.fn(), operation: { source: { id: ravine.cardID }, target: tierCard(redEyes.cardID, 'A', 0) } }))
		expect(cardsIn('A')).toEqual(['Rank Dragon Ravine', 'Rank Red-Eyes Black Dragon'])
		expect(screen.queryByRole('button', { name: 'Remove Dragon Ravine from tray' })).not.toBeInTheDocument()
		// nothing is saved until the drop
		expect(saved().tray).toHaveLength(1)

		act(() => mockDragHandlers.onDragOver?.({ preventDefault: jest.fn(), operation: { source: tierCard(blueEyes.cardID, 'S', 0), target: { id: 'place:A' } } }))
		expect(cardsIn('A')).toEqual(['Rank Dragon Ravine', 'Rank Red-Eyes Black Dragon', 'Rank Blue-Eyes White Dragon'])
		expect(cardsIn('S')).toEqual([])

		act(() => mockDragHandlers.onDragEnd?.({ operation: { source: tierCard(blueEyes.cardID, 'A', 2), target: tierCard(blueEyes.cardID, 'A', 2) } }))
		expect(namesIn('A')).toEqual([redEyes.cardName, blueEyes.cardName])
		expect(saved().tray.map((c: YGOCard.Deets) => c.cardName)).toEqual([ravine.cardName])
	})

	test('a cancelled drag puts the previewed card back', () => {
		save({ name: 'x', tray: [], tiers: { S: [blueEyes], A: [redEyes] } })
		renderPage()

		act(() => mockDragHandlers.onDragOver?.({ preventDefault: jest.fn(), operation: { source: tierCard(blueEyes.cardID, 'S', 0), target: tierCard(redEyes.cardID, 'A', 0) } }))
		expect(within(screen.getByRole('region', { name: 'A tier' })).getAllByRole('button')).toHaveLength(2)

		act(() => mockDragHandlers.onDragEnd?.({ canceled: true, operation: { source: tierCard(blueEyes.cardID, 'A', 0), target: null } }))
		expect(within(screen.getByRole('region', { name: 'S tier' })).getByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).toBeInTheDocument()
		expect(namesIn('S')).toEqual([blueEyes.cardName])
	})

	test('each layout gets its own drag manager, so drags still start after a trip to phone width', () => {
		save({ name: 'x', tray: [ravine], tiers: {} })
		renderPage()
		const resizeTo = (isPhone: boolean) =>
			act(() => {
				isPhoneWidth = isPhone
				mediaListeners.forEach((listener) => listener())
			})
		const mounts = mockProviderMounts.count

		resizeTo(true)
		resizeTo(false)
		expect(mockProviderMounts.count).toBe(mounts + 2)
	})

	test('dropped over itself, a card lands where it was shuffled to', () => {
		save({ name: 'x', tray: [], tiers: { S: [blueEyes, redEyes] } })
		renderPage()

		const source = tierCard(blueEyes.cardID, 'S', 1)
		act(() => mockDragHandlers.onDragEnd?.({ operation: { source, target: source } }))
		expect(namesIn('S')).toEqual([redEyes.cardName, blueEyes.cardName])
	})

	test('dropped over a card in another tier, it takes that spot', () => {
		save({ name: 'x', tray: [ravine], tiers: { A: [redEyes] } })
		renderPage()

		act(() => mockDragHandlers.onDragEnd?.({ operation: { source: { id: ravine.cardID }, target: tierCard(redEyes.cardID, 'A', 0) } }))
		expect(namesIn('A')).toEqual([ravine.cardName, redEyes.cardName])
		expect(saved().tray).toEqual([])
	})

	test('a cancelled drag moves nothing, and a tray card dropped on nothing stays', () => {
		save({ name: 'x', tray: [ravine], tiers: { A: [redEyes] } })
		renderPage()

		act(() => mockDragHandlers.onDragEnd?.({ canceled: true, operation: { source: { id: ravine.cardID }, target: { id: 'place:A' } } }))
		act(() => mockDragHandlers.onDragEnd?.({ operation: { source: { id: ravine.cardID }, target: null } }))
		expect(saved().tray.map((c: YGOCard.Deets) => c.cardName)).toEqual([ravine.cardName])
	})
})

test('empty board points at the search', () => {
	renderPage()
	expect(screen.getByText('Search for a card to start your list.')).toBeInTheDocument()
})

describe('phones', () => {
	beforeEach(() => mockPhone(true))

	test('empty tiers do not talk about dropping cards', () => {
		renderPage()
		expect(screen.getAllByText('No cards yet')).toHaveLength(6)
		expect(screen.queryByText('Drop cards here')).not.toBeInTheDocument()
	})

	test('removing the only card moves focus to the expand button, not the search', () => {
		save({ name: 'x', tray: [], tiers: { S: [blueEyes] } })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))
		fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
		expect(screen.getByRole('button', { name: 'Expand tier list' })).toHaveFocus()
	})

	test('tiers show the same card art as desktop', () => {
		save({ name: 'x', tray: [ravine], tiers: { S: [blueEyes] } })
		renderPage()

		expect(screen.queryByTestId('rcl-card')).not.toBeInTheDocument()
		expect(within(screen.getByRole('region', { name: 'S tier' })).getByTestId('card-image')).toHaveAttribute('data-card-image', blueEyes.cardID)
		expect(within(screen.getByRole('region', { name: 'S tier' })).getByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).toBeInTheDocument()
		expect(within(screen.getByRole('region', { name: 'Tray' })).getByRole('button', { name: 'Rank Dragon Ravine' })).toBeInTheDocument()
	})

	test('tap a card, then a tier', () => {
		save({ name: 'x', tray: [blueEyes], tiers: {} })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))
		fireEvent.click(within(screen.getByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).getByRole('button', { name: 'S' }))

		expect(within(screen.getByRole('region', { name: 'S tier' })).getByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).toBeInTheDocument()
		expect(screen.queryByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).not.toBeInTheDocument()
	})

	test('Back to tray and Remove', () => {
		save({ name: 'x', tray: [ravine], tiers: { B: [redEyes] } })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Red-Eyes Black Dragon' }))
		fireEvent.click(screen.getByRole('button', { name: 'Back to tray' }))
		expect(within(screen.getByRole('region', { name: 'Tray' })).getByRole('button', { name: 'Rank Red-Eyes Black Dragon' })).toBeInTheDocument()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Dragon Ravine' }))
		fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
		expect(screen.queryByRole('button', { name: 'Rank Dragon Ravine' })).not.toBeInTheDocument()
	})

	test('Start over is a button beside the name, not behind a menu', async () => {
		save({ name: 'x', tray: [ravine], tiers: {} })
		renderPage()

		expect(screen.queryByRole('button', { name: 'More options' })).not.toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Start over' }))
		fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Start over' }))

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
		expect(screen.queryByText('Dragon Ravine')).not.toBeInTheDocument()
	})
})

describe('phone expand', () => {
	beforeEach(() => mockPhone(true))

	test('expand hides the sheet and keeps the board editable, collapse brings it back', () => {
		save({ name: 'x', tray: [ravine], tiers: { S: [blueEyes] } })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Expand tier list' }))
		expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
		expect(screen.queryByRole('region', { name: 'Tray' })).not.toBeInTheDocument()
		expect(within(screen.getByRole('region', { name: 'S tier' })).getByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).toBeInTheDocument()

		fireEvent.click(screen.getByRole('button', { name: 'Collapse tier list' }))
		expect(within(screen.getByRole('region', { name: 'Tray' })).getByRole('button', { name: 'Rank Dragon Ravine' })).toBeInTheDocument()
	})
})

describe('desktop expand', () => {
	test('there is no Edit | Screenshot switch', () => {
		renderPage()
		expect(screen.queryByRole('group', { name: 'View' })).not.toBeInTheDocument()
	})

	test('expand hides the side column and keeps the board editable, collapse brings it back', () => {
		save({ name: 'x', tray: [ravine], tiers: { S: [blueEyes] } })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Expand tier list' }))
		expect(screen.getByRole('heading', { level: 1, name: 'Tier list' })).toBeInTheDocument()
		expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
		expect(screen.queryByRole('region', { name: 'Tray' })).not.toBeInTheDocument()
		expect(within(screen.getByRole('region', { name: 'S tier' })).getByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).toBeInTheDocument()

		fireEvent.click(screen.getByRole('button', { name: 'Collapse tier list' }))
		expect(screen.getByRole('combobox')).toBeInTheDocument()
		expect(within(screen.getByRole('region', { name: 'Tray' })).getByText('Dragon Ravine')).toBeInTheDocument()
	})

	test('going back keeps it expanded', () => {
		const { unmount } = renderPage()
		fireEvent.click(screen.getByRole('button', { name: 'Expand tier list' }))
		unmount()

		renderPage()
		expect(screen.getByRole('button', { name: 'Collapse tier list' })).toBeInTheDocument()
	})
})

describe('keyboard focus', () => {
	test('picking a card moves focus into the picker, and choosing a tier brings it back to the card', () => {
		save({ name: 'x', tray: [ravine], tiers: { D: [blueEyes] } })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))
		expect(within(screen.getByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).getByRole('button', { name: 'D' })).toHaveFocus()

		fireEvent.click(within(screen.getByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).getByRole('button', { name: 'S' }))
		expect(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' })).toHaveFocus()
	})

	test('a tray card focuses the first tier', () => {
		save({ name: 'x', tray: [ravine], tiers: {} })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Dragon Ravine' }))
		expect(within(screen.getByRole('group', { name: 'Move Dragon Ravine to' })).getByRole('button', { name: 'S' })).toHaveFocus()
	})

	test('phones: the picker is a tooltip too, with no Done - a tap outside puts the card down', async () => {
		mockPhone(true)
		save({ name: 'x', tray: [ravine], tiers: {} })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Dragon Ravine' }))
		expect(screen.getByRole('group', { name: 'Move Dragon Ravine to' })).toBeInTheDocument()
		expect(within(screen.getByRole('region', { name: 'Find cards' })).queryByRole('group', { name: 'Move Dragon Ravine to' })).not.toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Done' })).not.toBeInTheDocument()

		await new Promise((resolve) => setTimeout(resolve))
		fireEvent.click(document.body)
		expect(screen.queryByRole('group', { name: 'Move Dragon Ravine to' })).not.toBeInTheDocument()
	})

	test('Esc puts the card down and returns focus to it', () => {
		save({ name: 'x', tray: [ravine], tiers: {} })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Dragon Ravine' }))
		fireEvent.keyDown(within(screen.getByRole('group', { name: 'Move Dragon Ravine to' })).getByRole('button', { name: 'S' }), { key: 'Escape' })

		expect(screen.queryByRole('group', { name: 'Move Dragon Ravine to' })).not.toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Rank Dragon Ravine' })).toHaveFocus()
	})

	test('a move is announced', () => {
		save({ name: 'x', tray: [ravine], tiers: {} })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Dragon Ravine' }))
		fireEvent.click(within(screen.getByRole('group', { name: 'Move Dragon Ravine to' })).getByRole('button', { name: 'B' }))
		expect(screen.getByText('Dragon Ravine moved to B')).toHaveAttribute('role', 'status')
	})
})

describe('desktop picker tooltip', () => {
	test('opens beside the card, not in the side column', () => {
		save({ name: 'x', tray: [], tiers: { S: [blueEyes] } })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))

		expect(screen.getByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).toBeInTheDocument()
		expect(within(screen.getByRole('complementary', { name: 'Find cards' })).queryByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).not.toBeInTheDocument()
	})

	test('has no Done button - a click outside or Esc puts the card down', () => {
		save({ name: 'x', tray: [], tiers: { S: [blueEyes] } })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))

		expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Done' })).not.toBeInTheDocument()
	})

	test('a click outside puts the card down', async () => {
		save({ name: 'x', tray: [], tiers: { S: [blueEyes] } })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))
		// ClickAwayListener starts listening a tick after it opens, so the click that opened it doesn't close it
		await new Promise((resolve) => setTimeout(resolve))
		fireEvent.click(document.body)

		expect(screen.queryByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).not.toBeInTheDocument()
	})

	test('clicking another card while it is open picks that card', () => {
		save({ name: 'x', tray: [ravine], tiers: { S: [blueEyes] } })
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Rank Blue-Eyes White Dragon' }))
		fireEvent.click(screen.getByRole('button', { name: 'Rank Dragon Ravine' }))

		expect(screen.getByRole('group', { name: 'Move Dragon Ravine to' })).toBeInTheDocument()
		expect(screen.queryByRole('group', { name: 'Move Blue-Eyes White Dragon to' })).not.toBeInTheDocument()
	})
})
