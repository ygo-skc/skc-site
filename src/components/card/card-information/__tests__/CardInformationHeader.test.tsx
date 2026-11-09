import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import CardInformationHeader from '../CardInformationHeader'
import MuiTheme from '../../../MuiTheme'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	CardImageRounded: () => null,
	YGOCard: ({ cardName }: { cardName: string }) => <div data-testid='ygo-card'>{cardName}</div>,
}))

const uria = {
	cardID: '06007213',
	cardName: 'Uria, Lord of Searing Flames',
	cardColor: 'Effect',
	cardAttribute: 'Fire',
	cardEffect: '',
	monsterAssociation: { level: 10 },
} as unknown as YGOCard.Deets

const product = (productId: string, productName: string, productReleaseDate: string, rarities: string[]) =>
	({ productId, productName, productLocale: 'en', productReleaseDate, productContent: [{ productPosition: '001', rarities }] } as unknown as YGOProduct.Info)

const renderHeader = (props: Partial<Parameters<typeof CardInformationHeader>[0]> = {}) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<CardInformationHeader
					card={uria}
					isFetchingCardData={false}
					productInfo={[product('MZMU', 'Maze of Muertos', '2026-02-20', ['Starlight Rare']), product('SOI', 'Shadow of Infinity', '2006-02-18', ['Ultra Rare'])]}
					restrictionInfo={{ TCG: [], MD: [], DL: [] }}
					archetypes={new Set(['Uria, Lord of Searing Flames'])}
					isFetchingArchetypes={false}
					{...props}
				/>
			</MemoryRouter>
		</ThemeProvider>
	)

test('shows the card beside its name, eyebrow and printing history', () => {
	renderHeader()

	expect(screen.getByRole('heading', { level: 1, name: 'Uria, Lord of Searing Flames' })).toBeInTheDocument()
	expect(screen.getByText('Effect Monster · Fire · Level 10')).toBeInTheDocument()
	expect(screen.getByTestId('ygo-card')).toHaveTextContent('Uria, Lord of Searing Flames')
	expect(screen.getByText('2 in 2 products')).toBeInTheDocument()
	expect(screen.getByText('First printed').parentElement).toHaveTextContent('Feb 18, 2006 · Shadow of Infinity')
	expect(screen.getByText('Last printed').parentElement).toHaveTextContent('Feb 20, 2026 · Maze of Muertos')
})

test('reads a format the card was never listed in as unlimited, and a listed one by its newest list', () => {
	renderHeader({
		restrictionInfo: { TCG: [{ banListDate: '2016-08-29', cardID: '06007213', banStatus: 'Forbidden' }], MD: [], DL: [] },
	})

	expect(screen.getByText('TCG').parentElement).toHaveTextContent('Forbidden on the Aug 29, 2016 list1 list')
	expect(screen.getByText('Master Duel').parentElement).toHaveTextContent('Unlimitednever listed')
	expect(screen.queryByText('Duel Links')).not.toBeInTheDocument()
})

test('says when a card is in no archetype', () => {
	renderHeader({ archetypes: new Set() })
	expect(screen.getByText('Not tied to any archetype')).toBeInTheDocument()
})

test('copies the passcode and says so', async () => {
	const writeText = jest.fn().mockResolvedValue(undefined)
	Object.assign(navigator, { clipboard: { writeText } })
	renderHeader()

	fireEvent.click(screen.getByRole('button', { name: 'Copy passcode' }))

	expect(writeText).toHaveBeenCalledWith('06007213')
	expect(await screen.findByText('Passcode copied')).toHaveAttribute('role', 'status')
})

test('has no last printed row when every printing is in one product', () => {
	renderHeader({ productInfo: [product('MZMU', 'Maze of Muertos', '2026-02-20', ['Starlight Rare']), product('MZMU', 'Maze of Muertos', '2026-02-20', ['Rare'])] })

	expect(screen.getByText('2 in 1 product')).toBeInTheDocument()
	expect(screen.getByText('First printed')).toBeInTheDocument()
	expect(screen.queryByText('Last printed')).not.toBeInTheDocument()
})

test('calls a printing that has not come out yet upcoming, counting the days to it', () => {
	const next = new Date()
	next.setDate(next.getDate() + 30)
	const nextDate = [next.getFullYear(), String(next.getMonth() + 1).padStart(2, '0'), String(next.getDate()).padStart(2, '0')].join('-')
	renderHeader({ productInfo: [product('SOI', 'Shadow of Infinity', '2006-02-18', ['Ultra Rare']), product('NEXT', 'Next Set', nextDate, ['Rare'])] })

	expect(screen.queryByText('Last printed')).not.toBeInTheDocument()
	expect(screen.getByText('Upcoming printing').parentElement).toHaveTextContent('in 30 days')
})

test('copying without a clipboard does nothing rather than throwing', () => {
	Object.assign(navigator, { clipboard: undefined })
	renderHeader()

	fireEvent.click(screen.getByRole('button', { name: 'Copy passcode' }))

	expect(screen.getByRole('status')).toHaveTextContent('')
})

test('a refused copy says nothing', async () => {
	Object.assign(navigator, { clipboard: { writeText: jest.fn().mockRejectedValue(new Error('denied')) } })
	renderHeader()

	fireEvent.click(screen.getByRole('button', { name: 'Copy passcode' }))
	await Promise.resolve()

	expect(screen.getByRole('status')).toHaveTextContent('')
})
