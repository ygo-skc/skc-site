import { useEffect, useState, lazy, FC, startTransition } from 'react'

import YouTubeUploads from '../util/social/YouTubeUploads'
import DownstreamServices from '../../helper/DownstreamServices'
import FetchHandler from '../../helper/FetchHandler'
import { Skeleton } from '@mui/material'

const GenericNonBreakingErr = lazy(() => import('../util/exception/GenericNonBreakingErr'))

type _YouTubeData = {
	channel: 'skc' | 'btsc'
	hasDarkBackground: boolean
}

const channelIds = {
	skc: 'UCBZ_1wWyLQI3SV9IgLbyiNQ',
	btsc: 'UCu0LlZ527i4NcXNhru67D1Q',
}

const channelNames = {
	skc: 'Supreme King YT',
	btsc: 'Blaziken The Spicy Chicken',
}

const channelDescription = {
	skc: 'Yu-Gi-Oh! product unboxing, market watch and other commentary. Generally, we just have fun in this channel. This is my main YouTube channel.',
	btsc: 'This is my secondary channel. Really, I only upload here if I see an interesting Pokemon TCG product I want to open.',
}

const YouTubeData: FC<_YouTubeData> = ({ channel, hasDarkBackground }) => {
	const channelId = channelIds[channel]
	const [youtubeUploadData, setYoutubeUploadData] = useState<HeartApiYouTubeUpload[]>([])
	const [isFetchingData, setIsFetchingData] = useState(true)
	const [errFetchingData, setErrFetchingData] = useState(false)

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch(
				`${DownstreamServices.HEART_API_HOST_NAME}/api/v1/yt/channel/uploads?channelId=${channelId}`,
				(json) => {
					setYoutubeUploadData(json.videos)
					setIsFetchingData(false)
				},
				false
			)?.catch((_err) => {
				setErrFetchingData(true)
				setIsFetchingData(false)
			})
		})
	}, [])

	return (
		<div className={hasDarkBackground ? 'section-dark-background multi-section-middle' : 'multi-section-end'}>
			{!isFetchingData && (
				<YouTubeUploads youtubeData={youtubeUploadData} channelName={channelNames[channel]} channelId={channelId} channelDescription={channelDescription[channel]} />
			)}
			{!isFetchingData && errFetchingData && <GenericNonBreakingErr errExplanation='Come back at a different time to see recent YouTube uploads 🎥!' />}
			{isFetchingData && <Skeleton variant='rectangular' height='375' width='100%' className='rounded-skeleton' />}
		</div>
	)
}

export default YouTubeData
