import { render } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import Privacy from '../Privacy'
import MuiTheme from '../../MuiTheme'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	Section: ({ sectionName, children }: { sectionName: string; children: React.ReactNode }) => <section aria-label={sectionName}>{children}</section>,
}))

test('describes the page in a description meta tag', () => {
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<Privacy />
			</MemoryRouter>
		</ThemeProvider>
	)

	expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', 'Privacy policy for site and mobile app')
})
