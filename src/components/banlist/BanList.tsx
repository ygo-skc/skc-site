import { lazy, useState, useEffect, Suspense } from 'react'
import { Helmet } from 'react-helmet'

import { Box, Divider, Skeleton } from '@mui/material'
import Fetch from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import BreadCrumb from '../header-footer/Breadcrumb'

import '../../css/util/divider.css'
import '../../css/main-pages/ban-list.css'

const BanListDates = lazy(() => import('./BanListDates'))
const TabbedView = lazy(() => import('./TabbedView'))
const BanListSection = lazy(() => import('./BanListSection'))
const BanListStats = lazy(() => import('./BanListStats'))

export default function BanList() {
	const [banListStartDates, setBanListStartDates] = useState<string[]>([])
	const [selectedBanList, setSelectedBanList] = useState<string>('')
	const [banListInstanceLinks, setBanListInstanceLinks] = useState([])

	const [forbidden, setForbidden] = useState([])
	const [limited, setLimited] = useState([])
	const [semiLimited, setSemiLimited] = useState([])

	const [numForbidden, setNumForbidden] = useState(0)
	const [numLimited, setNumLimited] = useState(0)
	const [numSemiLimited, setNumSemiLimited] = useState(0)

	const [isFetchingBanList, setIsFetchingBanList] = useState(true)

	const [newForbiddenCards, setNewForbiddenCards] = useState([])
	const [newLimitedCards, setNewLimitedCards] = useState([])
	const [newSemiLimitedCards, setNewSemiLimitedCards] = useState([])

	const [numNewForbidden, setNumNewForbidden] = useState(0)
	const [numNewLimited, setNumNewLimited] = useState(0)
	const [numNewSemiLimited, setNumNewSemiLimited] = useState(0)

	const [removedCards, setRemovedCards] = useState([])
	const [numRemoved, setNumRemoved] = useState(0)

	useEffect(() => {
		Fetch.handleFetch(DownstreamServices.NAME_maps_ENDPOINT['banListsUrl'], (json) => {
			setBanListInstanceLinks(json.banListDates.map((item: SKCBanListDate) => item._links['Ban List Content'].href))
			setBanListStartDates(json.banListDates.map((item: SKCBanListDate) => item.effectiveDate))
		})
	}, [])

	useEffect(() => {
		if (banListInstanceLinks.length !== 0) setSelectedBanList(banListStartDates[0])
	}, [banListInstanceLinks, banListStartDates])

	useEffect(() => {
		if (selectedBanList && selectedBanList.length !== 0) {
			setIsFetchingBanList(true)

			Fetch.handleFetch(banListInstanceLinks[banListStartDates.indexOf(selectedBanList)], (json) => {
				setForbidden(json.banListInstance.forbidden)
				setLimited(json.banListInstance.limited)
				setSemiLimited(json.banListInstance.semiLimited)

				setNumForbidden(json.banListInstance.numForbidden === undefined ? 0 : json.banListInstance.numForbidden)
				setNumLimited(json.banListInstance.numLimited === undefined ? 0 : json.banListInstance.numLimited)
				setNumSemiLimited(json.banListInstance.numSemiLimited === undefined ? 0 : json.banListInstance.numSemiLimited)

				// Removed cards compared to previous ban list
				setRemovedCards(json.banListInstance.removedContent.removedCards)
				setNumRemoved(json.banListInstance.removedContent.numRemoved)

				// Newly added cads compared to previous ban list
				setNewForbiddenCards(json.banListInstance.newContent.newForbidden)
				setNewLimitedCards(json.banListInstance.newContent.newLimited)
				setNewSemiLimitedCards(json.banListInstance.newContent.newSemiLimited)

				setNumNewForbidden(json.banListInstance.newContent.numNewForbidden)
				setNumNewLimited(json.banListInstance.newContent.numNewLimited)
				setNumNewSemiLimited(json.banListInstance.newContent.numNewSemiLimited)

				setIsFetchingBanList(false)
			})
		}
	}, [selectedBanList])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - Ban List: ${selectedBanList}`}</title>
				<meta name={`SKC - Ban List: ${selectedBanList}`} content={`Ban list content/info for list effective ${selectedBanList}`} />
				<meta name='keywords' content={`YuGiOh, ban list, The Supreme Kings Castle, ${selectedBanList}`} />
			</Helmet>

			<BreadCrumb crumbs={['Home', 'Ban List']} />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<Suspense fallback={<Skeleton width='100%' height='470px' />}>
						<Box className='sticky'>
							<div className='ban-list-gradient one-third-two-thirds-container'>
								<BanListDates banListStartDates={banListStartDates} setSelectedBanList={(ind: number) => setSelectedBanList(banListStartDates[ind])} />

								<Divider className='light-translucent-divider' />

								<BanListStats
									totalCardsInSelectedList={numForbidden + numLimited + numSemiLimited}
									selectedBanList={selectedBanList}
									newForbiddenCards={newForbiddenCards}
									newLimitedCards={newLimitedCards}
									newSemiLimitedCards={newSemiLimitedCards}
									numNewForbidden={numNewForbidden}
									numNewLimited={numNewLimited}
									numNewSemiLimited={numNewSemiLimited}
									removedCards={removedCards}
									numRemoved={numRemoved}
								/>
							</div>
						</Box>
					</Suspense>
				}
				twoThirdComponent={
					<Suspense fallback={<div />}>
						<div className='one-third-two-thirds-container'>
							<TabbedView
								numForbidden={numForbidden}
								numLimited={numLimited}
								numSemiLimited={numSemiLimited}
								forbiddenContent={
									<BanListSection
										sectionExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format'
										cards={forbidden}
										isDataLoaded={!isFetchingBanList}
									/>
								}
								limitedContent={<BanListSection sectionExplanation='Limited cards can be included in Deck/Side deck - max 1' cards={limited} isDataLoaded={!isFetchingBanList} />}
								semiLimitedContent={
									<BanListSection sectionExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2' cards={semiLimited} isDataLoaded={!isFetchingBanList} />
								}
							/>
						</div>
					</Suspense>
				}
			/>
		</div>
	)
}
