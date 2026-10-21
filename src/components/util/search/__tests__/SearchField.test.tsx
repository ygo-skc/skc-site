import { act, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import SearchField, { EXAMPLE_SEARCHES } from '../SearchField'
import { SiteSearchProvider } from '../SiteSearch'
import MuiTheme from '../../../MuiTheme'

// the search popup shows skc-rcl's card preview - skc-rcl pulls in esm only chart libraries jest can't load
jest.mock('skc-rcl', () => ({ YGOCardPreview: () => null }))

const renderField = () =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<SiteSearchProvider>
					<SearchField />
				</SiteSearchProvider>
			</MemoryRouter>
		</ThemeProvider>
	)

const reduceMotion = (reduce: boolean) => {
	window.matchMedia = jest.fn().mockImplementation((query: string) => ({
		matches: reduce && query.includes('prefers-reduced-motion'),
		media: query,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		addListener: jest.fn(),
		removeListener: jest.fn(),
	}))
}

afterEach(() => {
	jest.useRealTimers()
})

test('verify the home search field opens the search popup', async () => {
	renderField()

	const field = screen.getByRole('button', { name: /Search cards by name or passcode/ })
	expect(field).toHaveAttribute('aria-haspopup', 'dialog')
	fireEvent.click(field)

	expect(await screen.findByRole('combobox', { name: 'Search cards' })).toHaveFocus()
})

test('verify the home search field types out each example in turn', () => {
	jest.useFakeTimers()
	reduceMotion(false)
	renderField()

	const field = screen.getByRole('button', { name: 'Search cards by name or passcode' })
	expect(field).toHaveTextContent(EXAMPLE_SEARCHES[0])

	// hold, delete, then type the whole of the next example
	act(() => {
		jest.advanceTimersByTime(1600 + EXAMPLE_SEARCHES[0].length * 35 + 300 + 3 * 70)
	})
	expect(field).toHaveTextContent(`Try ${EXAMPLE_SEARCHES[1].slice(0, 3)}`)

	act(() => {
		jest.advanceTimersByTime(EXAMPLE_SEARCHES[1].length * 70)
	})
	expect(field).toHaveTextContent(EXAMPLE_SEARCHES[1])
	// the typing never changes what assistive tech calls the button
	expect(field).toHaveAccessibleName('Search cards by name or passcode')
})

test('verify the home search field keeps one example still when motion is reduced', () => {
	jest.useFakeTimers()
	reduceMotion(true)
	renderField()

	const field = screen.getByRole('button', { name: 'Search cards by name or passcode' })
	act(() => {
		jest.advanceTimersByTime(20000)
	})
	expect(field).toHaveTextContent(`Try ${EXAMPLE_SEARCHES[0]}`)
})
