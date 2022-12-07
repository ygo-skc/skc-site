import { useState, FC } from 'react'
import { Tab } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import { TabbedView, TabPanel, allyProps } from './TabbedView'
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone'
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone'
import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone'

type _NormalFormatTabbedView = {
	numForbidden: number
	numLimitedOne: number
	numLimitedTwo: number
	numLimitedThree: number
	forbiddenContent: JSX.Element
	limitedOneContent: JSX.Element
	limitedTwoContent: JSX.Element
	limitedThreeContent: JSX.Element
}

const NormalFormatTabbedView: FC<_NormalFormatTabbedView> = ({
	numForbidden,
	numLimitedOne,
	numLimitedTwo,
	numLimitedThree,
	forbiddenContent,
	limitedOneContent,
	limitedTwoContent,
	limitedThreeContent,
}) => {
	const [currentTab, setCurrentTab] = useState(0)

	return (
		<TabbedView
			tabs={[
				<Tab key='forbidden' className='tab' icon={<BlockIcon className='forbidden-icon' />} label={numForbidden} {...allyProps(0)} />,
				<Tab key='limited-one' className='tab' icon={<Filter1TwoToneIcon className='limited-one-icon' />} label={numLimitedOne} {...allyProps(1)} />,
				<Tab key='limited-two' className='tab' icon={<Filter2TwoToneIcon className='limited-two-icon' />} label={numLimitedTwo} {...allyProps(2)} />,
				<Tab key='limited-three' className='tab' icon={<Filter3TwoToneIcon className='limited-three-icon' />} label={numLimitedThree} {...allyProps(2)} />,
			]}
			tabPanels={[
				<TabPanel key='forbidden-tab' value={currentTab} index={0}>
					{forbiddenContent}
				</TabPanel>,
				<TabPanel key='limited-one-tab' value={currentTab} index={1}>
					{limitedOneContent}
				</TabPanel>,
				<TabPanel key='limited-two-tab' value={currentTab} index={2}>
					{limitedTwoContent}
				</TabPanel>,
				<TabPanel key='limited-three-tab' value={currentTab} index={3}>
					{limitedThreeContent}
				</TabPanel>,
			]}
			currentTab={currentTab}
			setCurrentTab={setCurrentTab}
		/>
	)
}

export default NormalFormatTabbedView
