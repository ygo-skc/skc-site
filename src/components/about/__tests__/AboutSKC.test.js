import { cleanup, render, screen } from '@testing-library/react'
import AboutSKC from '../AboutSKC'

afterEach(() => {
	cleanup()
})

test('should render AboutSKC component', () => {
	render(<AboutSKC />)
	const aboutSKCElement = screen.getByTestId('about-skc')

	expect(aboutSKCElement).toBeInTheDocument()
	expect(aboutSKCElement).toHaveTextContent('Why I Started The Project')
})
