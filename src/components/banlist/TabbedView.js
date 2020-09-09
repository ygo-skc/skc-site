import React, { useState, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { AppBar, Tabs, Tab, Badge } from '@material-ui/core'

import { TabPanel } from './TabPanel'



const SummaryBadge = styled(Badge)`
	&& {
		.MuiBadge-badge {
			right: -.5rem;
			top: -.5rem;
			color: white;
		}
	}
`
const TabbedView = memo( ( { numForbidden, numLimited, numSemiLimited, forbiddenContent, limitedContent, semiLimitedContent } ) =>
{
	const [currentTab, setCurrentTab] = useState(0)
	const [tabs, setTabs] = useState([])

	useEffect( () => {
		const tabs = []
		tabs.push(
			<Tab
				key='forbidden'
				style={{'textTransform': 'none'}}
				label={
					<SummaryBadge
						badgeContent={ numForbidden }
						variant='standard'
						color='secondary'
						overlap='rectangle' >
						Forbidden
					</SummaryBadge>
				}
				{...allyProps(0) }
			/>
		)

		tabs.push(
			<Tab
				key='limited'
				style={{ 'textTransform': 'none' }}
				label={
					<SummaryBadge
						badgeContent={ numLimited }
						variant='standard'
						color='secondary'
						overlap='rectangle' >
						Limited
					</SummaryBadge>
				}
				{...allyProps(1) }
			/>
		)

		tabs.push(
			<Tab
				key='semiLimited'
				style={{ 'textTransform': 'none' }}
				label={
					<SummaryBadge
						badgeContent={ numSemiLimited }
						variant='standard'
						color='secondary'
						overlap='rectangle' >
						Semi-Limited
					</SummaryBadge>
				}
				{...allyProps(2) }
			/>)

		setTabs(tabs)
	}, [ numForbidden, numLimited, numSemiLimited ])


		return (
			<div style={{width: '100%'}} >
				<AppBar
					style={{boxShadow: 'none'}}
					position='static'
					color='transparent'
				>
					<Tabs
						textColor='primary'
						value={currentTab}
						onChange={(event, newValue) => { setCurrentTab(newValue)}}
						centered
						variant='fullWidth' >
						{tabs}
					</Tabs>
				</AppBar>

				<div >
					<TabPanel value={ currentTab } index={0}>
						{ forbiddenContent }
					</TabPanel>

					<TabPanel value={ currentTab } index={1}>
						{ limitedContent }
					</TabPanel>

					<TabPanel value={ currentTab } index={2}>
						{ semiLimitedContent }
					</TabPanel>
				</div>
			</div>
		)
}, (prevProps, nextProps) => {
	if (prevProps.forbiddenContent !== nextProps.forbiddenContent || prevProps.limitedContent !== nextProps.limitedContent || prevProps.semiLimitedContent !== nextProps.semiLimitedContent || prevProps.banList !== nextProps.banList)	return false
	return true
})

function allyProps(index)
{
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	}
}


TabbedView.propTypes =
{
	numForbidden: PropTypes.number.isRequired,
	numLimited: PropTypes.number.isRequired,
	numSemiLimited: PropTypes.number
}


export default TabbedView