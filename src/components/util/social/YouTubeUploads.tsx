import { FC, Fragment, JSX, useEffect, useState } from 'react'
import { Typography, Link, Skeleton } from '@mui/material'

import VideoInfoContainer from './VideoInfoContainer'

const YouTubeUploads: FC<{ youtubeData: HeartAPI.YouTubeUpload[]; channelName: string; channelId: string; channelDescription: string }> = ({
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
				youtubeData.map((item: HeartAPI.YouTubeUpload) => {
					const img = new Image()
					img.src = item.thumbnailUrl
					return <VideoInfoContainer key={item.title} thumbnailImg={img} title={item.title} url={item.url} />
				})
			)
			setIsLoading(false)
		}
	}, [youtubeData])

	return (
		<Fragment>
			<Typography variant='h5'>{channelName}</Typography>

			<Typography variant='h6'>Most Recent Uploads</Typography>

			<Typography variant='body1'>{channelDescription}</Typography>
			<br />
			<Typography>
				Go ahead and give it a{' '}
				<Link className='link' color='secondary' href={`https://www.youtube.com/channel/${channelId}`}>
					sub!
				</Link>
			</Typography>

			<br />
			{isLoading === true ? <Skeleton className='rounded-skeleton' width='100%' height='24rem' /> : <div className='yt-uploads-grid'>{videos}</div>}
		</Fragment>
	)
}

export default YouTubeUploads
