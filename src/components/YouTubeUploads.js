import React, {useEffect, useState} from 'react'
import { RightBoxHeaderTypography, RightBoxSubHeaderTypography } from './util/grid/OneThirdTwoThirdsGrid'

import VideoInfoContainer from './VideoInfoContainer'

import { handleFetch } from '../helper/FetchHandler'
import {HEART_API_HOST_NAME} from '../helper/DownstreamServices'
import {LeftBoxPaper} from './util/grid/OneThirdTwoThirdsGrid'
import { Skeleton } from '@material-ui/lab'


export default function YouTubeUploads({ history })
{
	const [videos, setVideos] = useState([])
	const [isLoading, setIsLoading] = useState(true)

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

			setIsLoading(false)
		})
	}, [])


	return(
		<LeftBoxPaper style={{marginBottom: '2.5rem'}} >
			<RightBoxHeaderTypography variant='h4'>
				YouTube
			</RightBoxHeaderTypography>
			<RightBoxSubHeaderTypography variant='h5'>
				Catch Up On Previous Uploads
			</RightBoxSubHeaderTypography>

			{(isLoading === true)
				? <Skeleton width='100%' height='30rem' />:
				<div style={{display: 'flex', maxWidth: '100%', overflowX: 'scroll', paddingBottom: '.75rem'}}>
					{videos}
				</div>
			}

		</LeftBoxPaper>
	)
}