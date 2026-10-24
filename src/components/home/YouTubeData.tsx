import '../../css/util/youtube-data.css'

import { lazy, FC, Suspense } from 'react'

import { Skeleton } from '@mui/material'

const GenericNonBreakingErr = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.GenericNonBreakingErr }
	})
)
const YouTubeUploads = lazy(() => import('../util/social/YouTubeUploads'))

export enum YouTubeChannelID {
	SKC = 'SKC',
	BTSC = 'BTSC',
}

export const channelIDs = new Map<YouTubeChannelID, string>([
	[YouTubeChannelID.SKC, 'UCBZ_1wWyLQI3SV9IgLbyiNQ'],
	[YouTubeChannelID.BTSC, 'UCu0LlZ527i4NcXNhru67D1Q'],
])

const channelNames = new Map<YouTubeChannelID, string>([
	[YouTubeChannelID.SKC, 'Supreme King YT'],
	[YouTubeChannelID.BTSC, 'Blaziken The Spicy Chicken'],
])

const channelDescription = new Map<YouTubeChannelID, string>([
	[YouTubeChannelID.SKC, 'Yu-Gi-Oh! product unboxing, market watch and other commentary.'],
	[YouTubeChannelID.BTSC, 'This is my secondary channel. Really, I only upload here if I see an interesting Pokemon TCG product I want to open.'],
])
// served from public/Img - the About page shows the same file
const channelAvatars = new Map<YouTubeChannelID, string>([[YouTubeChannelID.SKC, '/assets/yt_channel_icon.jpeg']])

const YouTubeData: FC<{ channel: YouTubeChannelID; uploadsData: APIRequest<HeartAPI.YouTubeUploadsResponse> }> = ({ channel, uploadsData }) => {
	const channelId = channelIDs.get(channel)

	return (
		<Suspense fallback={<Skeleton variant='rectangular' height='375px' width='100%' className='rounded-skeleton' />}>
			{/* the channel's name and description don't need the api, so only the videos wait */}
			<YouTubeUploads
				youtubeData={uploadsData.videos}
				isLoading={uploadsData.isFetchingData}
				channelName={channelNames.get(channel)!}
				channelId={channelId!.toString()}
				channelDescription={channelDescription.get(channel)!}
				channelAvatar={channelAvatars.get(channel)}
			/>
			{!uploadsData.isFetchingData && uploadsData.requestHasError && <GenericNonBreakingErr errExplanation='Come back at a different time to see recent YouTube uploads 🎥!' />}
		</Suspense>
	)
}

export default YouTubeData
