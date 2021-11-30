import React, {useEffect, useState} from 'react'
import { Typography } from '@mui/material'
import { Skeleton } from '@mui/material'

import { RightBoxHeaderTypography, RightBoxSubHeaderTypography } from '../grid/OneThirdTwoThirdsGrid'

import VideoInfoContainer from './VideoInfoContainer'
import Link from '../Link'


export default function YouTubeUploads({ youtubeData })
{
	const [videos, setVideos] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
			if (youtubeData !== undefined)
			{
				setVideos(youtubeData.videos.map(item => {
					const img = new Image()
					img.src = item.thumbnailUrl
					return(
						<VideoInfoContainer
							thumbnailImg={img}
							title={item.title}
							description={item.description}
							url={item.url}
						/>
					)
				}))
				setIsLoading(false)
			}
	}, [youtubeData])


	return(
		<div >
			<RightBoxSubHeaderTypography variant='h5'>
				Catch Up On Previous Uploads
			</RightBoxSubHeaderTypography>

			<Typography variant='subtitle2' >
				Most recent uploads for <Link color='secondary' href='https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ'>Supreme King YT</Link>
			</Typography>
			<br />

			{(isLoading === true)
				? <Skeleton width='100%' height='24rem' style={{transform: 'none', borderRadius: '2rem'}} />:
				<div style={{display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'auto', overflowX: 'scroll', maxWidth: '100%'}}>
					{videos}
				</div>
			}

		</div>
	)
}