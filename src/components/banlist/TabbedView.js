import React, { useState, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { AppBar, Tabs, Tab, Badge } from '@material-ui/core'

import { TabPanel } from './TabPanel'
import { BanListSection } from './BanListSection'



const SummaryBadge = styled(Badge)`
	&& {
		.MuiBadge-badge {
			right: -.25rem;
			top: -.23rem;
			color: white;
		}
	}
`
export const TabbedView = memo( ( { numForbidden, numLimited, numSemiLimited, forbiddenContent, limitedContent, semiLimitedContent } ) =>
{
	const [currentTab, setCurrentTab] = useState(0)
	const [tabs, setTabs] = useState([])

	useEffect( () => {
		const tabs = []
		tabs.push(
			<Tab
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
			<div style={{ marginLeft: '-.85rem', marginRight: '-.85rem' }}>
				<AppBar
					style={{boxShadow: 'none', background: 'rgba(0, 0, 0, .12)'}}
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

				<div style={{ padding: '.85rem' }} >
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
	numSemiLimited: PropTypes.number,
	forbiddenContent: PropTypes.objectOf(BanListSection).isRequired,
	limitedContent: PropTypes.objectOf(BanListSection).isRequired,
	semiLimitedContent: PropTypes.objectOf(BanListSection).isRequired
}