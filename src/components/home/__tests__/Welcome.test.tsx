import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import Welcome from '../Welcome'
import MuiTheme from '../../MuiTheme'

const renderWelcome = () =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<Welcome />
			</MemoryRouter>
		</ThemeProvider>
	)

test('the pitch is a level 2 heading the section can be labelled by', () => {
	renderWelcome()

	const heading = screen.getByRole('heading', { level: 2, name: 'A Yu-Gi-Oh! database that stays out of your way.' })
	expect(heading).toHaveAttribute('id', 'welcome__title')
})

test('the promises are listed as chips', () => {
	renderWelcome()

	expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['No ads', 'No trackers', 'Updated every ban list'])
})

test('the about pill links to the about page', () => {
	renderWelcome()

	expect(screen.getByRole('link', { name: 'About the site' })).toHaveAttribute('href', '/about')
})
