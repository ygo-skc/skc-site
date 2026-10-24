import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import AboutSKC from '../AboutSKC'
import MuiTheme from '../../MuiTheme'

afterEach(() => {
	cleanup()
})

test('should render AboutSKC component', () => {
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<AboutSKC />
			</MemoryRouter>
		</ThemeProvider>
	)
	const aboutSKCElement = screen.getByTestId('about-skc')

	expect(aboutSKCElement).toBeInTheDocument()
	expect(aboutSKCElement).toHaveTextContent('Why I Started The Project')
})

test('should show one topic at a time, switched by the segmented control', () => {
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<AboutSKC />
			</MemoryRouter>
		</ThemeProvider>
	)

	expect(screen.getByRole('button', { name: 'My Background' })).toHaveAttribute('aria-pressed', 'true')
	expect(screen.getByText(/I started playing Yu-Gi-Oh!/)).toBeInTheDocument()
	expect(screen.queryByText(/In short, I thought/)).not.toBeInTheDocument()

	fireEvent.click(screen.getByRole('button', { name: 'Future Features' }))

	expect(screen.getByRole('button', { name: 'Future Features' })).toHaveAttribute('aria-pressed', 'true')
	expect(screen.getByText(/I have some more plans/)).toBeInTheDocument()
	expect(screen.queryByText(/I started playing Yu-Gi-Oh!/)).not.toBeInTheDocument()
})
