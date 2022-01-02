import { useEffect, useState, lazy } from 'react'

import YouTubeUploads from '../util/social/YouTubeUploads'
import DownstreamServices from '../../helper/DownstreamServices'
import Fetch from '../../helper/FetchHandler'

const GenericNonBreakingErr = lazy(() => import('../util/exception/GenericNonBreakingErr'))

export default function YouTubeData() {
	const [youtubeData, setYoutubeData] = useState<HeartApiYouTubeUpload[]>([])
	const [errFetchingData, setErrFetchingData] = useState(false)

	useEffect(() => {
		Fetch.handleFetch(
			`${DownstreamServices.HEART_API_HOST_NAME}/api/v1/yt/channel/uploads?channelId=UCBZ_1wWyLQI3SV9IgLbyiNQ`,
			(json) => {
				setYoutubeData(json.videos)
			},
			false
		)?.catch((_err) => {
			setErrFetchingData(true)
		})
	}, [])

	return (
		<div className='section-content section-content-dark'>
			{errFetchingData ? (
				<GenericNonBreakingErr errExplanation='No meaningful impact to the site functionality expected. Come back at a different time to see recent YouTube uploads 🎥!' />
			) : (
				<YouTubeUploads youtubeData={youtubeData} />
			)}
		</div>
	)
}
