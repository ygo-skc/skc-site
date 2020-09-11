import React, { memo, useEffect, useState } from 'react'
import Styled from 'styled-components'

import { Button, Grid, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded'



const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const BanDatesExpansionSummary = Styled(ExpansionPanelSummary)`
	&&
	{
		padding: 0rem;
	}
`

const BanDatesExpansionDetail = Styled(ExpansionPanelDetails)`
	&&
	{
		padding: 0rem;
		margin-bottom: .7rem;
	}
`

export const BanListDates = memo( ( { banListStartDates, setSelectedBanList } ) =>
{
	const [banListGrid, setBanListGrid] = useState([])
	const [selectedBanListIndex, setSelectedBanListIndex] = useState(0)
	const [selectedRange, setSelectedRange] = useState('')

	useEffect( () => {
		let banListGrid = banListStartDates.map((item, ind) => {
			return(<Grid key={getDateString(months, new Date(item))} item xs={6} sm={6} md={6} lg={12} xl={6} >
				<Button
					style={{color: '#fff', width: '99%'}}
					color={ (ind === selectedBanListIndex)? 'primary': 'secondary' }
					size='small'

					disableElevation={true}
					variant='contained'
					startIcon={<DateRangeRoundedIcon />}
					onClick={ () => {
						setSelectedBanList(ind)
						setSelectedBanListIndex(ind)
						}
					} >
					{ getDateString(months, new Date(item)) }
				</Button>
			</Grid>
			)
		})

		setSelectedRange( getCurrentBanListDate( months, banListStartDates[selectedBanListIndex], banListStartDates ) )
		setBanListGrid(banListGrid)
	}, [selectedBanListIndex])



	return(
		<div style={{padding: '.5rem'}} >
			<Typography
				style={{color: 'rgba(255, 255, 255, .95)'}}
				variant='h6' >
				Date Range
			</Typography>
			<ExpansionPanel elevation={0} style={ { padding: '.5rem', background: 'rgba(255, 255, 255, .85)', borderRadius: '1rem' } }  >
				<BanDatesExpansionSummary
					expandIcon={<ExpandMoreIcon />} >
					<Typography
						style={{color: 'rgba(0, 0, 0, .75)'}}
						variant='subtitle2' >
						{ selectedRange }
					</Typography>
				</BanDatesExpansionSummary>

				<BanDatesExpansionDetail>
					<Grid container spacing={ 1 } >
						{ banListGrid }
					</Grid>
				</BanDatesExpansionDetail>
			</ExpansionPanel>
		</div>
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


const getDateString = (months, date) => `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
