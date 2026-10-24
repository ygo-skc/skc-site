import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import AppBanner, { APP_BANNER_DISMISSED_KEY } from '../AppBanner'
import MuiTheme from '../../MuiTheme'
import { IOS_APP_STORE_URL } from '../../../helper/IOSApp'

const SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1'
const CHROME = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.41 Mobile/15E148 Safari/604.1'

function renderAs(userAgent: string) {
	jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
	return render(
		<ThemeProvider theme={MuiTheme}>
			<AppBanner />
		</ThemeProvider>
	)
}

afterEach(() => {
	jest.restoreAllMocks()
	localStorage.clear()
})

test('verify Chrome on iPhone gets a banner linking to the App Store', () => {
	renderAs(CHROME)

	const banner = screen.getByRole('complementary', { name: 'SKC iOS app' })
	expect(banner).toBeInTheDocument()
	expect(screen.getByRole('link', { name: 'Get' })).toHaveAttribute('href', IOS_APP_STORE_URL)
	// iOS hands App Store links to the App Store app, so a new tab would only be left empty
	expect(screen.getByRole('link', { name: 'Get' })).not.toHaveAttribute('target')
})

test('verify Safari gets no banner since it shows its own Smart App Banner', () => {
	renderAs(SAFARI)

	expect(screen.queryByRole('complementary', { name: 'SKC iOS app' })).not.toBeInTheDocument()
})

test('verify dismissing the banner hides it and keeps it hidden', () => {
	const { unmount } = renderAs(CHROME)

	fireEvent.click(screen.getByRole('button', { name: 'Dismiss app banner' }))
	expect(screen.queryByRole('complementary', { name: 'SKC iOS app' })).not.toBeInTheDocument()
	expect(localStorage.getItem(APP_BANNER_DISMISSED_KEY)).toBe('true')

	unmount()
	renderAs(CHROME)
	expect(screen.queryByRole('complementary', { name: 'SKC iOS app' })).not.toBeInTheDocument()
})
