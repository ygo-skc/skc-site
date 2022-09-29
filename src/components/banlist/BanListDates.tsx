import { FC, memo, useEffect, useState } from 'react'
import { FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Dates } from '../../helper/Dates'

type _BanListDates = {
	format: BanListFormat
	setFormat: React.Dispatch<React.SetStateAction<BanListFormat>>
	banListStartDates: string[]
	setSelectedBanList: { (ind: number): void }
}

const BanListDates: FC<_BanListDates> = memo(
	({ format, setFormat, banListStartDates, setSelectedBanList }) => {
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
				<FormControl className='ban-list-format-form'>
					<FormLabel id='ban-list-format-label'>Format</FormLabel>
					<RadioGroup
						value={format}
						onChange={(item) => setFormat(item.target.value as BanListFormat)}
						row
						aria-labelledby='ban-list-format-label'
						name='ban-list-format-buttons-group'
					>
						<FormControlLabel value='TCG' control={<Radio />} label='TCG' />
						<FormControlLabel value='MD' control={<Radio />} label='Master Duel' />
						<FormControlLabel value='DL' control={<Radio />} label='Duel Links' />
					</RadioGroup>
				</FormControl>

				<Typography variant='h6'>Date Range</Typography>
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
		if (prevProps.banListStartDates.length !== nextProps.banListStartDates.length || prevProps.format !== nextProps.format) return false
		return true
	}
)

export default BanListDates
