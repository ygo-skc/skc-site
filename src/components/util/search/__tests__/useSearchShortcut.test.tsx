import { fireEvent, render } from '@testing-library/react'

import useSearchShortcut from '../useSearchShortcut'

function Harness({ onOpen }: { onOpen: () => void }) {
	useSearchShortcut(onOpen)

	return (
		<>
			<input aria-label='name' />
			<textarea aria-label='notes' />
		</>
	)
}

test('verify cmd + k opens search', () => {
	const onOpen = jest.fn()
	render(<Harness onOpen={onOpen} />)

	const event = fireEvent.keyDown(document, { key: 'k', metaKey: true })

	expect(onOpen).toHaveBeenCalledTimes(1)
	// the browser's own ctrl/cmd + k (focus the address bar search) is suppressed
	expect(event).toBe(false)
})

test('verify ctrl + k opens search', () => {
	const onOpen = jest.fn()
	render(<Harness onOpen={onOpen} />)

	fireEvent.keyDown(document, { key: 'K', ctrlKey: true })

	expect(onOpen).toHaveBeenCalledTimes(1)
})

test('verify slash opens search when the user is not typing', () => {
	const onOpen = jest.fn()
	render(<Harness onOpen={onOpen} />)

	fireEvent.keyDown(document.body, { key: '/' })

	expect(onOpen).toHaveBeenCalledTimes(1)
})

test('verify slash is left alone while the user types in a field', () => {
	const onOpen = jest.fn()
	const { getByLabelText } = render(<Harness onOpen={onOpen} />)

	fireEvent.keyDown(getByLabelText('name'), { key: '/' })
	fireEvent.keyDown(getByLabelText('notes'), { key: '/' })

	expect(onOpen).not.toHaveBeenCalled()
})

test('verify plain k does not open search', () => {
	const onOpen = jest.fn()
	render(<Harness onOpen={onOpen} />)

	fireEvent.keyDown(document.body, { key: 'k' })

	expect(onOpen).not.toHaveBeenCalled()
})
