import React, {useEffect, useState} from 'react'
import { RightBoxHeaderTypography, RightBoxSubHeaderTypography } from './util/grid/OneThirdTwoThirdsGrid'

import VideoInfoContainer from './VideoInfoContainer'

import { handleFetch } from '../helper/FetchHandler'
import {HEART_API_HOST_NAME} from '../helper/DownstreamServices'
import {LeftBoxPaper} from './util/grid/OneThirdTwoThirdsGrid'


export default function YouTubeUploads({ history })
{
	const [videos, setVideos] = useState([])

	useEffect(() => {
		handleFetch(`${HEART_API_HOST_NAME}/v1/yt/channel/uploads?channelId=UCBZ_1wWyLQI3SV9IgLbyiNQ`, history, json => {
			setVideos(json.videos.map(item => {
				return(
					<VideoInfoContainer
						thumbnailUrl={item.thumbnailUrl}
						title={item.title}
						description={item.description}
						url={item.url}
					/>
				)
			}))
		})
	}, [])


	return(
		<LeftBoxPaper style={{marginBottom: '2.5rem', padding: '1.5rem', marginLeft: '1rem', marginRight: '1rem'}} >
			<RightBoxHeaderTypography variant='h4'>
				YouTube
			</RightBoxHeaderTypography>
			<RightBoxSubHeaderTypography variant='h5'>
				Catch Up On Previous Uploads
			</RightBoxSubHeaderTypography>

			<div style={{display: 'flex', maxWidth: '100%', overflowX: 'scroll'}}>
				{videos}
			</div>
		</LeftBoxPaper>
	)
}