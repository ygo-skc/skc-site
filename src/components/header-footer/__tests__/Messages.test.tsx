import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import Messages from '../Messages'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

// react-markdown ships as esm only, which jest can't load - rendering markdown isn't what these tests are about
jest.mock('react-markdown', () => ({
	__esModule: true,
	default: ({ children }: { children: string }) => <div>{children}</div>,
}))

// skc-rcl pulls in esm only chart libraries - only its error message is used here
jest.mock('skc-rcl', () => ({
	GenericNonBreakingErr: ({ errExplanation }: { errExplanation: string }) => <p>{errExplanation}</p>,
}))

const messages: HeartAPI.MessageInstance[] = [
	{
		title: 'Mobile App Feature Parity',
		content: 'Trending is **here**.',
		tags: ['status', 'skc-site'],
		createdAt: '2025-01-27T01:25:13.051Z',
		updatedAt: '2025-01-27T01:25:13.051Z',
	},
	{ title: 'Search by Card ID', content: 'Search supports IDs.', tags: ['status'], createdAt: '2024-10-31T03:31:28.062Z', updatedAt: '2024-10-31T03:31:28.062Z' },
]

beforeEach(() => {
	// the second message was the newest one seen on the last visit, so only the first is new
	localStorage.setItem('previousNewestMessage', messages[1].createdAt)
})

afterEach(() => {
	jest.restoreAllMocks()
	localStorage.clear()
})

function renderMessages() {
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(<T,>(_endPoint: string, onJsonReceived: (res: T) => void) => {
		onJsonReceived({ service: 'skc', messages } as T)
		return Promise.resolve()
	})

	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<Messages />
			</MemoryRouter>
		</ThemeProvider>
	)
}

async function openMessages() {
	fireEvent.click(await screen.findByRole('button', { name: 'Messages, 1 new' }))
	return screen.getByRole('region', { name: "What's new on SKC" })
}

test('verify bell announces how many messages are new', async () => {
	renderMessages()

	expect(await screen.findByRole('button', { name: 'Messages, 1 new' })).toBeInTheDocument()
})

test('verify popup lists every message newest first with its date', async () => {
	renderMessages()
	const popup = await openMessages()

	const posts = within(popup).getAllByRole('listitem')
	expect(posts).toHaveLength(2)
	expect(within(posts[0]).getByRole('heading', { name: 'Mobile App Feature Parity' })).toBeInTheDocument()
	expect(posts[0].querySelector('time')).toHaveAttribute('dateTime', messages[0].createdAt)
	expect(within(posts[1]).getByRole('heading', { name: 'Search by Card ID' })).toBeInTheDocument()
})

test('verify only messages since the last visit are flagged new', async () => {
	renderMessages()
	const popup = await openMessages()

	const [newest, seen] = within(popup).getAllByRole('listitem')
	expect(within(newest).getByText('New')).toBeInTheDocument()
	expect(within(seen).queryByText('New')).not.toBeInTheDocument()
})

test('verify closing the popup marks every message as seen', async () => {
	renderMessages()
	await openMessages()

	fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape' })

	expect(await screen.findByRole('button', { name: 'Messages' })).toBeInTheDocument()
	expect(localStorage.getItem('previousNewestMessage')).toBe(messages[0].createdAt)
})
