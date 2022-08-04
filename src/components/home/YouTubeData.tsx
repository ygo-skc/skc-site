import { useEffect, useState, lazy, FC } from 'react'

import YouTubeUploads from '../util/social/YouTubeUploads'
import DownstreamServices from '../../helper/DownstreamServices'
import Fetch from '../../helper/FetchHandler'

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

const YouTubeData: FC<_YouTubeData> = ({ channel, hasDarkBackground }) => {
	const channelId = channelIds[channel]
	const [youtubeUploadData, setYoutubeUploadData] = useState<HeartApiYouTubeUpload[]>([])
	const [errFetchingData, setErrFetchingData] = useState(false)

	useEffect(() => {
		Fetch.handleFetch(
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
				<YouTubeUploads youtubeData={youtubeUploadData} channelName={channelNames[channel]} channelId={channelId} />
			)}
		</div>
	)
}

export default YouTubeData
