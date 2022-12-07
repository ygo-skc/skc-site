import { useState, FC } from 'react'
import { Tab } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import LooksOneTwoToneIcon from '@mui/icons-material/LooksOneTwoTone'
import LooksTwoTwoToneIcon from '@mui/icons-material/LooksTwoTwoTone'
import { TabbedView, TabPanel, allyProps } from './TabbedView'

type _NormalFormatTabbedView = {
	numForbidden: number
	numLimited: number
	numSemiLimited: number
	forbiddenContent: JSX.Element
	limitedContent: JSX.Element
	semiLimitedContent: JSX.Element
}

const NormalFormatTabbedView: FC<_NormalFormatTabbedView> = ({ numForbidden, numLimited, numSemiLimited, forbiddenContent, limitedContent, semiLimitedContent }) => {
	const [currentTab, setCurrentTab] = useState(0)

	return (
		<TabbedView
			tabs={[
				<Tab key='forbidden' className='tab' icon={<BlockIcon className='forbidden-icon' />} label={numForbidden} {...allyProps(0)} />,
				<Tab key='limited' className='tab' icon={<LooksOneTwoToneIcon className='limited-icon' />} label={numLimited} {...allyProps(1)} />,
				<Tab key='semiLimited' className='tab' icon={<LooksTwoTwoToneIcon className='semi-limited-icon' />} label={numSemiLimited} {...allyProps(2)} />,
			]}
			tabPanels={[
				<TabPanel key='forbidden-tab' value={currentTab} index={0}>
					{forbiddenContent}
				</TabPanel>,
				<TabPanel key='limited-tab' value={currentTab} index={1}>
					{limitedContent}
				</TabPanel>,
				<TabPanel key='semi-limited-tab' value={currentTab} index={2}>
					{semiLimitedContent}
				</TabPanel>,
			]}
			currentTab={currentTab}
			setCurrentTab={setCurrentTab}
		/>
	)
}

export default NormalFormatTabbedView
