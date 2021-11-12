import { useEffect, useState } from 'react'
import YouTubeUploads from '../util/social/YouTubeUploads'

import { handleFetch } from '../../helper/FetchHandler'
import {HEART_API_HOST_NAME} from '../../helper/DownstreamServices'

export default function YouTubeData() {
	const [youtubeData, setYoutubeData] = useState(undefined)

	useEffect(() => {
		handleFetch(`${HEART_API_HOST_NAME}/api/v1/yt/channel/uploads?channelId=UCBZ_1wWyLQI3SV9IgLbyiNQ`, json => {
			setYoutubeData(json)
		})
	}, [])

	return(
		<div style={{maxWidth: '100%', background: '#FAFAFA', paddingLeft: '.8rem', paddingRight: '.8rem', paddingTop: '1.5rem', paddingBottom: '1.5rem', borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem' }} >
			<div >
				<YouTubeUploads youtubeData={youtubeData} />
			</div>
		</div>
	)
}