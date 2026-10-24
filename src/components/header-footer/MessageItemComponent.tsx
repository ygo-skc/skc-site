import { memo, ReactNode, useId, useLayoutEffect, useRef, useState } from 'react'
import { Button, Typography, Chip } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ReactMarkdown, { Components } from 'react-markdown'

import * as Dates from '../../helper/Dates'

// headings inside a post are sub-headings of the post title, so every markdown level renders one level below the title
// (h3 for a full post, h4 for an opened row) in the theme's subtitle2 - screen readers navigate by heading level, so none are skipped
function markdownHeadingsAt(tag: 'h4' | 'h5'): Components {
	function MarkdownHeading({ children }: { children?: ReactNode }) {
		return (
			<Typography variant='subtitle2' component={tag}>
				{children}
			</Typography>
		)
	}
	return { h1: MarkdownHeading, h2: MarkdownHeading, h3: MarkdownHeading, h4: MarkdownHeading, h5: MarkdownHeading, h6: MarkdownHeading }
}
const postMarkdown = markdownHeadingsAt('h4')
const rowMarkdown = markdownHeadingsAt('h5')

/*
 * A post's markdown and tags, shown under an opened row
 */
export function MessageDetails({ message }: { message: HeartAPI.MessageInstance }) {
	return (
		<>
			<Typography variant='body2' component='div' className='messages__body'>
				<ReactMarkdown components={rowMarkdown}>{message.content}</ReactMarkdown>
			</Typography>
			<MessageTags tags={message.tags} />
		</>
	)
}

function MessageTags({ tags }: { tags: string[] }) {
	return (
		<div className='messages__tags'>
			{tags.map((tag: string) => (
				<Chip key={tag} size='small' label={tag} />
			))}
		</div>
	)
}

type MessageItemComponentArgs = {
	message: HeartAPI.MessageInstance
	isNew: boolean
}

/*
 * A post shown in full - new posts, or the latest one when nothing is new. Long posts are clipped to a few lines until "Read more" is pressed
 */
const MessageItemComponent = memo(({ message, isNew }: MessageItemComponentArgs) => {
	const creationDate = new Date(message.createdAt)
	const bodyId = useId()
	const bodyRef = useRef<HTMLDivElement>(null)
	const [isExpanded, setIsExpanded] = useState(false)
	const [isLong, setIsLong] = useState(false)

	// only a post that overflows the clip gets the read more button. markdown images can load in later and grow it, so it's re-measured on resize
	useLayoutEffect(() => {
		const body = bodyRef.current
		if (body === null || isExpanded) return

		const measure = () => setIsLong(body.scrollHeight > body.clientHeight + 1)
		measure()

		const observer = new ResizeObserver(measure)
		observer.observe(body)
		return () => observer.disconnect()
	}, [isExpanded])

	return (
		<li className='messages__post'>
			<Typography variant='overline' component='p' className='messages__eyebrow'>
				{isNew && (
					<Typography variant='inherit' component='span' className='messages__new'>
						New
					</Typography>
				)}
				<Typography variant='inherit' component='time' dateTime={message.createdAt} title={`${Dates.getDateString(creationDate)} ${Dates.getTimeString(creationDate)}`}>
					{Dates.getDateString(creationDate)}
				</Typography>
			</Typography>

			<Typography variant='subtitle1' component='h3' className='messages__title'>
				{message.title}
			</Typography>
			<Typography ref={bodyRef} id={bodyId} variant='body2' component='div' className={isExpanded ? 'messages__body' : 'messages__body messages__body--clipped'}>
				<ReactMarkdown components={postMarkdown}>{message.content}</ReactMarkdown>
			</Typography>
			{(isLong || isExpanded) && (
				<Button className='messages__more' aria-expanded={isExpanded} aria-controls={bodyId} endIcon={<ExpandMoreIcon />} onClick={() => setIsExpanded(!isExpanded)}>
					{isExpanded ? 'Show less' : 'Read more'}
				</Button>
			)}

			<MessageTags tags={message.tags} />
		</li>
	)
})

MessageItemComponent.displayName = 'MessageItemComponent'
export default MessageItemComponent
