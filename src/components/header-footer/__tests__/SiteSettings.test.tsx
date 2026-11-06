import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import SiteSettings from '../SiteSettings'
import MuiTheme from '../../MuiTheme'
import { ResultsViewProvider, usePageView } from '../../util/ResultsViewPreference'
import { ShortcutsProvider } from '../../util/ShortcutsPreference'
import useSearchShortcut from '../../util/search/useSearchShortcut'

// stands in for a results page - ban list style names, with its own toggle
function ResultsPage() {
	const [view, setView] = usePageView({ list: 'table', grid: 'cards' })
	return (
		<>
			<output>{view}</output>
			<button type='button' onClick={() => setView(view === 'table' ? 'cards' : 'table')}>
				Flip page view
			</button>
		</>
	)
}

function renderSettings() {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<ResultsViewProvider>
				<SiteSettings />
				<ResultsPage />
			</ResultsViewProvider>
		</ThemeProvider>
	)
}

function pickResultsView(name: 'List' | 'Grid') {
	fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
	fireEvent.click(screen.getByRole('button', { name }))
	fireEvent.keyDown(screen.getByRole('dialog', { name: 'Settings' }), { key: 'Escape' })
}

beforeEach(() => localStorage.clear())

test('verify pages open in list until a view is saved', () => {
	renderSettings()

	expect(screen.getByRole('status')).toHaveTextContent('table')
	fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
	expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
	expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true')
})

test('verify saving a view switches the open page and is remembered', () => {
	const { unmount } = renderSettings()

	pickResultsView('Grid')
	expect(screen.getByRole('status')).toHaveTextContent('cards')
	expect(localStorage.getItem('resultsView')).toBe('grid')

	unmount()
	renderSettings()
	expect(screen.getByRole('status')).toHaveTextContent('cards')
})

test('verify a page toggle does not change the saved view', () => {
	renderSettings()

	fireEvent.click(screen.getByRole('button', { name: 'Flip page view' }))
	expect(screen.getByRole('status')).toHaveTextContent('cards')
	expect(localStorage.getItem('resultsView')).toBeNull()

	// picking the saved view again brings the page back to it
	pickResultsView('Grid')
	pickResultsView('List')
	expect(screen.getByRole('status')).toHaveTextContent('table')
})

// stands in for the site's search shortcut, so the switch can be seen to take effect
function SearchShortcut({ onOpen }: { onOpen: () => void }) {
	useSearchShortcut(onOpen)
	return null
}

function renderShortcutSettings(onOpen = jest.fn()) {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<ShortcutsProvider>
				<SiteSettings />
				<SearchShortcut onOpen={onOpen} />
			</ShortcutsProvider>
		</ThemeProvider>
	)
}

test('verify single key shortcuts are on until turned off, and the sheet lists them', () => {
	renderShortcutSettings()
	fireEvent.click(screen.getByRole('button', { name: 'Settings' }))

	expect(screen.getByRole('heading', { level: 3, name: 'Keyboard' })).toBeInTheDocument()
	expect(screen.getByRole('switch', { name: 'Single-key shortcuts' })).toBeChecked()
	expect(screen.getByRole('switch', { name: 'Single-key shortcuts' })).toHaveAccessibleDescription(/speech input/)
	expect(screen.getAllByRole('definition').map((page) => page.textContent)).toEqual(['Search', 'Home', 'Ban List', 'Card Browse', 'Product Browse', 'About'])
	expect(screen.getAllByRole('term').map((keys) => keys.textContent)).toEqual(['/', 'g h', 'g b', 'g c', 'g p', 'g a'])
})

test('verify turning single key shortcuts off stops them right away and is remembered', () => {
	const onOpen = jest.fn()
	const { unmount } = renderShortcutSettings(onOpen)

	fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
	fireEvent.click(screen.getByRole('switch', { name: 'Single-key shortcuts' }))
	fireEvent.keyDown(screen.getByRole('dialog', { name: 'Settings' }), { key: 'Escape' })

	expect(localStorage.getItem('singleKeyShortcuts')).toBe('off')
	fireEvent.keyDown(document.body, { key: '/' })
	expect(onOpen).not.toHaveBeenCalled()

	unmount()
	renderShortcutSettings()
	fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
	expect(screen.getByRole('switch', { name: 'Single-key shortcuts' })).not.toBeChecked()
})
