import { FC } from 'react'
import { Chip, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DateBadge } from 'skc-rcl'
import * as Dates from '../../helper/Dates'
import { AcceptableBanListFormat } from '../../helper/BanListUtil'
import { BanStatus, banStatusClass } from '../../helper/BanStatus'
import BanListFormat from './BanListFormat'
import BanListDates from './BanListDates'

export type BanListTotal = {
	status: BanStatus
	count: number
}

type BanListHeaderProps = {
	format: AcceptableBanListFormat
	setFormat: React.Dispatch<React.SetStateAction<AcceptableBanListFormat>>
	isFetchingBanListDates: boolean
	banListStartDates: string[]
	selectedBanList: string
	setSelectedBanList: (ind: number) => void
	isFetchingTotals: boolean
	totals: BanListTotal[]
	numChanged: number
	previousDate?: string
}

const totalSkeletonWidths = ['9.5rem', '7.75rem', '9.75rem', '16.5rem']

const formatName: Record<AcceptableBanListFormat, string> = {
	[AcceptableBanListFormat.TCG]: 'TCG',
	[AcceptableBanListFormat.MD]: 'Master Duel',
	[AcceptableBanListFormat.DL]: 'Duel Links',
}

// white card: date badge, title and list count beside the format + date controls, with the status totals as pills underneath
const BanListHeader: FC<BanListHeaderProps> = ({
	format,
	setFormat,
	isFetchingBanListDates,
	banListStartDates,
	selectedBanList,
	setSelectedBanList,
	isFetchingTotals,
	totals,
	numChanged,
	previousDate,
}) => {
	const isLoading = isFetchingBanListDates || selectedBanList === ''
	const effectiveDate = isLoading ? undefined : Dates.fromYYYYMMDDToDate(selectedBanList)
	const daysUntilEffective = effectiveDate && Dates.isFutureDate(effectiveDate) ? Dates.daysBetweenTwoDates(new Date(), effectiveDate) : 0
	const isCurrent = banListStartDates[0] === selectedBanList && daysUntilEffective === 0
	// the normal badge leaves too little room for the title beside it on phones
	const isPhone = useMediaQuery(useTheme().breakpoints.down('sm'))

	return (
		<header className='ban-list-header'>
			<div className='ban-list-header__top'>
				<div className='ban-list-header__who'>
					{effectiveDate ? (
						// rcl's badge renders its month, day and year as headings - the eyebrow already reads the date, so hide it from the outline
						<span aria-hidden='true' className='ban-list-header__badge'>
							<DateBadge month={Dates.getMonth(effectiveDate)} day={+Dates.getDay(effectiveDate)} year={+Dates.getYear(effectiveDate)} variant={isPhone ? 'condensed' : 'normal'} />
						</span>
					) : (
						<Skeleton className='ban-list-header__badge-skeleton' variant='rectangular' />
					)}

					<div className='ban-list-header__title'>
						<Typography variant='overline' component='p' className='ban-list-header__eyebrow'>
							{effectiveDate ? `Effective ${Dates.getDateString(effectiveDate)}` : <Skeleton width='14ch' />}
						</Typography>
						<Typography variant='h1'>{formatName[format]} ban list</Typography>
						<div className='ban-list-header__meta'>
							<Typography variant='body1' className='ban-list-header__lead'>
								{isLoading ? (
									<>
										<Skeleton width='20ch' />
										{/* phones wrap the lead onto a second line */}
										<Skeleton width='10ch' className='ban-list-phone-line' />
									</>
								) : (
									<>
										{isCurrent ? 'The current list · ' : ''}
										{banListStartDates.length} lists in the database
									</>
								)}
							</Typography>
							{daysUntilEffective > 0 && <Chip className='ban-list-header__upcoming' label={`Takes effect in ${daysUntilEffective} day${daysUntilEffective === 1 ? '' : 's'}`} />}
						</div>
					</div>
				</div>

				<div className='ban-list-header__controls'>
					<BanListFormat format={format} setFormat={setFormat} />
					<BanListDates
						isFetchingBanListDates={isFetchingBanListDates}
						banListStartDates={banListStartDates}
						selectedBanList={selectedBanList}
						setSelectedBanList={setSelectedBanList}
					/>
				</div>
			</div>

			<ul className='ban-list-header__totals' aria-label='Totals'>
				{isFetchingTotals ? (
					// one pill per total, about as wide as the loaded ones
					totalSkeletonWidths.map((width) => (
						<li key={width}>
							<Skeleton className='ban-list-header__total-skeleton' variant='rounded' width={width} />
						</li>
					))
				) : (
					<>
						{totals.map(({ status, count }) => (
							<li key={status}>
								<Chip
									className={`ban-list-header__total ${banStatusClass(status)}`}
									label={
										<>
											<Typography variant='inherit' component='span' className='ban-list-header__count'>
												{count}
											</Typography>{' '}
											{status}
										</>
									}
								/>
							</li>
						))}
						{previousDate && (
							<li>
								<Chip
									className='ban-list-header__total ban-list-header__total--changed'
									label={
										<>
											<Typography variant='inherit' component='span' className='ban-list-header__count'>
												{numChanged}
											</Typography>{' '}
											changed since {previousDate}
										</>
									}
								/>
							</li>
						)}
					</>
				)}
			</ul>
		</header>
	)
}

export default BanListHeader
