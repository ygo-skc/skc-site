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
				<Tab key='forbidden' className='tab' icon={<BlockIcon color='error' style={{ fontSize: '1.8rem' }} />} label={numForbidden} {...allyProps(0)} />,
				<Tab key='limited' className='tab' icon={<LooksOneTwoToneIcon style={{ color: '#ff9100', fontSize: '1.8rem' }} />} label={numLimited} {...allyProps(1)} />,
				<Tab key='semiLimited' className='tab' icon={<LooksTwoTwoToneIcon style={{ color: '#4caf50', fontSize: '1.8rem' }} />} label={numSemiLimited} {...allyProps(2)} />,
			]}
			tabPanels={[
				<TabPanel value={currentTab} index={0}>
					{forbiddenContent}
				</TabPanel>,
				<TabPanel value={currentTab} index={1}>
					{limitedContent}
				</TabPanel>,
				<TabPanel value={currentTab} index={2}>
					{semiLimitedContent}
				</TabPanel>,
			]}
			currentTab={currentTab}
			setCurrentTab={setCurrentTab}
		/>
	)
}

export default NormalFormatTabbedView
