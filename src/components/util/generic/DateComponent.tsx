import { FC } from 'react'
import { Typography } from '@mui/material'

import { Dates } from '../../../helper/Dates'

import '../../../css/util/generic/date-component.css'

type _Date = {
	date: Date
}

const DateComponent: FC<_Date> = ({ date }) => {
	return (
		<div className='date-parent'>
			<div className='month-container'>
				<Typography variant='h6' align='center' className='month-text'>
					{Dates.getMonth(date)}
				</Typography>
			</div>

			<Typography align='center' variant='h3' className='day-text'>
				{Dates.getDay(date)}
			</Typography>
			<Typography align='center' variant='subtitle2' className='year-text'>
				{Dates.getYear(date)}
			</Typography>
		</div>
	)
}

export default DateComponent
