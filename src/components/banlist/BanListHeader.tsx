import { FC } from 'react'
import { Chip, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DateBadge } from 'skc-rcl'
import * as Dates from '../../helper/Dates'
import { AcceptableBanListFormat } from '../../helper/BanListUtil'
import { BanStatus, banStatusClass } from '../../helper/BanStatus'
import BanListFormat from './BanListFormat'
import BanListDates from './BanListDates'
import BanListDonut from './BanListDonut'

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

const totalSkeletonKeys = ['forbidden', 'limited', 'semi-limited', 'changed']

const formatName: Record<AcceptableBanListFormat, string> = {
	[AcceptableBanListFormat.TCG]: 'TCG',
	[AcceptableBanListFormat.MD]: 'Master Duel',
	[AcceptableBanListFormat.DL]: 'Duel Links',
}

// white card: date badge, title and list count beside the format + date controls, with a donut of the status totals beside them as tiles underneath
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
	const totalCount = totals.reduce((sum, { count }) => sum + count, 0)

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

			<div className='ban-list-header__stats'>
				{isFetchingTotals ? (
					<Skeleton className='ban-list-header__summary-skeleton' variant='rounded' />
				) : (
					<div className='ban-list-header__summary'>
						<BanListDonut totals={totals} />
						<Typography variant='body2' component='p' className='ban-list-header__summary-text'>
							<span className='visually-hidden'>{totalCount} </span>cards restricted on this list
						</Typography>
					</div>
				)}

				<ul className='ban-list-header__totals' aria-label='Totals'>
					{isFetchingTotals ? (
						// one tile per total
						totalSkeletonKeys.map((key) => (
							<li key={key}>
								<Skeleton className='ban-list-header__total-skeleton' variant='rounded' />
							</li>
						))
					) : (
						<>
							{totals.map(({ status, count }) => (
								<li key={status} className={`ban-list-header__total ${banStatusClass(status)}`}>
									<Typography variant='h6' component='span' className='ban-list-header__count'>
										{count}
									</Typography>{' '}
									<Typography variant='body2' component='span' className='ban-list-header__label'>
										{status}
									</Typography>
								</li>
							))}
							{previousDate && (
								<li className='ban-list-header__total ban-list-header__total--changed'>
									<Typography variant='h6' component='span' className='ban-list-header__count'>
										{numChanged}
									</Typography>{' '}
									<Typography variant='body2' component='span' className='ban-list-header__label'>
										changed<span className='ban-list-header__since'> since {previousDate}</span>
									</Typography>
								</li>
							)}
						</>
					)}
				</ul>
			</div>
		</header>
	)
}

export default BanListHeader
