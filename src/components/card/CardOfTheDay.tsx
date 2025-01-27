import { FC, Fragment } from 'react'
import { CardImageRounded, GenericNonBreakingErr, InlineDate, YGOCardColorIndicator } from 'skc-rcl'
import { Skeleton, Typography } from '@mui/material'
import '../../css/card/card-of-the-day.css'
import { Dates } from '../../helper/Dates'

const CardOfTheDay: FC<{ cardOfTheDayData: APIRequest<SKC.CardOfTheDay> }> = ({ cardOfTheDayData }) => {
	const date = Dates.fromYYYYMMDDToDate(cardOfTheDayData.date)

	return (
		<Fragment>
			<Typography variant='h5'>Card of The Day</Typography>
			<a href={`/card/${cardOfTheDayData.card?.cardID}`} className='aggregate-anchor'>
				<div className={`${cardOfTheDayData.requestHasError ? '' : 'card-of-the-day-parent'}`} id='card-of-the-day'>
					{cardOfTheDayData.requestHasError && <GenericNonBreakingErr errExplanation='Come back at a different time to see todays card of the day!' />}
					{!cardOfTheDayData.requestHasError && (
						<div className='card-of-the-day-wrapper'>
							{(!cardOfTheDayData.isFetchingData && <CardImageRounded size='tn' variant='circle' cardID={cardOfTheDayData.card!.cardID} loading='eager' />) || (
								<Skeleton className='rounded-skeleton' variant='circular' />
							)}

							<div className='card-of-the-day-data'>
								{(!cardOfTheDayData.isFetchingData && (
									<Fragment>
										<InlineDate month={Dates.getMonth(date)} day={+Dates.getDay(date)} year={+Dates.getYear(date)} />
										<Typography variant='h6' className='card-of-the-day-name'>
											{cardOfTheDayData.card?.cardName}
										</Typography>
										<div className='card-of-the-day-type-wrapper'>
											<YGOCardColorIndicator cardColor={cardOfTheDayData.card?.cardColor} variant={'small'} />
											<Typography variant='subtitle1' className='card-of-the-day-type'>
												{cardOfTheDayData.card?.monsterType === undefined ? cardOfTheDayData.card?.cardColor : cardOfTheDayData.card.monsterType.replace(/\//g, '/\u200B')}
											</Typography>
										</div>
									</Fragment>
								)) || <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='3rem' />}
							</div>
						</div>
					)}
				</div>
			</a>
		</Fragment>
	)
}

export default CardOfTheDay
