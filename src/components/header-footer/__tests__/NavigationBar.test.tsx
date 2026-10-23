import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import NavigationBar from '../NavigationBar'
import MuiTheme from '../../MuiTheme'
import AppRoutes from '../../../helper/AppRoutes'
import { SiteSearchProvider } from '../../util/search/SiteSearch'

// the search popup shows skc-rcl's card preview - skc-rcl pulls in esm only chart libraries jest can't load
jest.mock('skc-rcl', () => ({ YGOCardPreview: () => null }))

// Messages fetches from the heart api on mount - not what these tests are about
jest.mock('../Messages', () => ({
	__esModule: true,
	default: () => <button type='button'>Messages</button>,
}))

function renderNavigationBar() {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={[AppRoutes.BanList]}>
				<SiteSearchProvider>
					<NavigationBar />
				</SiteSearchProvider>
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

test('verify navigation bar is a labelled landmark', () => {
	renderNavigationBar()

	expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
})

test('verify the search button opens site search', async () => {
	renderNavigationBar()

	const button = screen.getByRole('button', { name: 'Search cards' })
	expect(button).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K /')
	fireEvent.click(button)

	expect(await screen.findByRole('combobox', { name: 'Search cards' })).toHaveFocus()
})

test('verify the keyboard shortcut opens site search from any page', async () => {
	renderNavigationBar()

	fireEvent.keyDown(document, { key: 'k', ctrlKey: true })

	expect(await screen.findByRole('combobox', { name: 'Search cards' })).toBeInTheDocument()
})
