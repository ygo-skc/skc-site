import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import YouTubeUploads from '../YouTubeUploads'
import MuiTheme from '../../../MuiTheme'

const renderUploads = (props: { isLoading: boolean; youtubeData?: HeartAPI.YouTubeUpload[] }) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<YouTubeUploads channelName='Supreme King YT' channelId='UC1' channelDescription='Unboxings and market watch.' {...props} />
		</ThemeProvider>
	)

test('the channel shows while the uploads load, with video-card skeletons in their place', () => {
	renderUploads({ isLoading: true })

	expect(screen.getByText('Supreme King YT')).toBeInTheDocument()
	expect(screen.getByText('Unboxings and market watch.')).toBeInTheDocument()
	expect(screen.getByTestId('youtube-uploads-skeleton').children).toHaveLength(4)
	expect(screen.queryByRole('link', { name: /Thumbnail/ })).not.toBeInTheDocument()
})

test('the videos replace the skeleton once loaded', () => {
	renderUploads({
		isLoading: false,
		youtubeData: [{ id: '1', title: 'Pack opening', description: '', publishedAt: new Date(), thumbnailUrl: 'https://img/1.jpg', url: 'https://youtu.be/1' }],
	})

	expect(screen.queryByTestId('youtube-uploads-skeleton')).not.toBeInTheDocument()
	expect(screen.getByText('Pack opening')).toBeInTheDocument()
})

test('each video links by its title and shows when it was published', () => {
	renderUploads({
		isLoading: false,
		youtubeData: [{ id: '1', title: 'Pack opening', description: '', publishedAt: new Date(2026, 9, 20), thumbnailUrl: 'https://img/1.jpg', url: 'https://youtu.be/1' }],
	})

	const video = screen.getByRole('link', { name: /Pack opening/ })
	expect(video).toHaveAttribute('href', 'https://youtu.be/1')
	expect(video).toHaveTextContent('Oct 20, 2026')
})

test('a video with a bad date still shows, without the date', () => {
	renderUploads({
		isLoading: false,
		youtubeData: [{ id: '1', title: 'Pack opening', description: '', publishedAt: 'not a date' as unknown as Date, thumbnailUrl: 'https://img/1.jpg', url: 'https://youtu.be/1' }],
	})

	expect(screen.getByRole('link', { name: 'Pack opening' })).toBeInTheDocument()
	expect(document.querySelector('time')).toBeNull()
})

test('the subscribe pill opens the channel in a new tab', () => {
	renderUploads({ isLoading: true })

	const subscribe = screen.getByRole('link', { name: 'Subscribe' })
	expect(subscribe).toHaveAttribute('href', 'https://www.youtube.com/channel/UC1')
	expect(subscribe).toHaveAttribute('target', '_blank')
	expect(screen.getByRole('heading', { level: 3, name: 'Supreme King YT' })).toBeInTheDocument()
})

test('the channel icon replaces the initials when there is one', () => {
	const { container, rerender } = renderUploads({ isLoading: true })
	expect(container.querySelector('.yt-channel__avatar')).toHaveTextContent('SK')

	rerender(
		<ThemeProvider theme={MuiTheme}>
			<YouTubeUploads channelName='Supreme King YT' channelId='UC1' channelDescription='Unboxings and market watch.' channelAvatar='/assets/icon.jpeg' isLoading />
		</ThemeProvider>
	)
	expect(container.querySelector('.yt-channel__avatar img')).toHaveAttribute('src', '/assets/icon.jpeg')
})
