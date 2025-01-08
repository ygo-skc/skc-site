import { Typography } from '@mui/material'
import { FC } from 'react'
import { decodeHTML } from 'entities'

const VideoInfoContainer: FC<YouTubeUploads> = ({ thumbnailImg, title, url }) => {
	return (
		<a href={url} className='aggregate-anchor yt-video-info-container'>
			<div className='yt-video-image-container'>
				<img className='yt-video-image' src={thumbnailImg.src} alt={`Thumbnail for video ${url}`} width='100%' height='auto' loading='lazy' />
			</div>

			<div className='yt-video-info-sub-container'>
				<Typography className='yt-video-title' variant='h6'>
					{decodeHTML(title)}
				</Typography>
			</div>
		</a>
	)
}

export default VideoInfoContainer
