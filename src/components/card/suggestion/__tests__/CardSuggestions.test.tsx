import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import CardSuggestions from '../CardSuggestions'
import MuiTheme from '../../../MuiTheme'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	Section: ({ sectionName, children }: { sectionName: string; children: React.ReactNode }) => <section aria-label={sectionName}>{children}</section>,
	Hint: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
	GenericNonBreakingErr: ({ errExplanation }: { errExplanation: string }) => <p>{errExplanation}</p>,
	YGOCardWithImage: ({ card }: { card: YGOCard.Deets }) => <span>{card.cardName}</span>,
	YGOCardWithQuantity: ({ card }: { card: YGOCard.Deets }) => <span>{card.cardName}</span>,
}))

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
					cardColor='effect'
					cardName='Dark Magician'
					{...props}
				/>
			</MemoryRouter>
		</ThemeProvider>
	)

const reference = (cardID: string, cardName: string): YGOCard.Reference => ({ card: { cardID, cardName, cardColor: 'effect', cardEffect: '' }, occurrences: 1 })

test('holds two rows of card tiles while the suggestions load', () => {
	renderSuggestions({ isFetchingSuggestions: true, isFetchingSupport: true })

	const skeleton = screen.getByTestId('card-suggestions-skeleton')
	expect(skeleton).toHaveAttribute('aria-hidden', 'true')
	expect(skeleton.querySelectorAll('.suggestion-section')).toHaveLength(2)
	expect(skeleton.querySelectorAll('.suggested-ygo-card-wrapper')).toHaveLength(12)
})

test('the suggestions replace the skeleton once loaded', () => {
	renderSuggestions({ referencedBy: [reference('1', 'Dark Magician Girl')] })

	expect(screen.queryByTestId('card-suggestions-skeleton')).not.toBeInTheDocument()
	expect(screen.getByText('Referenced By (1)')).toBeInTheDocument()
	expect(screen.getByRole('link', { name: 'Dark Magician Girl' })).toHaveAttribute('href', '/card/1')
})
