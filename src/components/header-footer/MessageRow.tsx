import { memo, useId, useState } from 'react'
import { ButtonBase, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import * as Dates from '../../helper/Dates'
import { MessageDetails } from './MessageItemComponent'

/*
 * An older post folded to its date and title - opening it shows the post underneath. Rows sit under a year heading, so the date leaves the year out
 */
const MessageRow = memo(({ message }: { message: HeartAPI.MessageInstance }) => {
	const creationDate = new Date(message.createdAt)
	const detailId = useId()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<li className={isOpen ? 'messages__row messages__row--open' : 'messages__row'}>
			<Typography variant='body1' component='h4' className='messages__row-heading'>
				<ButtonBase className='messages__row-toggle' aria-expanded={isOpen} aria-controls={detailId} onClick={() => setIsOpen(!isOpen)}>
					<Typography variant='caption' component='time' className='messages__row-date' dateTime={message.createdAt} title={Dates.getDateString(creationDate)}>
						{Dates.getMonth(creationDate)} {Dates.getDay(creationDate)}
					</Typography>
					<Typography variant='inherit' component='span' className='messages__row-title'>
						{message.title}
					</Typography>
					<ExpandMoreIcon className='messages__chevron' />
				</ButtonBase>
			</Typography>
			{isOpen && (
				<div id={detailId} className='messages__row-detail'>
					<MessageDetails message={message} />
				</div>
			)}
		</li>
	)
})

MessageRow.displayName = 'MessageRow'
export default MessageRow
