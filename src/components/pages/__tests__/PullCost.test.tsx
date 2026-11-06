import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import PullCost from '../PullCost'
import MuiTheme from '../../MuiTheme'

const renderPage = () =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<PullCost />
			</MemoryRouter>
		</ThemeProvider>
	)

const type = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })
const headline = () => screen.getByRole('heading', { level: 2, name: /chance of/ }).textContent

test('verify the budget starts at the average cost', () => {
	renderPage()

	expect(headline()).toBe('64% chance of a GMR')
	expect(screen.getByText(/\$53,440 buys 160 boxes \(40 cases\)/)).toBeInTheDocument()
	expect(screen.getByRole('button', { name: /^Average cost/ })).toHaveAttribute('aria-pressed', 'true')
})

test('verify the chance also reads as people out of 100', () => {
	renderPage()

	expect(screen.getByText(/If 100 people each spent this, about 64 would pull a GMR and about 36 would pull nothing/)).toBeInTheDocument()
	expect(screen.getByText(/about 36 would pull nothing, about 37 would pull exactly one and about 27 would pull two or more/)).toBeInTheDocument()

	type('Your budget', '0')
	expect(screen.getByText(/If 100 people each spent this, none would pull a GMR and all would pull nothing/)).toBeInTheDocument()
})

test('verify the spreadsheet outcomes show and set the budget', () => {
	renderPage()
	const lucky = screen.getByRole('button', { name: /Lucky, half the average cost/ })
	const unlucky = screen.getByRole('button', { name: /Unlucky, double the average cost/ })

	expect(within(lucky).getByText('$26,720')).toBeInTheDocument()
	expect(within(unlucky).getByText('$106,880')).toBeInTheDocument()

	fireEvent.click(unlucky)
	expect(headline()).toBe('87% chance of a GMR')
	expect(screen.getByLabelText('Your budget')).toHaveValue(106880)
	expect(unlucky).toHaveAttribute('aria-pressed', 'true')
})

test('verify an odd average sets the budget a scenario shows', () => {
	renderPage()
	type('Average cases to pull one', '7')
	const lucky = screen.getByRole('button', { name: /Lucky, half the average cost/ })

	expect(within(lucky).getByText('$4,676')).toBeInTheDocument()
	expect(within(lucky).getByText(/3.5 cases. 42% chance/)).toBeInTheDocument()

	fireEvent.click(lucky)
	expect(headline()).toBe('42% chance of a GMR')
	expect(screen.getByLabelText('Your budget')).toHaveValue(4676)
	expect(lucky).toHaveAttribute('aria-pressed', 'true')
})

test('verify a budget under a case still buys boxes', () => {
	renderPage()
	type('Your budget', '1000')

	expect(screen.getByText(/\$668 buys 2 boxes \(0.5 cases\)/)).toBeInTheDocument()
	expect(headline()).toBe('1% chance of a GMR')
})

test('verify boxes per case and the rarity change the answer', () => {
	renderPage()
	fireEvent.click(screen.getByRole('button', { name: '12' }))
	type('Chase rarity', 'Ultimate Rare')

	expect(screen.getByText(/\$160,320 buys 480 boxes \(40 cases\)/)).toBeInTheDocument()
	expect(headline()).toBe('64% chance of an Ultimate Rare')
})

test('verify picking a confidence level uses it as the budget', () => {
	renderPage()
	fireEvent.click(screen.getByRole('button', { name: /90% chance/ }))

	expect(screen.getByLabelText('Your budget')).toHaveValue(121576)
	expect(headline()).toBe('90% chance of a GMR')
})

test('verify every confidence level reads the chance it sets', () => {
	renderPage()

	for (const level of ['50%', '75%', '90%', '95%']) {
		fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${level} chance`) }))
		expect(headline()).toBe(`${level} chance of a GMR`)
	}
	expect(screen.getByRole('button', { name: /^50% chance/ })).toHaveTextContent('27.5 cases$36,740')
})

test('verify several cards at the rarity show the odds of one and of all', () => {
	renderPage()

	expect(screen.getByText('One specific GMR')).toBeInTheDocument()
	expect(screen.getByText('$961,920')).toBeInTheDocument()
	expect(screen.getByText(/720 cases on average to hit the exact one you want. Your budget has a 5% chance of it/)).toBeInTheDocument()
	expect(screen.getByText('All 18 GMRs')).toBeInTheDocument()
	expect(screen.getByText(/Add the lowest and highest single prices/)).toBeInTheDocument()
})

test('verify one card at the rarity hides the section until a price is entered', () => {
	renderPage()
	type('Unique cards at this rarity', '1')
	expect(screen.queryByRole('heading', { name: 'Which one you pull' })).not.toBeInTheDocument()

	type('Highest single', '13360')
	expect(screen.getByRole('heading', { name: 'Which one you pull' })).toBeInTheDocument()
	expect(screen.queryByText('One specific GMR')).not.toBeInTheDocument()
	expect(screen.queryByText(/this exact card/)).not.toBeInTheDocument()
})

test('verify lowest and highest prices give their metrics and the value of the budget', () => {
	renderPage()
	type('Lowest single', '500')
	type('Highest single', '13360')

	expect(screen.getByText(/25% of the average cost to pull one. The same money on boxes gives a 22% chance of any GMR and a 1% chance of this exact card/)).toBeInTheDocument()
	expect(screen.getByText(/0.9% of the average cost to pull one. The same money on boxes gives a 0.9% chance of any GMR/)).toBeInTheDocument()
	expect(screen.getByText('$500 – $13,360')).toBeInTheDocument()
	expect(screen.getByText(/Spending \$53,440 gets about 1.00 GMRs on average/)).toBeInTheDocument()
	expect(screen.queryByText(/Add the lowest and highest/)).not.toBeInTheDocument()
})

test('verify prices typed the wrong way round still read lowest to highest', () => {
	renderPage()
	type('Lowest single', '13360')
	type('Highest single', '500')

	expect(screen.getByText('$500 – $13,360')).toBeInTheDocument()
})

test('verify missing numbers ask for them instead of showing odds', () => {
	renderPage()
	type('Cost of a sealed box', '')

	expect(screen.getByRole('heading', { name: 'Your odds show up here' })).toBeInTheDocument()
	expect(screen.queryByRole('heading', { name: /chance of/ })).not.toBeInTheDocument()
})

test('verify the box cost keeps to dollars and cents', () => {
	renderPage()
	const boxCost = screen.getByLabelText('Cost of a sealed box')
	expect(boxCost).toHaveValue(334)

	type('Cost of a sealed box', '299.999')
	expect(boxCost).toHaveValue(334)
	type('Cost of a sealed box', '299.9')
	fireEvent.blur(boxCost)
	expect(boxCost).toHaveDisplayValue('299.90')
})

test('verify the single prices keep to dollars and cents like the box cost', () => {
	renderPage()

	for (const label of ['Lowest single', 'Highest single']) {
		const price = screen.getByLabelText(label)
		type(label, '45.999')
		expect(price).toHaveDisplayValue('')
		type(label, '45.5')
		fireEvent.blur(price)
		expect(price).toHaveDisplayValue('45.50')
	}
})

test('verify the unique cards stepper counts up and stops at one', () => {
	renderPage()
	const uniqueCards = screen.getByLabelText('Unique cards at this rarity')
	fireEvent.click(screen.getByRole('button', { name: 'More unique cards at this rarity' }))
	expect(uniqueCards).toHaveValue(19)

	type('Unique cards at this rarity', '1')
	expect(screen.getByRole('button', { name: 'Fewer unique cards at this rarity' })).toBeDisabled()
})

test('verify the unique cards stay whole numbers', () => {
	renderPage()
	const uniqueCards = screen.getByLabelText('Unique cards at this rarity')

	type('Unique cards at this rarity', '2.5')
	expect(uniqueCards).toHaveValue(18)

	for (const key of ['.', 'e', '-']) expect(fireEvent.keyDown(uniqueCards, { key })).toBe(false)
	expect(fireEvent.keyDown(uniqueCards, { key: '4' })).toBe(true)
})

test('verify a and an follow how the rarity is read', () => {
	renderPage()
	const cases: [string, string][] = [
		['SR', 'an SR'],
		['UR', 'a UR'],
		['GMR', 'a GMR'],
		['QCSR', 'a QCSR'],
		['Ultimate Rare', 'an Ultimate Rare'],
		['Starlight Rare', 'a Starlight Rare'],
	]

	for (const [rarity, read] of cases) {
		type('Chase rarity', rarity)
		expect(headline()).toBe(`64% chance of ${read}`)
	}
})

test('verify the headline is announced once it settles, not on every change', () => {
	jest.useFakeTimers()
	renderPage()
	const status = screen.getByRole('status')
	// arriving announces nothing
	act(() => jest.advanceTimersByTime(1000))
	expect(status).toHaveTextContent('64% chance of a GMR')
	expect(screen.getByRole('heading', { level: 2, name: /chance of/ })).not.toHaveAttribute('aria-live')

	type('Your budget', '1000')
	type('Your budget', '106880')
	act(() => jest.advanceTimersByTime(500))
	expect(status).toHaveTextContent('64% chance of a GMR')
	act(() => jest.advanceTimersByTime(500))
	expect(status).toHaveTextContent('87% chance of a GMR')
	jest.useRealTimers()
})

const asPhone = () => {
	const matchMedia = window.matchMedia
	window.matchMedia = jest.fn().mockImplementation((query: string) => ({
		matches: query.includes('max-width'),
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
	}))
	return () => (window.matchMedia = matchMedia)
}

test('verify phones fold the inputs into a summary between the title and the answer', () => {
	const restore = asPhone()
	renderPage()

	const title = screen.getByRole('heading', { level: 1, name: 'Pull cost calculator' })
	const edit = screen.getByRole('button', { name: 'Edit numbers' })
	const answer = screen.getByRole('heading', { level: 2, name: /chance of/ })
	expect(title.compareDocumentPosition(edit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
	expect(edit.compareDocumentPosition(answer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
	expect(screen.getByText('$334 a box · 4 boxes a case · 40 cases on average · 18 cards')).toBeInTheDocument()
	expect(edit).toHaveAttribute('aria-expanded', 'false')
	expect(screen.queryByLabelText('Cost of a sealed box')).not.toBeInTheDocument()

	fireEvent.click(edit)
	const inputs = screen.getByRole('group', { name: 'Your numbers' })
	expect(within(inputs).getByLabelText('Cost of a sealed box')).toBeInTheDocument()
	expect(inputs.compareDocumentPosition(answer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
	type('Cost of a sealed box', '33.99')

	fireEvent.click(screen.getByRole('button', { name: 'Done' }))
	expect(screen.getByRole('button', { name: 'Edit numbers' })).toHaveAttribute('aria-expanded', 'false')
	expect(screen.getByText(/^\$33\.99 a box/)).toBeInTheDocument()
	restore()
})

test('verify desktop keeps the inputs first, with the title in their column', () => {
	renderPage()

	const inputs = screen.getByRole('complementary', { name: 'Your numbers' })
	expect(within(inputs).getByRole('heading', { level: 1, name: 'Pull cost calculator' })).toBeInTheDocument()
	expect(inputs.compareDocumentPosition(screen.getByRole('heading', { level: 2, name: /chance of/ })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test('verify a mouse press on the chart starts no text selection', () => {
	renderPage()
	const slider = screen.getByRole('slider', { name: 'Cases you can afford' })

	// fireEvent returns false once a handler has prevented the default - the press that would start a selection
	expect(fireEvent.mouseDown(slider)).toBe(false)
	expect(fireEvent.mouseDown(screen.getByRole('img', { name: /Chance of a pull rises with spend/ }))).toBe(false)
	expect(fireEvent.mouseDown(screen.getByText(/Further right is more money spent/))).toBe(true)
})
