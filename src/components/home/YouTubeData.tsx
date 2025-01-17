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
	[YouTubeChannelID.SKC, 'Yu-Gi-Oh! product unboxing, market watch and other commentary. Generally, we just have fun in this channel. This is my main YouTube channel.'],
	[YouTubeChannelID.BTSC, 'This is my secondary channel. Really, I only upload here if I see an interesting Pokemon TCG product I want to open.'],
])
const YouTubeData: FC<{ channel: YouTubeChannelID; uploadsData: APIRequest<HeartAPI.YouTubeUploadsResponse> }> = ({ channel, uploadsData }) => {
	const channelId = channelIDs.get(channel)

	return (
		<Suspense fallback={<Skeleton variant='rectangular' height='375px' width='100%' className='rounded-skeleton' />}>
			{!uploadsData.isFetchingData && (
				<YouTubeUploads
					youtubeData={uploadsData.videos}
					channelName={channelNames.get(channel)!}
					channelId={channelId!.toString()}
					channelDescription={channelDescription.get(channel)!}
				/>
			)}
			{!uploadsData.isFetchingData && uploadsData.requestHasError && <GenericNonBreakingErr errExplanation='Come back at a different time to see recent YouTube uploads 🎥!' />}
			{uploadsData.isFetchingData && <Skeleton variant='rectangular' height='375' width='100%' className='rounded-skeleton' />}
		</Suspense>
	)
}

export default YouTubeData
