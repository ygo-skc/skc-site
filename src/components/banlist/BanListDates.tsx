import { FC, memo, useEffect, useState } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'
import { Dates } from '../../helper/Dates'

type _BanListDates = {
	isFetchingBanListDates: boolean
	banListStartDates: string[]
	setSelectedBanList: { (ind: number): void }
}

const BanListDates: FC<_BanListDates> = memo(
	({ isFetchingBanListDates, banListStartDates, setSelectedBanList }) => {
		const [selectorItems, setSelectorItems] = useState<JSX.Element[]>()
		const [selectedBanListInd, setSelectedBanListInd] = useState('0')

		useEffect(() => {
			let selectorItems: JSX.Element[] = banListStartDates.map((_: string, ind: number) => {
				return (
					<MenuItem className='ban-list-date-selector-menu-item' value={ind}>
						{Dates.getCurrentBanListDate(banListStartDates[ind], banListStartDates)}
					</MenuItem>
				)
			})

			setSelectorItems(selectorItems)
			setSelectedBanListInd('0')
		}, [banListStartDates])

		return (
			<div className='ban-list-date-section group'>
				<Typography variant='h5'>Date Range</Typography>

				{isFetchingBanListDates ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='80px' />
				) : (
					<div>
						<Typography variant='subtitle1'>There are {banListStartDates.length} ban lists for selected format currently in the database</Typography>

						<Select
							className='ban-list-date-selector'
							value={selectedBanListInd}
							onChange={(event: SelectChangeEvent) => {
								setSelectedBanListInd(event.target.value)
								setSelectedBanList(+event.target.value)
							}}
						>
							{selectorItems}
						</Select>
					</div>
				)}
			</div>
		)
	},
	(prevProps, nextProps) => {
		if (prevProps.isFetchingBanListDates !== nextProps.isFetchingBanListDates) return false
		return true
	}
)

export default BanListDates
