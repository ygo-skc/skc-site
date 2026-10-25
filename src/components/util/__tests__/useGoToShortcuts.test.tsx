import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'

import useGoToShortcuts, { GO_TO_WINDOW_MS } from '../useGoToShortcuts'

function Harness() {
	useGoToShortcuts()

	return (
		<>
			<p data-testid='path'>{useLocation().pathname}</p>
			<input aria-label='name' />
			<div role='dialog' aria-label='Settings'>
				<button>Done</button>
			</div>
			<ul role='listbox' aria-label='Card type'>
				<li role='option' aria-selected='false' tabIndex={-1}>
					Effect
				</li>
			</ul>
		</>
	)
}

function renderAt(path = '/about') {
	render(
		<MemoryRouter initialEntries={[path]}>
			<Harness />
		</MemoryRouter>
	)
	return screen.getByTestId('path')
}

const press = (key: string, target: Element = document.body, init = {}) => fireEvent.keyDown(target, { key, ...init })

afterEach(() => jest.useRealTimers())

test('verify g then a letter opens each page', () => {
	const path = renderAt()

	;[
		['b', '/ban_list'],
		['c', '/browse/card'],
		['p', '/browse/product'],
		['a', '/about'],
		['h', '/'],
	].forEach(([key, to]) => {
		press('g')
		press(key)
		expect(path).toHaveTextContent(new RegExp(`^${to}$`))
	})
})

test('verify the letter alone does nothing', () => {
	const path = renderAt()

	press('b')

	expect(path).toHaveTextContent('/about')
})

test('verify another key between g and the letter ends the sequence', () => {
	const path = renderAt()

	press('g')
	press('x')
	press('b')

	expect(path).toHaveTextContent('/about')
})

test('verify the letter only counts shortly after g', () => {
	jest.useFakeTimers()
	const path = renderAt()

	press('g')
	jest.advanceTimersByTime(GO_TO_WINDOW_MS + 1)
	press('b')

	expect(path).toHaveTextContent('/about')
})

test('verify the shortcuts stand aside while typing, in a popup or menu, or with a modifier', () => {
	const path = renderAt()

	press('g', screen.getByLabelText('name'))
	press('b', screen.getByLabelText('name'))
	press('g', screen.getByRole('button', { name: 'Done' }))
	press('b', screen.getByRole('button', { name: 'Done' }))
	press('g', screen.getByRole('option', { name: 'Effect' }))
	press('a', screen.getByRole('option', { name: 'Effect' }))
	press('g', document.body, { metaKey: true })
	press('b')

	expect(path).toHaveTextContent('/about')
})
