import { FC, memo, useEffect, useState } from 'react'
import Styled from 'styled-components'

import { Button, Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded'

import { Dates } from '../../helper/Dates'

const BanDatesExpansionSummary = Styled(AccordionSummary)`
	&&
	{
		padding: 0rem;
	}
`

const BanDatesExpansionDetail = Styled(AccordionDetails)`
	&&
	{
		padding: 0rem;
		margin-bottom: .7rem;
	}
`

const DatesAccordion = Styled(Accordion)`
	&& {
		background-color: rgba(255, 255, 255, .7) !important;
		backdrop-filter: blur(60px);
		padding: .5rem;
		border-radius: 1rem;
	}
`

type _BanListDates = {
	banListStartDates: string[]
	setSelectedBanList: { (ind: number): void }
}

const BanListDates: FC<_BanListDates> = memo(
	({ banListStartDates, setSelectedBanList }) => {
		const [banListGrid, setBanListGrid] = useState<JSX.Element[]>([])
		const [selectedBanListIndex, setSelectedBanListIndex] = useState(0)
		const [selectedRange, setSelectedRange] = useState('')

		useEffect(() => {
			let banListGrid = banListStartDates.map((item, ind) => {
				return (
					<Grid key={Dates.getDateString(new Date(item))} item xs={6} sm={6} md={6} lg={12} xl={6}>
						<Button
							style={{ color: '#fff', width: '99%' }}
							color={ind === selectedBanListIndex ? 'primary' : 'secondary'}
							size='small'
							disableElevation={true}
							variant='contained'
							startIcon={<DateRangeRoundedIcon />}
							onClick={() => {
								setSelectedBanList(ind)
								setSelectedBanListIndex(ind)
							}}
						>
							{Dates.getDateString(new Date(item))}
						</Button>
					</Grid>
				)
			})

			setSelectedRange(Dates.getCurrentBanListDate(banListStartDates[selectedBanListIndex], banListStartDates))
			setBanListGrid(banListGrid)
		}, [selectedBanListIndex, banListStartDates, setSelectedBanList])

		return (
			<div>
				<Typography style={{ color: 'white' }} variant='h4'>
					Date Range
				</Typography>
				<DatesAccordion elevation={0}>
					<BanDatesExpansionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography style={{ color: 'rgba(0, 0, 0, .95)' }} variant='subtitle1'>
							{selectedRange}
						</Typography>
					</BanDatesExpansionSummary>

					<BanDatesExpansionDetail>
						<Grid container spacing={1}>
							{banListGrid}
						</Grid>
					</BanDatesExpansionDetail>
				</DatesAccordion>
			</div>
		)
	},
	(prevProps, nextProps) => {
		if (prevProps.banListStartDates.length !== nextProps.banListStartDates.length) return false
		return true
	}
)

export default BanListDates
