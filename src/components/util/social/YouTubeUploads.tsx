import { FC, useEffect, useState } from 'react'
import { Typography, Link, Skeleton } from '@mui/material'

import VideoInfoContainer from './VideoInfoContainer'

const YouTubeUploads: FC<{ youtubeData: HeartApiYouTubeUpload[]; channelName: string; channelId: string; channelDescription: string }> = ({
	youtubeData,
	channelName,
	channelId,
	channelDescription,
}) => {
	const [videos, setVideos] = useState<JSX.Element[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (youtubeData !== undefined) {
			setVideos(
				youtubeData.map((item: HeartApiYouTubeUpload) => {
					const img = new Image()
					img.src = item.thumbnailUrl
					return <VideoInfoContainer key={item.title} thumbnailImg={img} title={item.title} url={item.url} />
				})
			)
			setIsLoading(false)
		}
	}, [youtubeData])

	return (
		<div>
			<Typography variant='h5'>Most recent video uploads For Channel - {channelName}</Typography>

			<Typography variant='h6'>{channelDescription}</Typography>

			<Typography variant='subtitle2'>
				Go ahead and give it a{' '}
				<Link className='link' color='secondary' href={`https://www.youtube.com/channel/${channelId}`}>
					sub!
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
