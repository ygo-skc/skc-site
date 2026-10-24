import { FC } from 'react'
import { Link } from 'react-router-dom'
import { GenericNonBreakingErr, YGOCardPreview } from 'skc-rcl'
import { Skeleton, Typography } from '@mui/material'
import '../../css/card/card-of-the-day.css'
import * as Dates from '../../helper/Dates'

// the same glanceable preview as the search popup - art, attribute, type chip in its frame colour, atk/def and the full effect
const CardOfTheDay: FC<{ cardOfTheDayData: APIRequest<SKC.CardOfTheDay> }> = ({ cardOfTheDayData }) => {
	const { card, date, isFetchingData, requestHasError } = cardOfTheDayData

	return (
		<div className='card-of-the-day'>
			<div className='card-of-the-day__header'>
				<Typography variant='h4' component='h2'>
					Card of the day
				</Typography>
				{date ? (
					<Typography variant='caption' component='time' dateTime={date} className='card-of-the-day__date'>
						{Dates.getMonth(Dates.fromYYYYMMDDToDate(date))} {Dates.getDay(Dates.fromYYYYMMDDToDate(date))}
					</Typography>
				) : (
					isFetchingData && (
						<Typography variant='caption' aria-hidden='true'>
							<Skeleton width='3rem' />
						</Typography>
					)
				)}
			</div>

			{requestHasError && <GenericNonBreakingErr errExplanation='Come back at a different time to see todays card of the day!' />}
			{!requestHasError && isFetchingData && (
				// the preview's pieces - art, name, type chip, atk/def and the effect well - so nothing moves when the card arrives
				<div className='card-of-the-day__loading' aria-hidden='true' data-testid='card-of-the-day-skeleton'>
					<Skeleton className='card-of-the-day__art-skeleton' variant='rounded' />
					<Typography variant='h6'>
						<Skeleton width='60%' />
					</Typography>
					<Skeleton className='card-of-the-day__pill-skeleton' variant='rounded' width='7rem' height={24} />
					<Skeleton variant='rounded' width='9rem' height={24} />
					<Skeleton className='card-of-the-day__effect-skeleton' variant='rounded' height={180} />
				</div>
			)}
			{!requestHasError && !isFetchingData && card && (
				<Link to={`/card/${card.cardID}`} className='card-of-the-day__link'>
					<YGOCardPreview card={card} />
				</Link>
			)}
		</div>
	)
}

export default CardOfTheDay
