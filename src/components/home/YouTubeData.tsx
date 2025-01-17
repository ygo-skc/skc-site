import '../../css/util/youtube-data.css'

import { useEffect, useState, lazy, FC, startTransition, Suspense } from 'react'

import DownstreamServices from '../../helper/DownstreamServices'
import FetchHandler from '../../helper/FetchHandler'
import { Skeleton } from '@mui/material'

const GenericNonBreakingErr = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.GenericNonBreakingErr }
	})
)
const YouTubeUploads = lazy(() => import('../util/social/YouTubeUploads'))

type UploadsResponse = {
	videos: HeartAPI.YouTubeUpload[]
	total: number
}

export enum YouTubeChannelID {
	SKC = 'SKC',
	BTSC = 'BTSC',
}

const validChannelIds = new Map<YouTubeChannelID, string>([
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

const YouTubeData: FC<{ channel: YouTubeChannelID }> = ({ channel }) => {
	const channelId = validChannelIds.get(channel)
	const [youtubeUploadData, setYoutubeUploadData] = useState<HeartAPI.YouTubeUpload[]>([])
	const [isFetchingData, setIsFetchingData] = useState(true)
	const [errFetchingData, setErrFetchingData] = useState(false)

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch<UploadsResponse>(
				`${DownstreamServices.HEART_API_ENDPOINTS.ytUploads}?channelId=${channelId}`,
				(json) => {
					setYoutubeUploadData(json.videos)
					setIsFetchingData(false)
				},
				false
			)?.catch(() => {
				setErrFetchingData(true)
				setIsFetchingData(false)
			})
		})
	}, [])

	return (
		<Suspense fallback={<Skeleton variant='rectangular' height='375px' width='100%' className='rounded-skeleton' />}>
			{!isFetchingData && (
				<YouTubeUploads
					youtubeData={youtubeUploadData}
					channelName={channelNames.get(channel)!}
					channelId={channelId!.toString()}
					channelDescription={channelDescription.get(channel)!}
				/>
			)}
			{!isFetchingData && errFetchingData && <GenericNonBreakingErr errExplanation='Come back at a different time to see recent YouTube uploads 🎥!' />}
			{isFetchingData && <Skeleton variant='rectangular' height='375' width='100%' className='rounded-skeleton' />}
		</Suspense>
	)
}

export default YouTubeData
