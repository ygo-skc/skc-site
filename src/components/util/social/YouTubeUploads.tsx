import { FC, JSX, useEffect, useState } from 'react'
import { Avatar, Button, Skeleton, Typography } from '@mui/material'

import VideoInfoContainer from './VideoInfoContainer'

// the channel in home's welcome sheet - name and a subscribe pill, then the latest uploads as a swipeable row
const YouTubeUploads: FC<{
	youtubeData?: HeartAPI.YouTubeUpload[]
	isLoading: boolean
	channelName: string
	channelId: string
	channelDescription: string
	channelAvatar?: string
}> = ({ youtubeData, isLoading, channelName, channelId, channelDescription, channelAvatar }) => {
	const [videos, setVideos] = useState<JSX.Element[]>([])

	useEffect(() => {
		if (youtubeData !== undefined) {
			setVideos(
				youtubeData.map((item: HeartAPI.YouTubeUpload) => {
					const img = new Image()
					img.src = item.thumbnailUrl
					return <VideoInfoContainer key={item.title} thumbnailImg={img} title={item.title} url={item.url} publishedAt={item.publishedAt} />
				})
			)
		}
	}, [youtubeData])

	const initials = channelName
		.split(' ')
		.slice(0, 2)
		.map((word) => word[0])
		.join('')

	return (
		<div className='yt-channel'>
			<div className='yt-channel__header'>
				{/* the initials show if there's no icon, or it fails to load */}
				<Avatar className='yt-channel__avatar' src={channelAvatar} alt='' aria-hidden='true'>
					{initials}
				</Avatar>
				<div className='yt-channel__name'>
					<Typography variant='h6' component='h3'>
						{channelName}
					</Typography>
					<Typography variant='body2' className='yt-channel__description'>
						{channelDescription}
					</Typography>
				</div>
				<Button className='yt-channel__subscribe' href={`https://www.youtube.com/channel/${channelId}`} target='_blank' rel='noopener noreferrer'>
					Subscribe
				</Button>
			</div>

			{isLoading ? (
				// video cards at their loaded size, so the row doesn't grow when the uploads arrive
				<div className='yt-uploads-grid' aria-hidden='true' data-testid='youtube-uploads-skeleton'>
					{[0, 1, 2, 3].map((i) => (
						// the card's own pieces - a 16:9 thumbnail, two title lines and the date - so it grows with the card's width
						<div key={i} className='yt-video'>
							<Skeleton className='yt-video__thumb' variant='rounded' />
							<Typography variant='body2'>
								<Skeleton width='100%' />
								<Skeleton width='70%' />
							</Typography>
							<Typography variant='caption'>
								<Skeleton width='6rem' />
							</Typography>
						</div>
					))}
				</div>
			) : (
				<div className='yt-uploads-grid'>{videos}</div>
			)}
		</div>
	)
}

export default YouTubeUploads
