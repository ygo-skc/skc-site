import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import BanListCards, { BanListStatusCards } from '../BanListCards'
import MuiTheme from '../../MuiTheme'

jest.mock('skc-rcl', () => ({
	CardImageRounded: () => null,
	YGOCardWithImage: ({ card }: { card: YGOCard.Deets }) => <span data-testid='card-image'>{card.cardName}</span>,
}))

const card = (cardID: string, cardName: string, cardColor: YGOCard.Color, monsterType?: string): YGOCard.Deets => ({ cardID, cardName, cardColor, monsterType, cardEffect: '' })

const lists: BanListStatusCards[] = [
	{ status: 'Forbidden', cards: [card('1', 'Pot of Greed', 'spell'), card('2', 'Elfnote Tinia', 'effect', 'Spellcaster/Effect')] },
	{ status: 'Limited', cards: [card('3', 'Mirror Force', 'trap'), card('4', 'Ash Blossom', 'effect', 'Zombie/Tuner/Effect')] },
	{ status: 'Semi-Limited', cards: [card('5', 'Called by the Grave', 'spell')] },
]

function renderCards(props: Partial<React.ComponentProps<typeof BanListCards>> = {}) {
	const ui = (more: Partial<React.ComponentProps<typeof BanListCards>> = {}) => (
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<BanListCards isLoading={false} lists={lists} previousStatus={new Map([['2', 'Limited']])} {...props} {...more} />
			</MemoryRouter>
		</ThemeProvider>
	)
	const { rerender } = render(ui())
	return { rerenderWith: (more: Partial<React.ComponentProps<typeof BanListCards>>) => rerender(ui(more)) }
}

const cardNames = () =>
	within(screen.getByRole('table'))
		.getAllByRole('row')
		.slice(1)
		.map((row) => row.querySelector('.ban-list-cards__name')?.textContent)

test('lists every card, strongest status first, with its type, status and previous status', () => {
	renderCards()

	expect(cardNames()).toEqual(['Elfnote Tinia', 'Pot of Greed', 'Ash Blossom', 'Mirror Force', 'Called by the Grave'])

	const [card, type, status, previous] = within(screen.getAllByRole('row')[1]).getAllByRole('cell')
	expect(within(type).getByText('Spellcaster/Effect')).toBeInTheDocument()
	expect(within(status).getByText('Forbidden')).toBeInTheDocument()
	// a change shows the old status as its own tinted chip
	expect(within(previous).getByText('was')).toBeInTheDocument()
	expect(within(previous).getByText('Limited').closest('.MuiChip-root')).toHaveClass('ban-status--limited')
	expect(within(card).getByRole('link')).toHaveAttribute('href', '/card/2')
	// phones hide the type and previous columns, so both are repeated under the name and the status chip
	expect(within(card).getByText('Spellcaster/Effect')).toHaveClass('ban-list-cards__phone-only')
	const phoneWas = within(status).getByText('was').closest('.ban-list-cards__phone-only') as HTMLElement
	expect(within(phoneWas).getByText('Limited').closest('.MuiChip-root')).toHaveClass('ban-status--limited')

	const potOfGreed = within(screen.getAllByRole('row')[2]).getAllByRole('cell')
	// no change is a quiet dash, read out as "No change"
	expect(within(potOfGreed[3]).getByText('—')).toHaveAttribute('aria-hidden', 'true')
	expect(within(potOfGreed[3]).getByText('No change')).toBeInTheDocument()
	expect(within(potOfGreed[2]).queryByText(/was/)).not.toBeInTheDocument()
	expect(screen.getByText('5 of 5 cards')).toBeInTheDocument()
})

test('filters by status and shows how many cards each status has', () => {
	renderCards()
	const filters = within(screen.getByRole('group', { name: 'Status' }))

	expect(filters.getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'true')
	expect(filters.getByRole('button', { name: /^Limited/ })).toHaveTextContent('Limited 2')

	fireEvent.click(filters.getByRole('button', { name: /^Limited/ }))

	expect(filters.getByRole('button', { name: /^Limited/ })).toHaveAttribute('aria-pressed', 'true')
	expect(cardNames()).toEqual(['Ash Blossom', 'Mirror Force'])
})

test('searches by name', () => {
	renderCards()

	fireEvent.change(screen.getByRole('searchbox', { name: 'Search this list' }), { target: { value: 'pot' } })

	expect(cardNames()).toEqual(['Pot of Greed'])
})

test('filters by card type', () => {
	renderCards()

	fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Card type' }))
	fireEvent.click(screen.getByRole('option', { name: 'Spells' }))

	expect(cardNames()).toEqual(['Pot of Greed', 'Called by the Grave'])
})

test('sorts by a column and flips direction on a second click', () => {
	renderCards()

	fireEvent.click(screen.getByRole('button', { name: 'Card' }))
	expect(cardNames()).toEqual(['Ash Blossom', 'Called by the Grave', 'Elfnote Tinia', 'Mirror Force', 'Pot of Greed'])
	expect(screen.getByRole('columnheader', { name: /Card/ })).toHaveAttribute('aria-sort', 'ascending')

	fireEvent.click(screen.getByRole('button', { name: 'Card' }))
	expect(cardNames()[0]).toBe('Pot of Greed')
	expect(screen.getByRole('columnheader', { name: /Card/ })).toHaveAttribute('aria-sort', 'descending')
})

test('switches to card images, keeping the filters', () => {
	renderCards()

	fireEvent.click(within(screen.getByRole('group', { name: 'Status' })).getByRole('button', { name: /^Forbidden/ }))
	fireEvent.click(screen.getByRole('button', { name: 'Cards' }))

	expect(screen.queryByRole('table')).not.toBeInTheDocument()
	expect(screen.getAllByTestId('card-image').map((image) => image.textContent)).toEqual(['Elfnote Tinia', 'Pot of Greed'])
	// the status chip and the old status share one badge laid over the card's art
	const badge = screen.getByText('was Limited').closest('.ban-list-cards__grid-badge') as HTMLElement
	expect(within(badge).getByText('Forbidden').closest('.MuiChip-root')).toHaveClass('ban-status--forbidden')
})

test('shows 30 cards at a time with a Show more button', () => {
	const many = Array.from({ length: 45 }, (_, i) => card(`${i}`, `Card ${String(i).padStart(2, '0')}`, 'spell'))
	renderCards({ lists: [{ status: 'Forbidden', cards: many }] })

	expect(screen.getAllByRole('row')).toHaveLength(31)
	expect(screen.getByText('30 of 45 cards')).toBeInTheDocument()

	fireEvent.click(screen.getByRole('button', { name: 'Show more' }))

	expect(screen.getAllByRole('row')).toHaveLength(46)
	expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument()
})

test('starts another list from the first page, keeping the search', () => {
	const many = (prefix: string) => Array.from({ length: 45 }, (_, i) => card(`${prefix}${i}`, `Card ${prefix}${String(i).padStart(2, '0')}`, 'spell'))
	const { rerenderWith } = renderCards({ lists: [{ status: 'Forbidden', cards: many('a') }] })

	fireEvent.change(screen.getByRole('searchbox', { name: 'Search this list' }), { target: { value: 'card' } })
	fireEvent.click(screen.getByRole('button', { name: 'Show more' }))
	expect(screen.getByText('45 of 45 cards')).toBeInTheDocument()

	rerenderWith({ lists: [{ status: 'Forbidden', cards: many('b') }] })

	expect(screen.getByText('30 of 45 cards')).toBeInTheDocument()
	expect(screen.getByRole('searchbox', { name: 'Search this list' })).toHaveValue('card')
})

test('says when no cards match', () => {
	renderCards()

	fireEvent.change(screen.getByRole('searchbox', { name: 'Search this list' }), { target: { value: 'zzz' } })

	expect(screen.getByText('No cards match these filters.')).toBeInTheDocument()
})

test('holds the table with placeholder rows and hides the counts while loading', () => {
	renderCards({ isLoading: true, lists: [] })

	expect(screen.getAllByTestId('ban-list-row-skeleton')).toHaveLength(8)
	expect(screen.getByRole('columnheader', { name: /Card/ })).toBeInTheDocument()
	expect(within(screen.getByRole('group', { name: 'Status' })).getByRole('button', { name: /^Limited/ })).toHaveTextContent(/^Limited$/)
	expect(screen.queryByText('No cards match these filters.')).not.toBeInTheDocument()
	expect(screen.queryByText(/of 0 cards/)).not.toBeInTheDocument()
})

test('holds the card grid with card-shaped placeholders while loading', () => {
	renderCards({ isLoading: true, lists: [] })

	fireEvent.click(screen.getByRole('button', { name: 'Cards' }))

	expect(screen.getAllByTestId('ban-list-card-skeleton')).toHaveLength(8)
})
