import '../../css/util/date-glance.css'

import { FC } from 'react'
import { Typography } from '@mui/material'

import '../../css/ygo-card-styles.css'
import { Dates } from '../../helper/Dates'

type _Date = {
	date: Date
}

const DateGlance: FC<_Date> = ({ date }) => {
	return (
		<div className='date-parent light-shadow'>
			<div className='month-container'>
				<Typography variant='h4' align='center' className='month-text'>
					{Dates.getMonth(date)}
				</Typography>
			</div>
			<div>
				<Typography align='center' variant='h3' className='day-text'>
					{Dates.getDay(date)}
				</Typography>
				<Typography align='center' variant='h6'>
					{Dates.getYear(date)}
				</Typography>
			</div>
			<div></div>
		</div>
	)
}

export default DateGlance
