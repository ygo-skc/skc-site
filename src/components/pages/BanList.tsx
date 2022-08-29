import { lazy, useState, useEffect, Suspense, useReducer } from 'react'
import { Helmet } from 'react-helmet'

import { Skeleton } from '@mui/material'
import Fetch from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import BreadCrumb from '../header-footer/Breadcrumb'

import '../../css/main-pages/ban-list.css'
import Section from '../util/Section'
import TabbedView from '../banlist/TabbedView'
import BanListSection from '../banlist/BanListSection'
import BanListChangedStatus from '../banlist/BanListChangedStatus'

const BanListDates = lazy(() => import('../banlist/BanListDates'))
// const BanListStats = lazy(() => import('./BanListStats'))

function dateReducer(_: { banListStartDates: string; banContentLinks: SKCBanListDateLinks }, action: any) {
	return { banListStartDates: action.banListStartDates, banContentLinks: action.banContentLinks }
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
		case 'UPDATE_REMOVED':
			return {
				...state,
				removedCards: action.removedCards,
				numRemoved: action.numRemoved,
			}
		case 'UPDATE_NEW':
			return {
				...state,
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
	const [{ banListStartDates, banContentLinks }, dateDispatch] = useReducer(dateReducer, { banListStartDates: [], banContentLinks: [] })

	const [selectedBanList, setSelectedBanList] = useState<string>('')
	const [isFetchingBanList, setIsFetchingBanList] = useState(true)
	const [isFetchingBanListNewContent, setFetchingBanListNewContent] = useState(true)
	const [isFetchingBanListRemovedContent, setFetchingBanListRemovedContent] = useState(true)

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

	useEffect(() => {
		Fetch.handleFetch(DownstreamServices.NAME_maps_ENDPOINT['banListsUrl'], (json) => {
			dateDispatch({
				type: 'UPDATE_BAN_LIST',
				banContentLinks: json.banListDates.map((item: SKCBanListDate) => item._links),
				banListStartDates: json.banListDates.map((item: SKCBanListDate) => item.effectiveDate),
			})
		})
	}, [])

	useEffect(() => {
		if (banContentLinks.length !== 0) setSelectedBanList(banListStartDates[0])
	}, [banContentLinks, banListStartDates])

	useEffect(() => {
		if (selectedBanList && selectedBanList.length !== 0) {
			setIsFetchingBanList(true)
			setFetchingBanListNewContent(true)
			setFetchingBanListRemovedContent(true)

			Fetch.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List New Content'].href, (json) => {
				selectedBanListDispatch({
					type: 'UPDATE_NEW',
					newForbiddenCards: json.newForbidden,
					newLimitedCards: json.newLimited,
					newSemiLimitedCards: json.newSemiLimited,
					numNewForbidden: json.numNewForbidden,
					numNewLimited: json.numNewLimited,
					numNewSemiLimited: json.numNewSemiLimited,
				})

				setFetchingBanListNewContent(false)
				console.log(isFetchingBanListNewContent)
			})

			Fetch.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List Removed Content'].href, (json) => {
				selectedBanListDispatch({
					type: 'UPDATE_REMOVED',
					removedCards: json.removedCards,
					numRemoved: determineListSize(json.numRemoved),
				})

				setFetchingBanListRemovedContent(false)
			})

			Fetch.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List Content'].href, (json) => {
				selectedBanListDispatch({
					type: 'UPDATE_LIST',
					forbidden: json.forbidden,
					limited: json.limited,
					semiLimited: json.semiLimited,
					numForbidden: determineListSize(json.numForbidden),
					numLimited: determineListSize(json.numLimited),
					numSemiLimited: determineListSize(json.numSemiLimited),
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
					<Suspense fallback={<Skeleton variant='rectangular' width='100%' height='300px' />}>
						<Section
							sticky
							sectionHeaderBackground={'ban-list'}
							sectionName='Overview'
							sectionContent={
								<div className='section-content'>
									<BanListDates banListStartDates={banListStartDates} setSelectedBanList={(ind: number) => setSelectedBanList(banListStartDates[ind])} />
								</div>
							}
						/>
					</Suspense>
				}
				twoThirdComponent={
					<Suspense fallback={<div />}>
						<BanListChangedStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} isLoadingData={isFetchingBanListNewContent} />
						<BanListChangedStatus newStatusName='Limited' cards={newLimitedCards} numCards={numNewLimited} isLoadingData={isFetchingBanListNewContent} />
						<BanListChangedStatus newStatusName='Semi Limited' cards={newSemiLimitedCards} numCards={numNewSemiLimited} isLoadingData={isFetchingBanListNewContent} />

						<BanListChangedStatus newStatusName='Unlimited' cards={removedCards} numCards={numRemoved} isLoadingData={isFetchingBanListRemovedContent} />

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
