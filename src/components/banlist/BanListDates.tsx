import { FC, memo, useEffect, useState } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Dates } from '../../helper/Dates'

type _BanListDates = {
	banListStartDates: string[]
	setSelectedBanList: { (ind: number): void }
}

const BanListDates: FC<_BanListDates> = memo(
	({ banListStartDates, setSelectedBanList }) => {
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
		)
	},
	(prevProps, nextProps) => {
		if (prevProps.banListStartDates !== nextProps.banListStartDates) return false
		return true
	}
)

export default BanListDates
