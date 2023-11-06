import { FC, Suspense, memo, useCallback, useEffect, useState } from 'react'
import { Section } from 'skc-rcl'
import BanListSection from '../BanListSection'
import { AppBar, Skeleton, Tab, Tabs } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone'
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone'
import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone'
import LooksOneTwoToneIcon from '@mui/icons-material/LooksOneTwoTone'
import LooksTwoTwoToneIcon from '@mui/icons-material/LooksTwoTwoTone'

type BanListContentProps = {
	normalFormatContent: SKCBanListContentNormalFormat
	dlFormatContent: SKCBanListContentDuelLinksFormat
	format: string
	isFetchingBanList: boolean
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
}

function allyProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	}
}

const BanListContent: FC<BanListContentProps> = memo(
	({ normalFormatContent, dlFormatContent, isFetchingBanList, isFetchingBanListNewContent, isFetchingBanListRemovedContent, format }) => {
		const [currentTab, setCurrentTab] = useState(0)
		const [tabs, setTabs] = useState<JSX.Element[]>([])
		const [tabContent, setTabContent] = useState<JSX.Element[]>([])

		const handleTabClicked = useCallback((_: React.SyntheticEvent, newValue: number) => setCurrentTab(newValue), [])

		const isFetching = isFetchingBanList && isFetchingBanListNewContent && isFetchingBanListRemovedContent

		useEffect(() => {
			if (format !== 'DL') {
				setTabs([
					<Tab key='forbidden' className='tab' icon={<BlockIcon className='forbidden-icon' />} label={normalFormatContent.numForbidden} {...allyProps(0)} />,
					<Tab key='limited' className='tab' icon={<LooksOneTwoToneIcon className='limited-icon' />} label={normalFormatContent.numLimited} {...allyProps(1)} />,
					<Tab key='semiLimited' className='tab' icon={<LooksTwoTwoToneIcon className='semi-limited-icon' />} label={normalFormatContent.numSemiLimited} {...allyProps(2)} />,
				])
				setTabContent([
					<BanListSection
						key='forbidden-tab'
						value={currentTab}
						index={0}
						sectionExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format'
						cards={normalFormatContent.forbidden}
						isFetchingBanList={isFetching}
					/>,
					<BanListSection
						key='limited-tab'
						value={currentTab}
						index={1}
						sectionExplanation='Limited cards can be included in Deck/Side deck - max 1'
						cards={normalFormatContent.limited}
						isFetchingBanList={isFetching}
					/>,
					<BanListSection
						key='semi-limited-tab'
						value={currentTab}
						index={2}
						sectionExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2'
						cards={normalFormatContent.semiLimited}
						isFetchingBanList={isFetching}
					/>,
				])
			} else {
				setTabs([
					<Tab key='forbidden' className='tab' icon={<BlockIcon className='forbidden-icon' />} label={normalFormatContent.numForbidden} {...allyProps(0)} />,
					<Tab key='limited-one' className='tab' icon={<Filter1TwoToneIcon className='limited-one-icon' />} label={dlFormatContent.numLimitedOne} {...allyProps(1)} />,
					<Tab key='limited-two' className='tab' icon={<Filter2TwoToneIcon className='limited-two-icon' />} label={dlFormatContent.numLimitedTwo} {...allyProps(2)} />,
					<Tab key='limited-three' className='tab' icon={<Filter3TwoToneIcon className='limited-three-icon' />} label={dlFormatContent.numLimitedThree} {...allyProps(3)} />,
				])
				setTabContent([
					<BanListSection
						key='forbidden-tab'
						value={currentTab}
						index={0}
						sectionExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format'
						cards={normalFormatContent.forbidden}
						isFetchingBanList={isFetching}
					/>,
					<BanListSection
						key='limited-one-tab'
						value={currentTab}
						index={1}
						sectionExplanation='You can only use a maximum of one card in the Limited One list in your deck'
						cards={dlFormatContent.limitedOne}
						isFetchingBanList={isFetching}
					/>,
					<BanListSection
						key='limited-two-tab'
						value={currentTab}
						index={2}
						sectionExplanation='You can only use a maximum of two card in the Limited Two list in your deck'
						cards={dlFormatContent.limitedTwo}
						isFetchingBanList={isFetching}
					/>,
					<BanListSection
						key='limited-three-tab'
						value={currentTab}
						index={3}
						sectionExplanation='You can only use a maximum of three card in the Limited Three list in your deck'
						cards={dlFormatContent.limitedThree}
						isFetchingBanList={isFetching}
					/>,
				])
			}
		}, [format, normalFormatContent, dlFormatContent, currentTab])

		return (
			<Section sectionHeaderBackground={'ban-list'} sectionName='Content'>
				<div className='section-content'>
					<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='250px' />}>
						<AppBar className='tab-container' position='sticky'>
							<Tabs className='tabs' textColor='primary' value={currentTab} onChange={handleTabClicked} variant='fullWidth'>
								{tabs}
							</Tabs>
						</AppBar>

						{tabContent}
					</Suspense>
				</div>
			</Section>
		)
	},
	(prevProps, nextProps) => {
		return (
			prevProps.isFetchingBanList === nextProps.isFetchingBanList &&
			prevProps.isFetchingBanListNewContent === nextProps.isFetchingBanListNewContent &&
			prevProps.isFetchingBanListRemovedContent === nextProps.isFetchingBanListRemovedContent &&
			prevProps.format === nextProps.format &&
			// if format is non DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format !== 'DL' &&
				(prevProps.normalFormatContent.numForbidden !== nextProps.normalFormatContent.numForbidden ||
					prevProps.normalFormatContent.numLimited !== nextProps.normalFormatContent.numLimited ||
					prevProps.normalFormatContent.numSemiLimited !== nextProps.normalFormatContent.numSemiLimited)
			) &&
			// if format is DL - check to see if at least one of the content arrays changed - negate condition as falsy means component should re-render
			!(
				prevProps.format === 'DL' &&
				(prevProps.dlFormatContent.numForbidden !== nextProps.dlFormatContent.numForbidden ||
					prevProps.dlFormatContent.numLimitedOne !== nextProps.dlFormatContent.numLimitedOne ||
					prevProps.dlFormatContent.numLimitedTwo !== nextProps.dlFormatContent.numLimitedTwo ||
					prevProps.dlFormatContent.numLimitedThree !== nextProps.dlFormatContent.numLimitedThree)
			)
		)
	}
)

BanListContent.displayName = 'BanListContentNormalFormat'
export default BanListContent
