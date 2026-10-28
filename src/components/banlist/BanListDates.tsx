import { FC, Fragment, JSX, memo, useCallback, useMemo } from 'react'
import { ListSubheader, MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'
import * as Dates from '../../helper/Dates'
import { scrollToTop } from '../../helper/Etc'

// "Oct 19" - the year comes from the menu's year heading
const shortDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

type BanListDatesProps = {
	isFetchingBanListDates: boolean
	banListStartDates: string[]
	selectedBanList: string
	setSelectedBanList: (ind: number) => void
}

const BanListDates: FC<BanListDatesProps> = memo(
	({ isFetchingBanListDates, banListStartDates, selectedBanList, setSelectedBanList }) => {
		// from the page, so a list restored on going back shows as picked
		const selectedBanListInd = Math.max(banListStartDates.indexOf(selectedBanList), 0)

		// built during render, so the menu has its options on the first paint (a restored page mounts with its dates)
		const selectorItems = useMemo(() => {
			// newest first, under a heading per year; each list reads "Oct 19 – Present" since the heading has the year.
			// Select gives every child role=option, so the headings are hidden from screen readers and each option is labelled with its full dates
			const selectorItems: JSX.Element[] = []
			banListStartDates.forEach((startDate, ind) => {
				const start = Dates.fromYYYYMMDDToDate(startDate)
				const year = Dates.getYear(start)

				if (ind === 0 || Dates.getYear(Dates.fromYYYYMMDDToDate(banListStartDates[ind - 1])) !== year) {
					selectorItems.push(
						<ListSubheader key={year} className='ban-list-date-menu__year' aria-hidden='true'>
							<Typography variant='overline' component='span'>
								{year}
							</Typography>
						</ListSubheader>
					)
				}

				const end = ind === 0 ? 'Present' : shortDate(Dates.fromYYYYMMDDToDate(banListStartDates[ind - 1]))
				selectorItems.push(
					<MenuItem key={startDate} className='ban-list-date-selector-menu-item' value={ind} aria-label={Dates.getCurrentBanListDate(startDate, banListStartDates)}>
						{shortDate(start)} – {end}
					</MenuItem>
				)
			})

			return selectorItems
		}, [banListStartDates])

		const handleBanListChanged = useCallback(
			(event: SelectChangeEvent) => {
				setSelectedBanList(+event.target.value)
				scrollToTop()
			},
			[setSelectedBanList]
		)

		return isFetchingBanListDates ? (
			<Skeleton className='ban-list-date-selector__skeleton' variant='rectangular' width='15rem' height='2.75rem' />
		) : (
			<Fragment>
				<Typography component='label' variant='body2' id='ban-list-date-label' className='ban-list-header__sr-only'>
					Ban list date
				</Typography>
				<Select
					className='ban-list-date-selector'
					labelId='ban-list-date-label'
					value={selectedBanListInd.toString()}
					onChange={handleBanListChanged}
					renderValue={(value) => Dates.getCurrentBanListDate(banListStartDates[+value], banListStartDates)}
					MenuProps={{ slotProps: { paper: { className: 'ban-list-date-menu' } } }}
				>
					{selectorItems}
				</Select>
			</Fragment>
		)
	}
)

BanListDates.displayName = 'BanListDates'
export default BanListDates
