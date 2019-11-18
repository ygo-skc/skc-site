import React, { useState } from 'react'
import { AppBar, Tabs, Tab } from '@material-ui/core'

import TabPanel from './TabPanel'

function TabbedView(props)
{
	const [currentTab, setCurrentTab] = useState(0)

		return (
			<div>
				<AppBar position='sticky' >
					<Tabs value={currentTab} onChange={(event, newValue) => { setCurrentTab(newValue)}} variant='fullWidth' >
						<Tab style={{'text-transform': 'none'}} label='Forbidden' {...allyProps(0)} />
						<Tab style={{ 'text-transform': 'none' }} label='Limited' {...allyProps(1)} />
						<Tab style={{ 'text-transform': 'none' }} label='Semi-Limited' {...allyProps(2)} />
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