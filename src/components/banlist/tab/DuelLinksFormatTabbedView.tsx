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
				<Tab key='forbidden' className='tab' icon={<BlockIcon color='error' style={{ fontSize: '1.8rem' }} />} label={numForbidden} {...allyProps(0)} />,
				<Tab key='limited-one' className='tab' icon={<Filter1TwoToneIcon style={{ color: '#ff9100', fontSize: '1.8rem' }} />} label={numLimitedOne} {...allyProps(1)} />,
				<Tab key='limited-two' className='tab' icon={<Filter2TwoToneIcon style={{ color: '#4caf50', fontSize: '1.8rem' }} />} label={numLimitedTwo} {...allyProps(2)} />,
				<Tab key='limited-three' className='tab' icon={<Filter3TwoToneIcon style={{ color: '#00B5E2', fontSize: '1.8rem' }} />} label={numLimitedThree} {...allyProps(2)} />,
			]}
			tabPanels={[
				<TabPanel value={currentTab} index={0}>
					{forbiddenContent}
				</TabPanel>,
				<TabPanel value={currentTab} index={1}>
					{limitedOneContent}
				</TabPanel>,
				<TabPanel value={currentTab} index={2}>
					{limitedTwoContent}
				</TabPanel>,
				<TabPanel value={currentTab} index={3}>
					{limitedThreeContent}
				</TabPanel>,
			]}
			currentTab={currentTab}
			setCurrentTab={setCurrentTab}
		/>
	)
}

export default NormalFormatTabbedView
