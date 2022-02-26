import { FC, memo, useEffect, useState } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Dates } from '../../helper/Dates'

type _BanListDates = {
	banListStartDates: string[]
	setSelectedBanList: { (ind: number): void }
}

const BanListDates: FC<_BanListDates> = memo(
	({ banListStartDates, setSelectedBanList }) => {
		const [banListGrid, setBanListGrid] = useState<JSX.Element[]>([])

		useEffect(() => {
			let banListGridItems = banListStartDates.map((_: string, ind: number) => {
				return (
					<MenuItem style={{ padding: '1rem' }} value={ind}>
						{Dates.getCurrentBanListDate(banListStartDates[ind], banListStartDates)}
					</MenuItem>
				)
			})

			setBanListGrid(banListGridItems)
			setSelectedBanList(0)
		}, [banListStartDates, setSelectedBanList])

		return (
			<div>
				<Typography variant='h4'>Date Range</Typography>
				<Select
					style={{ width: '95%', margin: 'auto' }}
					onChange={(event: SelectChangeEvent) => {
						setSelectedBanList(+event.target.value)
					}}
				>
					{banListGrid}
				</Select>
			</div>
		)
	},
	(prevProps, nextProps) => {
		if (prevProps.banListStartDates.length !== nextProps.banListStartDates.length) return false
		return true
	}
)

export default BanListDates
