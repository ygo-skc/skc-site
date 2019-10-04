import React, { useState } from 'react'
import { AppBar, Tabs, Tab } from '@material-ui/core'

import SwipeableViews from 'react-swipeable-views';

import TabPanel from './tab_panel'

function TabbedView(props)
{
	const [currentTab, setCurrentTab] = useState(0)

		return (
		<div>
		<AppBar position='static' >
			<Tabs value={currentTab} onChange={(event, newValue) => { setCurrentTab(newValue)}} variant='fullWidth' >
				<Tab label='Forbidden' {...allyProps(0)} />
				<Tab label='Limited' {...allyProps(1)} />
				<Tab label='Semi-Limited' {...allyProps(2)} />
			</Tabs>
		</AppBar>
			<SwipeableViews
				index={currentTab}
				onChangeIndex={(newValue) => { setCurrentTab(newValue)}}
			>
				<TabPanel value={ currentTab } index={0}>
						{props.content[0]}
				</TabPanel>
					<TabPanel value={ currentTab } index={1}>
						{props.content[1]}
				</TabPanel>
					<TabPanel value={ currentTab } index={2}>
						{props.content[2]}
				</TabPanel>
			</SwipeableViews>
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