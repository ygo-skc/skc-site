import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import AboutInfoCard from '../AboutInfoCard'
import MuiTheme from '../../MuiTheme'

// skc-rcl pulls in esm only chart libraries - only its photo link is used here
jest.mock('skc-rcl', () => ({
	LinkPhoto: ({ imageName }: { imageName: string }) => <img alt={imageName} />,
}))

function renderCard() {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<AboutInfoCard title='SKC API' subtitle='The Backend' body={<p>How data is retrieved</p>} imgName='backend.png' imgLink='https://example.com' />
		</ThemeProvider>
	)
}

test('verify card title sits a level below the section heading', () => {
	renderCard()

	expect(screen.getByRole('heading', { level: 5, name: 'SKC API' })).toBeInTheDocument()
})

test('verify subtitle is a label rather than another heading', () => {
	renderCard()

	expect(screen.getByText('The Backend').tagName).toBe('P')
	expect(screen.getAllByRole('heading')).toHaveLength(1)
})

test('verify card is grouped as an article named by its title', () => {
	renderCard()

	expect(screen.getByRole('article', { name: 'SKC API' })).toHaveTextContent('How data is retrieved')
})

test('verify title and subtitle take their look from theme typography variants', () => {
	renderCard()

	expect(screen.getByRole('heading', { name: 'SKC API' })).toHaveClass('MuiTypography-h5')
	expect(screen.getByText('The Backend')).toHaveClass('MuiTypography-subtitle2')
})
