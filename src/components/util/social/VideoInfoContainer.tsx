import { Typography } from '@mui/material'
import { FC } from 'react'
import { decodeHTML } from 'entities'

const VideoInfoContainer: FC<_YouTubeUploads> = ({ thumbnailImg, title, url }) => {
	return (
		<div className='yt-video-info-container'>
			<div className='yt-yt-video-image-container'>
				<a href={url}>
					<img className='yt-video-image' src={thumbnailImg.src} alt={`Thumbnail for video ${url}`} width='100%' height='auto' loading='lazy' />
				</a>
			</div>

			<div className='yt-video-info-sub-container'>
				<a href={url} className='yt-video-link'>
					<Typography className='yt-video-title' variant='h6'>
						{decodeHTML(title)}
					</Typography>
				</a>
			</div>
		</div>
	)
}

export default VideoInfoContainer
