import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import { ElementType } from 'react'

import Messages from '../Messages'
import MessageItemComponent from '../MessageItemComponent'
import MessageRow from '../MessageRow'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

// react-markdown ships as esm only, which jest can't load - rendering markdown isn't what these tests are about
// a leading '# ' stands in for a markdown heading, rendered through the heading components the post passes in
jest.mock('react-markdown', () => ({
	__esModule: true,
	default: ({ children, components }: { children: string; components?: { h1?: ElementType } }) => {
		const Heading = components?.h1
		return Heading && children.startsWith('# ') ? <Heading>{children.slice(2)}</Heading> : <div>{children}</div>
	},
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
	{ title: 'Card of the Day', content: 'A new card every day.', tags: ['status'], createdAt: '2023-07-07T00:47:34.669Z', updatedAt: '2023-07-07T00:47:34.669Z' },
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

async function openMessages(bellName = 'Messages, 1 new') {
	fireEvent.click(await screen.findByRole('button', { name: bellName }))
	return screen.getByRole('region', { name: "What's new on SKC" })
}

test('verify bell announces how many messages are new', async () => {
	renderMessages()

	expect(await screen.findByRole('button', { name: 'Messages, 1 new' })).toBeInTheDocument()
})

test('verify new messages show in full and older ones fold into rows by year', async () => {
	renderMessages()
	const popup = await openMessages()

	expect(within(popup).getByText('1 new')).toBeInTheDocument()
	expect(within(popup).getByRole('heading', { level: 3, name: 'Mobile App Feature Parity' })).toBeInTheDocument()
	expect(within(popup).getByText('Trending is **here**.')).toBeInTheDocument()
	expect(within(popup).getByText('You’re caught up')).toBeInTheDocument()

	const year2024 = within(popup).getByRole('region', { name: '2024' })
	const row = within(year2024).getByRole('button', { name: /Search by Card ID/ })
	expect(row).toHaveAttribute('aria-expanded', 'false')
	expect(row.querySelector('time')).toHaveAttribute('dateTime', messages[1].createdAt)
	expect(within(popup).queryByText('Search supports IDs.')).not.toBeInTheDocument()
	expect(within(popup).getByRole('region', { name: '2023' })).toHaveTextContent('1 update')
})

test('verify only messages since the last visit are flagged new', async () => {
	renderMessages()
	const popup = await openMessages()

	const newest = within(popup).getByRole('heading', { name: 'Mobile App Feature Parity' }).closest('li') as HTMLElement
	expect(within(newest).getByText('New')).toBeInTheDocument()
	expect(within(popup).getAllByText('New')).toHaveLength(1)
})

test('verify opening a row shows the post under it', async () => {
	renderMessages()
	const popup = await openMessages()

	const row = within(popup).getByRole('button', { name: /Search by Card ID/ })
	fireEvent.click(row)

	expect(row).toHaveAttribute('aria-expanded', 'true')
	expect(document.getElementById(row.getAttribute('aria-controls') as string)).toHaveTextContent('Search supports IDs.')

	fireEvent.click(row)
	expect(within(popup).queryByText('Search supports IDs.')).not.toBeInTheDocument()
})

test('verify the latest message stays in full when nothing is new', async () => {
	localStorage.setItem('previousNewestMessage', messages[0].createdAt)
	renderMessages()
	const popup = await openMessages('Messages')

	expect(within(popup).getByText('You’re all caught up')).toBeInTheDocument()
	expect(within(popup).getByText('3 updates')).toBeInTheDocument()
	expect(within(popup).getByText('Trending is **here**.')).toBeInTheDocument()
	expect(within(popup).queryByText('New')).not.toBeInTheDocument()
	expect(within(popup).getByRole('button', { name: /Search by Card ID/ })).toHaveAttribute('aria-expanded', 'false')
})

test('verify only a post longer than the clip offers read more', async () => {
	// jsdom has no layout - make every body taller than it shows, as a long post would be
	jest.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(400)
	jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(120)
	renderMessages()
	const popup = await openMessages()

	const more = within(popup).getByRole('button', { name: 'Read more' })
	expect(more).toHaveAttribute('aria-expanded', 'false')
	const body = document.getElementById(more.getAttribute('aria-controls') as string)
	expect(body).toHaveClass('messages__body--clipped')

	fireEvent.click(more)

	expect(within(popup).getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true')
	expect(body).not.toHaveClass('messages__body--clipped')
})

test('verify a short post has no read more', async () => {
	renderMessages()
	const popup = await openMessages()

	expect(within(popup).queryByRole('button', { name: 'Read more' })).not.toBeInTheDocument()
})

test('verify closing the popup marks every message as seen', async () => {
	renderMessages()
	await openMessages()

	fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape' })

	expect(await screen.findByRole('button', { name: 'Messages' })).toBeInTheDocument()
	expect(localStorage.getItem('previousNewestMessage')).toBe(messages[0].createdAt)
})

test('verify markdown headings sit one level below their post title', async () => {
	render(
		<ThemeProvider theme={MuiTheme}>
			<ol>
				<MessageItemComponent message={{ ...messages[0], content: '# Full post heading' }} isNew={false} />
				<MessageRow message={{ ...messages[1], content: '# Row heading' }} />
			</ol>
		</ThemeProvider>
	)

	// full post titles are h3, so their headings are h4. row titles are h4, so an opened row's headings are h5
	expect(screen.getByRole('heading', { level: 4, name: 'Full post heading' })).toBeInTheDocument()
	fireEvent.click(screen.getByRole('button', { name: /Search by Card ID/ }))
	expect(screen.getByRole('heading', { level: 5, name: 'Row heading' })).toBeInTheDocument()
})
