import { FC, Fragment, ReactElement, useCallback } from 'react'
import { AppBar, Tabs, Typography } from '@mui/material'

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
	tabs: JSX.Element[]
	tabPanels: JSX.Element[]
	currentTab: number
	setCurrentTab: any
}

const TabbedView: FC<_TabbedView> = ({ tabs, tabPanels, currentTab, setCurrentTab }) => {
	const handleTabClicked = useCallback((_: React.SyntheticEvent, newValue: number) => setCurrentTab(newValue), [])

	return (
		<Fragment>
			<AppBar className='tab-container' position='sticky'>
				<Tabs className='tabs' textColor='primary' value={currentTab} onChange={handleTabClicked} variant='fullWidth'>
					{tabs}
				</Tabs>
			</AppBar>

			{tabPanels}
		</Fragment>
	)
}

function allyProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	}
}

export { TabbedView, TabPanel, allyProps }
