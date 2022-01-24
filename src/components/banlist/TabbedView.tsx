import { useState, memo, FC, ReactElement } from 'react'
import { AppBar, Tabs, Tab, Typography } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import LooksOneTwoToneIcon from '@mui/icons-material/LooksOneTwoTone'
import LooksTwoTwoToneIcon from '@mui/icons-material/LooksTwoTwoTone'

type _TabPanel = {
	children: ReactElement
	value: number
	index: number
}

const TabPanel: FC<_TabPanel> = ({ children, value, index }) => {
	return (
		<Typography component='div' role='tabpanel' hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`}>
			{children}
		</Typography>
	)
}

type _TabbedView = {
	numForbidden: number
	numLimited: number
	numSemiLimited: number
	forbiddenContent: JSX.Element
	limitedContent: JSX.Element
	semiLimitedContent: JSX.Element
}

const TabbedView: FC<_TabbedView> = memo(
	({ numForbidden, numLimited, numSemiLimited, forbiddenContent, limitedContent, semiLimitedContent }) => {
		const [currentTab, setCurrentTab] = useState(0)

		return (
			<div>
				<AppBar className='tab-container' position='sticky'>
					<Tabs
						className='tabs'
						textColor='primary'
						value={currentTab}
						onChange={(_event, newValue: number) => {
							setCurrentTab(newValue)
						}}
						variant='fullWidth'
					>
						{[
							<Tab key='forbidden' className='tab' icon={<BlockIcon color='error' style={{ fontSize: '1.8rem' }} />} label={numForbidden} {...allyProps(0)} />,
							<Tab key='limited' className='tab' icon={<LooksOneTwoToneIcon style={{ color: '#ff9100', fontSize: '1.8rem' }} />} label={numLimited} {...allyProps(1)} />,
							<Tab key='semiLimited' className='tab' icon={<LooksTwoTwoToneIcon style={{ color: '#4caf50', fontSize: '1.8rem' }} />} label={numSemiLimited} {...allyProps(2)} />,
						]}
					</Tabs>
				</AppBar>

				<TabPanel value={currentTab} index={0}>
					{forbiddenContent}
				</TabPanel>

				<TabPanel value={currentTab} index={1}>
					{limitedContent}
				</TabPanel>

				<TabPanel value={currentTab} index={2}>
					{semiLimitedContent}
				</TabPanel>
			</div>
		)
	},
	(prevProps, nextProps) => {
		if (
			prevProps.forbiddenContent !== nextProps.forbiddenContent ||
			prevProps.limitedContent !== nextProps.limitedContent ||
			prevProps.semiLimitedContent !== nextProps.semiLimitedContent
		)
			return false
		return true
	}
)

function allyProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	}
}

export default TabbedView
