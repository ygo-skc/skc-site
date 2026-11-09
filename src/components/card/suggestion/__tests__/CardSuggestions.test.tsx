import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import CardSuggestions from '../CardSuggestions'
import MuiTheme from '../../../MuiTheme'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({ CardImageRounded: () => null }))

const renderSuggestions = (props: Partial<React.ComponentProps<typeof CardSuggestions>> = {}) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<CardSuggestions
					namedMaterials={[]}
					namedReferences={[]}
					materialFor={[]}
					referencedBy={[]}
					isFetchingSuggestions={false}
					isFetchingSupport={false}
					suggestionRequestHasError={false}
					supportRequestHasError={false}
					cardName='Dark Magician'
					{...props}
				/>
			</MemoryRouter>
		</ThemeProvider>
	)

const reference = (cardID: string, cardName: string, occurrences = 1): YGOCard.Reference => ({ card: { cardID, cardName, cardColor: 'effect', cardEffect: '' }, occurrences })

test('holds two columns while either request loads', () => {
	renderSuggestions({ isFetchingSupport: true })

	const skeleton = screen.getByTestId('suggestions-sheet-skeleton')
	expect(skeleton).toHaveAttribute('aria-hidden', 'true')
	expect(skeleton.querySelectorAll('.ban-list-changes__column')).toHaveLength(2)
	expect(skeleton.querySelectorAll('.ban-list-changes__rows li')).toHaveLength(8)
})

test("a column per kind of link, in the card's words, each row linking to its card", () => {
	renderSuggestions({ referencedBy: [reference('1', 'Dark Magician Girl')], namedReferences: [reference('2', 'Dark Magic Attack', 2)] })

	expect(screen.getByText('Cards that Dark Magician names, or that name it')).toBeInTheDocument()
	const referencedBy = screen.getByRole('region', { name: 'Referenced By' })
	expect(within(referencedBy).getByText('Mention Dark Magician in their text')).toBeInTheDocument()
	expect(within(referencedBy).getByRole('link', { name: /Dark Magician Girl/ })).toHaveAttribute('href', '/card/1')
	expect(within(screen.getByRole('region', { name: 'References' })).getByText('2 links')).toBeInTheDocument()
	// kinds with no cards have no column
	expect(screen.queryByRole('region', { name: 'Named Materials' })).not.toBeInTheDocument()
})

test('past eight rows the rest open in a popup', () => {
	renderSuggestions({ referencedBy: Array.from({ length: 10 }, (_, index) => reference(`${index}`, `Card ${index}`)) })

	expect(within(screen.getByRole('region', { name: 'Referenced By' })).getAllByRole('link')).toHaveLength(8)
	fireEvent.click(screen.getByRole('button', { name: 'Show all 10' }))
	expect(within(screen.getByRole('dialog')).getAllByRole('link')).toHaveLength(10)
})

test('says so when there are no suggestions, and only errors when both requests fail', () => {
	const { unmount } = renderSuggestions()
	expect(screen.getByText('No suggestions for this card.')).toBeInTheDocument()
	unmount()

	renderSuggestions({ suggestionRequestHasError: true, referencedBy: [reference('1', 'Dark Magician Girl')] })
	expect(screen.getByRole('link', { name: /Dark Magician Girl/ })).toBeInTheDocument()

	renderSuggestions({ suggestionRequestHasError: true, supportRequestHasError: true })
	expect(screen.getByText(/Couldn.t load suggestions/)).toBeInTheDocument()
})

test('reads "this card" until the card itself loads', () => {
	renderSuggestions({ cardName: '' })
	expect(screen.getByText('Cards that this card names, or that name it')).toBeInTheDocument()
})
