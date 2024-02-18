import { FC, Fragment, memo, useCallback, useEffect, useState } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'
import { Dates } from '../../helper/Dates'
import { scrollToTop } from '../../helper/Etc'
import { Hint } from 'skc-rcl'

type BanListDatesProps = {
	isFetchingBanListDates: boolean
	banListStartDates: string[]
	selectedBanList: string
	setSelectedBanList: (ind: number) => void
}

const BanListDates: FC<BanListDatesProps> = memo(
	({ isFetchingBanListDates, banListStartDates, selectedBanList, setSelectedBanList }) => {
		const [selectorItems, setSelectorItems] = useState<JSX.Element[]>()
		const [selectedBanListInd, setSelectedBanListInd] = useState('0')

		useEffect(() => {
			const selectorItems: JSX.Element[] = banListStartDates.map((_: string, ind: number) => {
				return (
					<MenuItem key={banListStartDates[ind]} className='ban-list-date-selector-menu-item' value={ind}>
						{Dates.getCurrentBanListDate(banListStartDates[ind], banListStartDates)}
					</MenuItem>
				)
			})

			setSelectorItems(selectorItems)
			setSelectedBanListInd('0')
		}, [banListStartDates])

		const handleBanListChanged = useCallback(
			(event: SelectChangeEvent) => {
				setSelectedBanListInd(event.target.value)
				setSelectedBanList(+event.target.value)
				scrollToTop()
			},
			[selectedBanListInd, setSelectedBanList]
		)

		return (
			<div className='group'>
				<Typography variant='h5'>Date Range</Typography>

				{isFetchingBanListDates ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
				) : (
					<Fragment>
						<Typography variant='subtitle1'>There are {banListStartDates.length} ban lists for selected format currently in the database</Typography>

						<Select className='ban-list-date-selector' value={selectedBanListInd} onChange={handleBanListChanged}>
							{selectorItems}
						</Select>
						{!isFetchingBanListDates && Dates.isFutureDate(Dates.fromYYYYMMDDToDate(selectedBanList)) && (
							<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white' variant='tight'>
								Current List Will Be Effective In {Dates.daysBetweenTwoDates(new Date(), Dates.fromYYYYMMDDToDate(selectedBanList))} Day(s)
							</Hint>
						)}
					</Fragment>
				)}
			</div>
		)
	},
	(prevProps, nextProps) => {
		return prevProps.selectedBanList === nextProps.selectedBanList
	}
)

BanListDates.displayName = 'BanListDates'
export default BanListDates
