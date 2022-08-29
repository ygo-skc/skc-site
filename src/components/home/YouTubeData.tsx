import { useEffect, useState, lazy, FC } from 'react'

import YouTubeUploads from '../util/social/YouTubeUploads'
import DownstreamServices from '../../helper/DownstreamServices'
import FetchHandler from '../../helper/FetchHandler'

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
	const [errFetchingData, setErrFetchingData] = useState(false)

	useEffect(() => {
		FetchHandler.handleFetch(
			`${DownstreamServices.HEART_API_HOST_NAME}/api/v1/yt/channel/uploads?channelId=${channelId}`,
			(json) => {
				setYoutubeUploadData(json.videos)
			},
			false
		)?.catch((_err) => {
			setErrFetchingData(true)
		})
	}, [])

	return (
		<div className={hasDarkBackground ? 'section-dark-background multi-section-middle' : 'multi-section-end'}>
			{errFetchingData ? (
				<GenericNonBreakingErr errExplanation='Come back at a different time to see recent YouTube uploads 🎥!' />
			) : (
				<YouTubeUploads youtubeData={youtubeUploadData} channelName={channelNames[channel]} channelId={channelId} channelDescription={channelDescription[channel]} />
			)}
		</div>
	)
}

export default YouTubeData
