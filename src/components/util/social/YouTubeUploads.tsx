import { FC, useEffect, useState } from 'react'
import { Typography, Link } from '@mui/material'
import { Skeleton } from '@mui/material'

import { RightBoxSubHeaderTypography } from '../grid/OneThirdTwoThirdsGrid'

import VideoInfoContainer from './VideoInfoContainer'

import '../../../css/util/link.css'

const YouTubeUploads: FC<{ youtubeData: HeartApiYouTubeUpload[] }> = ({ youtubeData }) => {
	const [videos, setVideos] = useState<JSX.Element[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (youtubeData !== undefined) {
			setVideos(
				youtubeData.map((item: HeartApiYouTubeUpload) => {
					const img = new Image()
					img.src = item.thumbnailUrl
					return <VideoInfoContainer thumbnailImg={img} title={item.title} url={item.url} />
				})
			)
			setIsLoading(false)
		}
	}, [youtubeData])

	return (
		<div>
			<RightBoxSubHeaderTypography variant='h5'>Catch Up On Previous Uploads</RightBoxSubHeaderTypography>

			<Typography variant='subtitle2'>
				Most recent uploads for{' '}
				<Link className='link' color='secondary' href='https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ'>
					Supreme King YT
				</Link>
			</Typography>
			<br />

			{isLoading === true ? (
				<Skeleton width='100%' height='24rem' style={{ transform: 'none', borderRadius: '2rem' }} />
			) : (
				<div style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'auto', overflowX: 'scroll', maxWidth: '100%' }}>{videos}</div>
			)}
		</div>
	)
}

export default YouTubeUploads
