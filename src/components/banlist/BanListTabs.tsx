import { useState, FC, Fragment, useCallback, ReactElement } from 'react'
import { Tab, AppBar, Tabs, Typography } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone'
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone'
import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone'
import LooksOneTwoToneIcon from '@mui/icons-material/LooksOneTwoTone'
import LooksTwoTwoToneIcon from '@mui/icons-material/LooksTwoTwoTone'

type TabbedView2Props = {
	format: string

	numForbidden: number
	numLimited: number
	numSemiLimited: number
	numLimitedOne: number
	numLimitedTwo: number
	numLimitedThree: number

	forbiddenContent: JSX.Element
	limitedContent: JSX.Element
	semiLimitedContent: JSX.Element
	limitedOneContent: JSX.Element
	limitedTwoContent: JSX.Element
	limitedThreeContent: JSX.Element
}

const BanListTabs: FC<TabbedView2Props> = ({
	format,
	numForbidden,
	numLimited,
	numSemiLimited,
	numLimitedOne,
	numLimitedTwo,
	numLimitedThree,
	forbiddenContent,
	limitedContent,
	semiLimitedContent,
	limitedOneContent,
	limitedTwoContent,
	limitedThreeContent,
}) => {
	const [currentTab, setCurrentTab] = useState(0)

	const handleTabClicked = useCallback((_: React.SyntheticEvent, newValue: number) => setCurrentTab(newValue), [])

	return (
		<Fragment>
			<AppBar className='tab-container' position='sticky'>
				<Tabs className='tabs' textColor='primary' value={currentTab} onChange={handleTabClicked} variant='fullWidth'>
					<Tab key='forbidden' className='tab' icon={<BlockIcon className='forbidden-icon' />} label={numForbidden} {...allyProps(0)} />
					{format === 'DL' && <Tab key='limited-one' className='tab' icon={<Filter1TwoToneIcon className='limited-one-icon' />} label={numLimitedOne} {...allyProps(1)} />}
					{format === 'DL' && <Tab key='limited-two' className='tab' icon={<Filter2TwoToneIcon className='limited-two-icon' />} label={numLimitedTwo} {...allyProps(2)} />}
					{format === 'DL' && <Tab key='limited-three' className='tab' icon={<Filter3TwoToneIcon className='limited-three-icon' />} label={numLimitedThree} {...allyProps(3)} />}
					{format !== 'DL' && <Tab key='limited' className='tab' icon={<LooksOneTwoToneIcon className='limited-icon' />} label={numLimited} {...allyProps(1)} />}
					{format !== 'DL' && <Tab key='semiLimited' className='tab' icon={<LooksTwoTwoToneIcon className='semi-limited-icon' />} label={numSemiLimited} {...allyProps(2)} />}
				</Tabs>
			</AppBar>

			<TabPanel key='forbidden-tab' value={currentTab} index={0}>
				{forbiddenContent}
			</TabPanel>
			{format === 'DL' && (
				<TabPanel key='limited-one-tab' value={currentTab} index={1}>
					{limitedOneContent}
				</TabPanel>
			)}
			{format === 'DL' && (
				<TabPanel key='limited-two-tab' value={currentTab} index={2}>
					{limitedTwoContent}
				</TabPanel>
			)}
			{format === 'DL' && (
				<TabPanel key='limited-three-tab' value={currentTab} index={3}>
					{limitedThreeContent}
				</TabPanel>
			)}
			{format !== 'DL' && (
				<TabPanel key='limited-tab' value={currentTab} index={1}>
					{limitedContent}
				</TabPanel>
			)}
			{format !== 'DL' && (
				<TabPanel key='semi-limited-tab' value={currentTab} index={2}>
					{semiLimitedContent}
				</TabPanel>
			)}
		</Fragment>
	)
}

function allyProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	}
}

type TabPanelProps = {
	children: ReactElement
	value: number
	index: number
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
	return (
		<Typography component='div' role='tabpanel' hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`}>
			{children}
		</Typography>
	)
}

export default BanListTabs
