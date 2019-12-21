import React, { useState } from 'react'
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

	console.log(props)

		return (
			<div>
				<AppBar position='sticky' >
					<Tabs value={currentTab} onChange={(event, newValue) => { setCurrentTab(newValue)}} variant='fullWidth' >
						<Tab style={{'textTransform': 'none'}} label={
							<Temp badgeContent={props.numForbidden} variant='standard' color='secondary' overlap='rectangle' >
								Forbidden
							</Temp> } {...allyProps(0) }
						/>
						<Tab style={{ 'textTransform': 'none' }} label={
							<Temp badgeContent={props.numLimited} variant='standard' color='secondary' overlap='rectangle' >
								Limited
							</Temp> } {...allyProps(0) } {...allyProps(1)} />
						<Tab style={{ 'textTransform': 'none' }} label={
							<Temp badgeContent={props.numSemiLimited} variant='standard' color='secondary' overlap='rectangle' >
								Semi-Limited
							</Temp> } {...allyProps(0) } {...allyProps(2)} />
					</Tabs>
				</AppBar>

				<TabPanel value={ currentTab } index={0}>
					{props.content[0]}
				</TabPanel>
				<TabPanel value={ currentTab } index={1}>
					{props.content[1]}
				</TabPanel>
				<TabPanel value={ currentTab } index={2}>
					{props.content[2]}
				</TabPanel>
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