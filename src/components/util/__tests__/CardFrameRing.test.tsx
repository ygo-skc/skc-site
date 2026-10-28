import { render } from '@testing-library/react'

import CardFrameRing from '../CardFrameRing'

test('rings the art in its frame colour with rcl frame class', () => {
	const { container } = render(
		<CardFrameRing cardColor='Pendulum-Effect'>
			<img alt='' />
		</CardFrameRing>
	)

	expect(container.firstChild).toHaveClass('card-frame-ring', 'pendulum-effect-ygo-card-style')
	expect(container.querySelector('.card-frame-ring > img')).toBeInTheDocument()
})

test('leaves the art bare without a card colour', () => {
	const { container } = render(
		<CardFrameRing>
			<img alt='' />
		</CardFrameRing>
	)

	expect(container.querySelector('.card-frame-ring')).not.toBeInTheDocument()
	expect(container.querySelector('img')).toBeInTheDocument()
})
