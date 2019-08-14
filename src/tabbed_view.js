import React, { Component } from 'react'
import { AppBar, Tabs, Tab } from '@material-ui/core'

import SwipeableViews from 'react-swipeable-views';

import TabPanel from './tab_panel'

class TabbedView extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			currentTab: 0,
		}

		this.allyProps = this.allyProps.bind(this)
	}

	allyProps(index) {
		return {
			id: `full-width-tab-${index}`,
			'aria-controls': `full-width-tabpanel-${index}`,
		};
	}

	render()
	{
		return (
		<div>
		<AppBar position='static' >
			<Tabs value={this.state.currentTab} onChange={(event, newValue) => { this.setState({ currentTab: newValue }) }} variant='fullWidth' >
				<Tab label='Forbidden' {...this.allyProps(0)} />
				<Tab label='Limited' {...this.allyProps(1)} />
				<Tab label='Semi-Limited' {...this.allyProps(2)} />
			</Tabs>
		</AppBar>
			<SwipeableViews
				index={this.state.currentTab}
				onChangeIndex={(newValue) => { console.log(this.state.currentTab, newValue); this.setState({ currentTab: newValue }) }}
			>
				<TabPanel value={ this.state.currentTab } index={0}>
					{console.log(this.props.content)}
						{this.props.content[0]}
				</TabPanel>
					<TabPanel value={ this.state.currentTab } index={1}>
						{this.props.content[1]}
				</TabPanel>
					<TabPanel value={ this.state.currentTab } index={2}>
						{this.props.content[2]}
				</TabPanel>
			</SwipeableViews>
			</div>
		)
	}
}

export default TabbedView