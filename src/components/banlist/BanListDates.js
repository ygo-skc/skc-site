import React, { memo, useEffect, useState } from 'react'
import Styled from 'styled-components'

import { Chip, Grid, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded'



const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const BanDatesExpansionSummary = Styled(ExpansionPanelSummary)`
	&&
	{
		@media only screen and (min-width: 0px)
		{
			padding-left: .85rem;
			padding-right: .85rem;
		}
		@media only screen and (min-width: 600px)
		{
			padding-left: .95rem;
			padding-right: .95rem;
		}
		@media only screen and (min-width: 800px)
		{
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
	}
`

const BanDatesExpansionDetail = Styled(ExpansionPanelDetails)`
	&&
	{
		@media only screen and (min-width: 0px)
		{
			padding: .85rem;
		}
		@media only screen and (min-width: 600px)
		{
			padding: .95rem;
		}
		@media only screen and (min-width: 800px)
		{
			padding: 1.25rem;
		}
	}
`

export const BanListDates = memo( ( { banListStartDates, setSelectedBanList } ) =>
{
	const [banListGrid, setBanListGrid] = useState([])
	const [selectedBanListIndex, setSelectedBanListIndex] = useState(0)
	const [selectedRange, setSelectedRange] = useState('')

	useEffect( () => {
		let banListGrid = []
		banListStartDates.forEach((item, ind) => {
			banListGrid.push(<Grid key={ind} item xs={6} sm={4} md={2} lg={2} xl={1} >
				<Chip
					color='secondary'
					variant={ (ind === selectedBanListIndex)? 'default' : 'outlined' }
					label={getDateString(months, new Date(item))}
					icon={<DateRangeRoundedIcon />}
					onClick={ () => {
						setSelectedBanList(ind)
						setSelectedBanListIndex(ind)
						}
					} />
			</Grid>
			)
		})

		setSelectedRange( getCurrentBanListDate( months, banListStartDates[selectedBanListIndex], banListStartDates ) )
		setBanListGrid(banListGrid)
	}, [selectedBanListIndex])



	return(
		<ExpansionPanel elevation={0} style={ { paddingLeft: '.5rem' } }  >
			<BanDatesExpansionSummary
				style={{padding: '0rem'}}
				expandIcon={<ExpandMoreIcon />} >
				<Typography
					variant='h4' >
					{ selectedRange }
				</Typography>
			</BanDatesExpansionSummary>

			<BanDatesExpansionDetail>
				<Grid container spacing={ 1 } >
					{ banListGrid }
				</Grid>
			</BanDatesExpansionDetail>
		</ExpansionPanel>
	)
}, (prevProps, nextProps) => {
	if (prevProps.banListStartDates.length !== nextProps.banListStartDates.length)	return false
	return true
})


const getCurrentBanListDate = (months, selectedBanList, banListStartDates) =>
{
	if (banListStartDates === undefined)	return
	const banListPos = banListStartDates.findIndex(item => {
		if (item === selectedBanList)	return true

		return false
	})

	switch (banListPos) {
		case 0:
			return getDateString(months, new Date(selectedBanList)) + " - Present"
		default:
			let offset = (24*60*60*1000) * 1; //5 days
			let nextDate = new Date( banListStartDates[banListPos - 1] )
			nextDate.setTime( nextDate.getTime() - offset )

			return getDateString(months, new Date(selectedBanList)) + " - "
				+ getDateString( months, nextDate )
	}
}


const getDateString = (months, date) => `${months[date.getMonth()]} ${date.getDate() + 1}, ${date.getFullYear()}`
