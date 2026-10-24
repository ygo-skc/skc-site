import { Typography } from '@mui/material'
import { FC } from 'react'
import { decodeHTML } from 'entities'

import { Dates } from '../../../helper/Dates'

// one upload in the channel's row - the thumbnail is decorative since the title names the link
const VideoInfoContainer: FC<HeartAPI.YouTubeUploads & { publishedAt: Date }> = ({ thumbnailImg, title, url, publishedAt }) => {
	const published = new Date(publishedAt)
	// toISOString throws on an invalid date - leave the date off rather than take the page down
	const isDateValid = !Number.isNaN(published.getTime())

	return (
		<a href={url} className='yt-video'>
			<img className='yt-video__thumb' src={thumbnailImg.src} alt='' loading='lazy' />

			<Typography className='yt-video__title' variant='body2'>
				{decodeHTML(title)}
			</Typography>

			{isDateValid && (
				<Typography className='yt-video__date' variant='caption' component='time' dateTime={published.toISOString()}>
					{Dates.getDateString(published)}
				</Typography>
			)}
		</a>
	)
}

export default VideoInfoContainer
