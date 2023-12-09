import { Fragment, useCallback, useEffect, useState } from 'react'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import { CardImageRounded, GenericNonBreakingErr, InlineDate, Section, YGOCardColorIndicator } from 'skc-rcl'
import { Skeleton, Typography } from '@mui/material'
import '../../css/card/card-of-the-day.css'
import { Dates } from '../../helper/Dates'

type CardOfTheDayOutput = {
	date: string
	version: number
	card: SKCCard
}

export default function CardOfTheDay() {
	const [cardOfTheDay, setCardOfTheDay] = useState<SKCCard | undefined>(undefined)
	const [date, setDate] = useState(new Date())
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card-of-the-day`,
			(json: CardOfTheDayOutput) => {
				setCardOfTheDay(json.card)
				setDate(Dates.fromYYYYMMDDToDate(json.date))
				setIsLoading(false)
			},
			false
		)?.catch(() => {
			setHasError(true)
		})
	}, [])

	const suggestionClickedCB = useCallback(() => {
		window.location.assign(`/card/${cardOfTheDay?.cardID}`)
	}, [cardOfTheDay])

	const keyClickedCB = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key == 'Enter') {
				suggestionClickedCB()
			}
		},
		[suggestionClickedCB]
	)

	return (
		<Section sectionName='Suggestions'>
			<div
				onClick={hasError ? undefined : suggestionClickedCB}
				onKeyDown={keyClickedCB}
				className={`section-content ${hasError ? '' : 'card-of-the-day-parent'}`}
				id='card-of-the-day'
			>
				{hasError && <GenericNonBreakingErr errExplanation='Come back at a different time to see todays card of the day!' />}
				{!hasError && (
					<Fragment>
						<Typography variant='h5'>Card of The Day</Typography>
						<div className='card-of-the-day-wrapper'>
							{(!isLoading && <CardImageRounded variant='tn' cardID={cardOfTheDay!.cardID} loading='eager' />) || <Skeleton className='rounded-skeleton' variant='circular' />}

							<div className='card-of-the-day-data'>
								{(!isLoading && (
									<Fragment>
										<InlineDate month={Dates.getMonth(date)} day={+Dates.getDay(date)} year={+Dates.getYear(date)} />
										<Typography variant='h6' className='card-of-the-day-text'>
											{cardOfTheDay?.cardName}
										</Typography>
										<div className='card-of-the-day-type-wrapper'>
											<YGOCardColorIndicator cardColor={cardOfTheDay?.cardColor} variant={'small'} />
											<Typography variant='subtitle1' className='card-of-the-day-text'>
												{cardOfTheDay?.monsterType === undefined ? cardOfTheDay?.cardColor : cardOfTheDay.monsterType}
											</Typography>
										</div>
									</Fragment>
								)) || <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='7rem' />}
							</div>
						</div>
					</Fragment>
				)}
			</div>
		</Section>
	)
}
