import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { AppBar, Tabs, Tab, Badge } from '@material-ui/core'

import TabPanel from './TabPanel'



const Temp = styled(Badge)`
	&& {
		.MuiBadge-badge {
			right: -.25rem;
			top: -.23rem;
			color: white;
		}
	}
`
function TabbedView(props)
{
	const [currentTab, setCurrentTab] = useState(0)
	//console.log(props)

	const tabs = useMemo(() => {
		const tabs = []
		tabs.push(<Tab style={{'textTransform': 'none'}} label={
			<Temp badgeContent={props.numForbidden} variant='standard' color='secondary' overlap='rectangle' >
				Forbidden
			</Temp> } {...allyProps(0) }
		/>)
		tabs.push(<Tab style={{ 'textTransform': 'none' }} label={
			<Temp badgeContent={props.numLimited} variant='standard' color='secondary' overlap='rectangle' >
				Limited
			</Temp> } {...allyProps(0) } {...allyProps(1)} />)
		tabs.push(<Tab style={{ 'textTransform': 'none' }} label={
			<Temp badgeContent={props.numSemiLimited} variant='standard' color='secondary' overlap='rectangle' >
				Semi-Limited
			</Temp> } {...allyProps(0) } {...allyProps(2)} />)
		return tabs
	}, [props.numForbidden, props.numLimited, props.numSemiLimited])

	const forbiddenTabContent = useMemo(() => {
		return <TabPanel value={ currentTab } index={0}>
			{props.forbiddenContent}
		</TabPanel>
	}, [props.forbiddenContent, currentTab])

	const limitedTabContent = useMemo(() => {
		return <TabPanel value={ currentTab } index={1}>
		{props.limitedContent}
	</TabPanel>
	}, [props.limitedContent, currentTab])

	const semiLimitedTabContent = useMemo(() => {
		return <TabPanel value={ currentTab } index={2}>
		{props.semiLimitedContent}
	</TabPanel>
	}, [props.semiLimitedContent, currentTab])


		return (
			<div style={{ marginLeft: '-.85rem', marginRight: '-.85rem' }}>
				<AppBar position='sticky'>
					<Tabs value={currentTab} onChange={(event, newValue) => { setCurrentTab(newValue)}} variant='fullWidth' >
						{tabs}
					</Tabs>
				</AppBar>

				<div style={{ padding: '.85rem' }} >
					{forbiddenTabContent}
					{limitedTabContent}
					{semiLimitedTabContent}
				</div>
			</div>
		)
}

function allyProps(index)
{
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	}
}

export default TabbedView