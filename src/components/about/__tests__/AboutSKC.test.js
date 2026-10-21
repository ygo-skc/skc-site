import { cleanup, render, screen } from '@testing-library/react'
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
