import { render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import DiscordPresence, { DISCORD_WIDGET, MAX_MEMBERS } from '../DiscordPresence'
import MuiTheme from '../../../MuiTheme'

const widget = {
	instant_invite: 'https://discord.com/invite/3adG4NGb',
	presence_count: 3,
	channels: [
		{ id: '997292880987168778', name: 'League!' },
		{ id: '1330249591781720125', name: 'yugioh-chat' },
	],
	members: [
		{ id: '0', username: 'GLIZZY PETE', avatar_url: 'https://cdn.discordapp.com/widget-avatars/a', status: 'idle', game: { name: 'RuneLite' } },
		{ id: '1', username: 'itsMiho', avatar_url: 'https://cdn.discordapp.com/widget-avatars/b', status: 'idle' },
		{ id: '2', username: 'Tersecrown', avatar_url: 'https://cdn.discordapp.com/widget-avatars/c', status: 'online', game: { name: 'WARDOGS' } },
	],
}

const respondWith = (response: Partial<Response>) => {
	global.fetch = jest.fn().mockResolvedValue({ ok: true, ...response }) as jest.Mock
}

const renderPresence = () =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<DiscordPresence />
		</ThemeProvider>
	)

test('the online count, channels and a join link to the invite', async () => {
	respondWith({ json: () => Promise.resolve(widget) })
	renderPresence()

	expect(await screen.findByRole('heading', { name: 'Join the Discord' })).toBeInTheDocument()
	expect(screen.getByText('3 online · #League! · #yugioh-chat')).toBeInTheDocument()

	const join = screen.getByRole('link', { name: 'Join' })
	expect(join).toHaveAttribute('href', widget.instant_invite)
	expect(join).toHaveAttribute('target', '_blank')
	expect(global.fetch).toHaveBeenCalledWith(DISCORD_WIDGET, expect.anything())
})

test('each member online with their status in words and what they are playing', async () => {
	respondWith({ json: () => Promise.resolve(widget) })
	renderPresence()

	const members = within(await screen.findByRole('list', { name: 'Members online' })).getAllByRole('listitem')
	expect(members).toHaveLength(3)
	expect(members[0]).toHaveTextContent('GLIZZY PETE, idle RuneLite')
	expect(members[2]).toHaveTextContent('Tersecrown, online WARDOGS')
	expect(screen.queryByText(/more online/)).not.toBeInTheDocument()
})

test('shows a few members and counts the rest', async () => {
	const members = Array.from({ length: 12 }, (_, i) => ({ id: `${i}`, username: `Member ${i}`, avatar_url: '', status: 'online' }))
	respondWith({ json: () => Promise.resolve({ ...widget, presence_count: 12, members }) })
	renderPresence()

	expect(within(await screen.findByRole('list', { name: 'Members online' })).getAllByRole('listitem')).toHaveLength(MAX_MEMBERS)
	expect(screen.getByText(`+${12 - MAX_MEMBERS} more online`)).toBeInTheDocument()
})

test('still invites people when nobody is online', async () => {
	respondWith({ json: () => Promise.resolve({ ...widget, presence_count: 0, members: [] }) })
	renderPresence()

	expect(await screen.findByText('Nobody online right now · #League! · #yugioh-chat')).toBeInTheDocument()
	expect(screen.getByRole('link', { name: 'Join' })).toBeInTheDocument()
	expect(screen.queryByRole('list')).not.toBeInTheDocument()
})

test('holds its place with a skeleton while the widget loads', async () => {
	global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock
	renderPresence()

	expect(screen.getByTestId('discord-presence-skeleton')).toHaveAttribute('aria-hidden', 'true')
	expect(screen.queryByRole('heading')).not.toBeInTheDocument()
})

test('hidden when the widget is turned off', async () => {
	respondWith({ ok: false, status: 403 })
	const { container } = renderPresence()

	// the skeleton gives way to nothing
	await waitFor(() => expect(container).toBeEmptyDOMElement())
})
