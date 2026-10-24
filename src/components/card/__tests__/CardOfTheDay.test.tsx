import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import CardOfTheDay from '../CardOfTheDay'
import MuiTheme from '../../MuiTheme'

// skc-rcl pulls in esm only chart libraries - the preview stands in as the card's name
jest.mock('skc-rcl', () => ({
	GenericNonBreakingErr: ({ errExplanation }: { errExplanation: string }) => <p>{errExplanation}</p>,
	YGOCardPreview: ({ card }: { card: YGOCard.Deets }) => <p>{card.cardName}</p>,
}))

const card: YGOCard.Deets = {
	cardID: '89617515',
	cardName: 'Lifeless Leaffish',
	cardColor: 'effect',
	cardAttribute: 'Water',
	cardEffect: 'When this card is Summoned: You can send 1 Fish monster from your Deck to the GY.',
	monsterType: 'Fish/Effect',
	monsterAttack: '1500',
	monsterDefense: '1600',
}

const renderCOTD = (data: Partial<APIRequest<SKC.CardOfTheDay>>) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<CardOfTheDay cardOfTheDayData={{ date: '2026-10-23', version: 1, card, isFetchingData: false, requestHasError: false, ...data }} />
			</MemoryRouter>
		</ThemeProvider>
	)

test('the preview links to the card with the date beside the heading', () => {
	renderCOTD({})

	expect(screen.getByRole('heading', { name: 'Card of the day' })).toBeInTheDocument()
	expect(screen.getByText('Oct 23')).toHaveAttribute('datetime', '2026-10-23')
	expect(screen.getByRole('link', { name: 'Lifeless Leaffish' })).toHaveAttribute('href', '/card/89617515')
})

test('no link while the card loads', () => {
	renderCOTD({ date: '', isFetchingData: true })

	expect(screen.queryByRole('link')).not.toBeInTheDocument()
	expect(screen.queryByText('Oct 23')).not.toBeInTheDocument()
	// shaped like the preview: art, name, type chip, atk/def and effect
	expect(screen.getByTestId('card-of-the-day-skeleton').querySelectorAll('.MuiSkeleton-root')).toHaveLength(5)
})

test('an error message instead of the card when the request fails', () => {
	renderCOTD({ requestHasError: true })

	expect(screen.getByText(/Come back at a different time/)).toBeInTheDocument()
	expect(screen.queryByRole('link')).not.toBeInTheDocument()
})
