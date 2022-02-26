import { lazy, useState, useEffect, Suspense, useReducer } from 'react'
import { Helmet } from 'react-helmet'

import { Skeleton } from '@mui/material'
import Fetch from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import BreadCrumb from '../header-footer/Breadcrumb'

import '../../css/main-pages/ban-list.css'
import Section from '../util/Section'
import TabbedView from './TabbedView'
import BanListSection from './BanListSection'

const BanListDates = lazy(() => import('./BanListDates'))
const BanListStats = lazy(() => import('./BanListStats'))

function dateReducer(_: any, action: any) {
	return { banListStartDates: action.banListStartDates, banListInstanceLinks: action.banListInstanceLinks }
}

function determineListSize(size: number | undefined): number {
	return size === undefined ? 0 : size
}

function currentlySelectedBanListReducer(state: any, action: any) {
	switch (action.type) {
		case 'UPDATE_LIST':
			return {
				...state,
				forbidden: action.forbidden,
				limited: action.limited,
				semiLimited: action.semiLimited,
				numForbidden: action.numForbidden,
				numLimited: action.numLimited,
				numSemiLimited: action.numSemiLimited,
			}
		case 'UPDATE_DIFF':
			return {
				...state,
				removedCards: action.removedCards,
				numRemoved: action.numRemoved,
				newForbiddenCards: action.newForbiddenCards,
				newLimitedCards: action.newLimitedCards,
				newSemiLimitedCards: action.newSemiLimitedCards,
				numNewForbidden: action.numNewForbidden,
				numNewLimited: action.numNewLimited,
				numNewSemiLimited: action.numNewSemiLimited,
			}
		default:
			return state
	}
}

export default function BanList() {
	const [{ banListStartDates, banListInstanceLinks }, dateDispatch] = useReducer(dateReducer, { banListStartDates: [], banListInstanceLinks: [] })
	const [
		{
			forbidden,
			limited,
			semiLimited,
			numForbidden,
			numLimited,
			numSemiLimited,
			removedCards,
			numRemoved,
			newForbiddenCards,
			newLimitedCards,
			newSemiLimitedCards,
			numNewForbidden,
			numNewLimited,
			numNewSemiLimited,
		},
		selectedBanListDispatch,
	] = useReducer(currentlySelectedBanListReducer, {
		forbidden: [],
		limited: [],
		semiLimited: [],
		numForbidden: 0,
		numLimited: 0,
		numSemiLimited: 0,
		removedCards: [],
		numRemoved: 0,
		newForbiddenCards: [],
		newLimitedCards: [],
		newSemiLimitedCards: [],
		numNewForbidden: 0,
		numNewLimited: 0,
		numNewSemiLimited: 0,
	})

	const [selectedBanList, setSelectedBanList] = useState<string>('')

	const [isFetchingBanList, setIsFetchingBanList] = useState(true)

	useEffect(() => {
		Fetch.handleFetch(DownstreamServices.NAME_maps_ENDPOINT['banListsUrl'], (json) => {
			dateDispatch({
				type: 'UPDATE_BAN_LIST',
				banListInstanceLinks: json.banListDates.map((item: SKCBanListDate) => item._links['Ban List Content'].href),
				banListStartDates: json.banListDates.map((item: SKCBanListDate) => item.effectiveDate),
			})
		})
	}, [])

	useEffect(() => {
		if (banListInstanceLinks.length !== 0) setSelectedBanList(banListStartDates[0])
	}, [banListInstanceLinks, banListStartDates])

	useEffect(() => {
		if (selectedBanList && selectedBanList.length !== 0) {
			setIsFetchingBanList(true)

			Fetch.handleFetch(banListInstanceLinks[banListStartDates.indexOf(selectedBanList)], (json) => {
				selectedBanListDispatch({
					type: 'UPDATE_LIST',
					forbidden: json.banListInstance.forbidden,
					limited: json.banListInstance.limited,
					semiLimited: json.banListInstance.semiLimited,
					numForbidden: determineListSize(json.banListInstance.numForbidden),
					numLimited: determineListSize(json.banListInstance.numLimited),
					numSemiLimited: determineListSize(json.banListInstance.numSemiLimited),
				})

				selectedBanListDispatch({
					type: 'UPDATE_DIFF',
					removedCards: json.banListInstance.removedContent.removedCards,
					numRemoved: determineListSize(json.banListInstance.removedContent.numRemoved),
					newForbiddenCards: json.banListInstance.newContent.newForbidden,
					newLimitedCards: json.banListInstance.newContent.newLimited,
					newSemiLimitedCards: json.banListInstance.newContent.newSemiLimited,
					numNewForbidden: json.banListInstance.newContent.numNewForbidden,
					numNewLimited: json.banListInstance.newContent.numNewLimited,
					numNewSemiLimited: json.banListInstance.newContent.numNewSemiLimited,
				})

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
						<Section
							sticky
							sectionHeaderBackground={'ban-list'}
							sectionName='Overview'
							sectionContent={
								<div className='section-content'>
									<BanListDates banListStartDates={banListStartDates} setSelectedBanList={(ind: number) => setSelectedBanList(banListStartDates[ind])} />

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
							}
						/>
					</Suspense>
				}
				twoThirdComponent={
					<Suspense fallback={<div />}>
						<Section
							sectionHeaderBackground={'ban-list'}
							sectionName='Content'
							sectionContent={
								<div className='sticky section-content'>
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
										limitedContent={
											<BanListSection sectionExplanation='Limited cards can be included in Deck/Side deck - max 1' cards={limited} isDataLoaded={!isFetchingBanList} />
										}
										semiLimitedContent={
											<BanListSection sectionExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2' cards={semiLimited} isDataLoaded={!isFetchingBanList} />
										}
									/>
								</div>
							}
						/>
					</Suspense>
				}
			/>
		</div>
	)
}
