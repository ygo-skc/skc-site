import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import NavigationBar from '../NavigationBar'
import MuiTheme from '../../MuiTheme'
import AppRoutes from '../../../helper/AppRoutes'

// Messages fetches from the heart api on mount - not what these tests are about
jest.mock('../Messages', () => ({
	__esModule: true,
	default: () => <button type='button'>Messages</button>,
}))

function renderNavigationBar() {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={[AppRoutes.BanList]}>
				<NavigationBar />
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('verify brand links back to home', () => {
	renderNavigationBar()

	expect(screen.getByRole('link', { name: 'SKC home' })).toHaveAttribute('href', AppRoutes.Home)
})

test('verify social destinations are real links opening in a new tab', () => {
	renderNavigationBar()

	const youTube = screen.getByRole('link', { name: 'SKC on YouTube' })
	const gitHub = screen.getByRole('link', { name: 'SKC on GitHub' })

	expect(youTube).toHaveAttribute('href', 'https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ')
	expect(gitHub).toHaveAttribute('href', 'https://github.com/YGO-SKC/skc-site')
	;[youTube, gitHub].forEach((link) => {
		expect(link).toHaveAttribute('target', '_blank')
		expect(link).toHaveAttribute('rel', 'noopener noreferrer')
	})
})

test('verify navigation bar is a labelled landmark with decorative scenery hidden', () => {
	const { container } = renderNavigationBar()

	expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
	expect(container.querySelector('.site-nav__scene')).toHaveAttribute('aria-hidden', 'true')
})
