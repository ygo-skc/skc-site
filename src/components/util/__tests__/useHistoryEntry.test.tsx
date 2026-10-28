import { act, fireEvent, render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { MAX_HISTORY_ENTRIES, useHistoryEntryState } from '../useHistoryEntry'

// a count that only settles once it's even, standing in for a page that's done loading
const isEven = (count: number) => count % 2 === 0

function Counter() {
	const [count, setCount, isRestored] = useHistoryEntryState<number>('count', 0, isEven)
	return (
		<button onClick={() => setCount((current) => current + 1)}>
			{count} {isRestored ? 'restored' : 'fresh'}
		</button>
	)
}

function renderCounter() {
	const router = createMemoryRouter(
		[
			{ path: '/', element: <Counter /> },
			{ path: '/elsewhere', element: <p>Elsewhere</p> },
		],
		{ initialEntries: ['/'] }
	)
	render(<RouterProvider router={router} />)
	return router
}

test('comes back as it was left when the reader goes back to the same entry', async () => {
	const router = renderCounter()
	fireEvent.click(screen.getByRole('button'))
	fireEvent.click(screen.getByRole('button'))

	await act(() => router.navigate('/elsewhere'))
	await act(() => router.navigate(-1))

	expect(screen.getByRole('button')).toHaveTextContent('2 restored')
})

test('keeps the last settled state, not one left part way', async () => {
	const router = renderCounter()
	fireEvent.click(screen.getByRole('button'))
	fireEvent.click(screen.getByRole('button'))
	fireEvent.click(screen.getByRole('button'))

	await act(() => router.navigate('/elsewhere'))
	await act(() => router.navigate(-1))

	expect(screen.getByRole('button')).toHaveTextContent('2 restored')
})

test('a new visit to the same url starts fresh', async () => {
	const router = renderCounter()
	fireEvent.click(screen.getByRole('button'))
	fireEvent.click(screen.getByRole('button'))

	await act(() => router.navigate('/elsewhere'))
	await act(() => router.navigate('/'))

	expect(screen.getByRole('button')).toHaveTextContent('0 fresh')
})

test('forgets the oldest entries once there are more than the browser keeps', async () => {
	const router = renderCounter()
	fireEvent.click(screen.getByRole('button'))
	fireEvent.click(screen.getByRole('button'))

	// each visit back to the counter is a new entry that remembers its own count
	for (let visit = 0; visit < MAX_HISTORY_ENTRIES; visit++) {
		await act(() => router.navigate('/elsewhere'))
		await act(() => router.navigate('/'))
	}
	// from another page, so the counter mounts again rather than carrying on
	await act(() => router.navigate('/elsewhere'))
	await act(() => router.navigate(-(2 * MAX_HISTORY_ENTRIES + 1)))

	expect(screen.getByRole('button')).toHaveTextContent('0 fresh')
})
