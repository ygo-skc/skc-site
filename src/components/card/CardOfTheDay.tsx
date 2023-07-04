import { Fragment, useEffect, useState } from 'react'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import { CardImageRounded, InlineDate, Section, YGOCardColorIndicator } from 'skc-rcl'
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

	useEffect(() => {
		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card-of-the-day`,
			(json: CardOfTheDayOutput) => {
				setCardOfTheDay(json.card)
				setDate(Dates.fromYYYYMMDDToDate(json.date))
				setIsLoading(false)
			},
			false
		)?.catch((_err) => {})
	}, [])

	return (
		<Section sectionName='Suggestions'>
			<div onClick={() => window.location.assign(`/card/${cardOfTheDay?.cardID}`)} className='section-content card-of-the-day-parent'>
				<Typography variant='h5'>Card of The Day</Typography>
				<div className='card-of-the-day-wrapper'>
					<div className='card-of-the-day-image'>
						{!isLoading && <CardImageRounded cardImg={`https://images.thesupremekingscastle.com/cards/tn/${cardOfTheDay?.cardID}.jpg`} />}
						{isLoading && <Skeleton className='rounded-skeleton' variant='circular' width='100%' height='100%' />}
					</div>
					<div className='card-of-the-day-data'>
						{!isLoading && (
							<Fragment>
								<InlineDate month={Dates.getMonth(date)} day={+Dates.getDay(date)} year={+Dates.getYear(date)} />
								<Typography variant='h5' className='card-of-the-day-text'>
									{cardOfTheDay?.cardName}
								</Typography>
								<div className='card-of-the-day-wrapper'>
									<YGOCardColorIndicator cardColor={cardOfTheDay?.cardColor} variant={'small'} />
									<Typography variant='h6' className='card-of-the-day-text'>
										{cardOfTheDay?.monsterType === undefined ? cardOfTheDay?.cardColor : cardOfTheDay.monsterType}
									</Typography>
								</div>
							</Fragment>
						)}
						{isLoading && <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='8rem' />}
					</div>
				</div>
			</div>
		</Section>
	)
}
