import { lazy, useState, useEffect, Suspense, useReducer } from 'react'
import { Helmet } from 'react-helmet'

import { Skeleton } from '@mui/material'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import BreadCrumb from '../header-footer/Breadcrumb'

import '../../css/main-pages/ban-list.css'
import Section from '../util/Section'
import BanListContentDuelLinksFormat from '../banlist/content/BanListContentDuelLinksFormat'

const BanListDates = lazy(() => import('../banlist/BanListDates'))
const BanListContentNormalFormat = lazy(() => import('../banlist/content/BanListContentNormalFormat'))

function dateReducer(_: { banListStartDates: string; banContentLinks: SKCBanListDateLinks }, action: any) {
	return { banListStartDates: action.banListStartDates, banContentLinks: action.banContentLinks }
}

function determineListSize(size: number | undefined): number {
	return size === undefined ? 0 : size
}

function currentlySelectedBanListReducer(state: any, action: any) {
	switch (action.type) {
		case 'UPDATE_NORMAL_FORMAT_LIST':
			return {
				...state,
				forbidden: action.forbidden,
				limited: action.limited,
				semiLimited: action.semiLimited,
				limitedOne: [],
				limitedTwo: [],
				limitedThree: [],
				numForbidden: action.numForbidden,
				numLimited: action.numLimited,
				numSemiLimited: action.numSemiLimited,
				numLimitedOne: 0,
				numLimitedTwo: 0,
				numLimitedThree: 0,
			}
		case 'UPDATE_DUEL_LINKS_FORMAT_LIST':
			return {
				...state,
				forbidden: action.forbidden,
				limited: [],
				semiLimited: [],
				limitedOne: action.limitedOne,
				limitedTwo: action.limitedTwo,
				limitedThree: action.limitedThree,
				numForbidden: action.numForbidden,
				numLimited: 0,
				numSemiLimited: 0,
				numLimitedOne: action.numLimitedOne,
				numLimitedTwo: action.numLimitedTwo,
				numLimitedThree: action.numLimitedThree,
			}
		case 'UPDATE_REMOVED':
			return {
				...state,
				removedCards: action.removedCards,
				numRemoved: action.numRemoved,
			}
		case 'UPDATE_NEW_ADDITIONS_NORMAL_FORMAT':
			return {
				...state,
				newForbiddenCards: action.newForbiddenCards,
				newLimitedCards: action.newLimitedCards,
				newSemiLimitedCards: action.newSemiLimitedCards,
				newLimitedOne: [],
				newLimitedTwo: [],
				newLimitedThree: [],
				numNewForbidden: action.numNewForbidden,
				numNewLimited: action.numNewLimited,
				numNewSemiLimited: action.numNewSemiLimited,
				numNewLimitedOne: 0,
				numNewLimitedTwo: 0,
				numNewLimitedThree: 0,
			}
		case 'UPDATE_NEW_ADDITIONS_DUEL_LINKS_FORMAT':
			return {
				...state,
				newForbiddenCards: action.newForbiddenCards,
				newLimitedCards: [],
				newSemiLimitedCards: [],
				newLimitedOneCards: action.newLimitedOneCards,
				newLimitedTwoCards: action.newLimitedTwoCards,
				newLimitedThreeCards: action.newLimitedThreeCards,
				numNewForbidden: action.numNewForbidden,
				numNewLimited: 0,
				numNewSemiLimited: 0,
				numNewLimitedOne: action.numNewLimitedOne,
				numNewLimitedTwo: action.numNewLimitedTwo,
				numNewLimitedThree: action.numNewLimitedThree,
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
	const [format, setFormat] = useState<BanListFormat>('TCG')

	const [
		{
			forbidden,
			limited,
			semiLimited,
			limitedOne,
			limitedTwo,
			limitedThree,
			numForbidden,
			numLimited,
			numSemiLimited,
			removedCards,
			numRemoved,
			newForbiddenCards,
			newLimitedCards,
			newSemiLimitedCards,
			newLimitedOneCards,
			newLimitedTwoCards,
			newLimitedThreeCards,
			numNewForbidden,
			numNewLimited,
			numNewSemiLimited,
			numNewLimitedOne,
			numNewLimitedTwo,
			numNewLimitedThree,
			numLimitedOne,
			numLimitedTwo,
			numLimitedThree,
		},
		selectedBanListDispatch,
	] = useReducer(currentlySelectedBanListReducer, {
		forbidden: [],
		limited: [],
		semiLimited: [],
		limitedOne: [],
		limitedTwo: [],
		limitedThree: [],
		numForbidden: 0,
		numLimited: 0,
		numSemiLimited: 0,
		removedCards: [],
		numRemoved: 0,
		newForbiddenCards: [],
		newLimitedCards: [],
		newSemiLimitedCards: [],
		newLimitedOneCards: [],
		newLimitedTwoCards: [],
		newLimitedThreeCards: [],
		numNewForbidden: 0,
		numNewLimited: 0,
		numNewSemiLimited: 0,
		numNewLimitedOneCards: 0,
		numNewLimitedTwoCards: 0,
		numNewLimitedThreeCards: 0,
		numLimitedOne: 0,
		numLimitedTwo: 0,
		numLimitedThree: 0,
	})

	useEffect(() => {
		FetchHandler.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT['banListsUrl']}?format=${format}`, (json) => {
			dateDispatch({
				type: 'UPDATE_BAN_LIST',
				banContentLinks: json.banListDates.map((item: SKCBanListDate) => item._links),
				banListStartDates: json.banListDates.map((item: SKCBanListDate) => item.effectiveDate),
			})
		})
	}, [format])

	useEffect(() => {
		if (banContentLinks.length !== 0) setSelectedBanList(banListStartDates[0])
	}, [banContentLinks, banListStartDates])

	useEffect(() => {
		if (selectedBanList && selectedBanList.length !== 0) {
			setIsFetchingBanList(true)
			setFetchingBanListNewContent(true)
			setFetchingBanListRemovedContent(true)

			FetchHandler.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List New Content'].href, (json) => {
				console.log(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List New Content'].href)
				if (format === 'DL') {
					selectedBanListDispatch({
						type: 'UPDATE_NEW_ADDITIONS_DUEL_LINKS_FORMAT',
						newForbiddenCards: json.newForbidden,
						newLimitedOneCards: json.newLimitedOne,
						newLimitedTwoCards: json.newLimitedTwo,
						newLimitedThreeCards: json.newLimitedThree,
						numNewForbidden: json.numNewForbidden,
						numNewLimitedOne: json.numNewLimitedOne,
						numNewLimitedTwo: json.numNewLimitedTwo,
						numNewLimitedThree: json.numNewLimitedThree,
					})
				} else {
					selectedBanListDispatch({
						type: 'UPDATE_NEW_ADDITIONS_NORMAL_FORMAT',
						newForbiddenCards: json.newForbidden,
						newLimitedCards: json.newLimited,
						newSemiLimitedCards: json.newSemiLimited,
						numNewForbidden: json.numNewForbidden,
						numNewLimited: json.numNewLimited,
						numNewSemiLimited: json.numNewSemiLimited,
					})
				}
				setFetchingBanListNewContent(false)
			})

			FetchHandler.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List Removed Content'].href, (json) => {
				selectedBanListDispatch({
					type: 'UPDATE_REMOVED',
					removedCards: json.removedCards,
					numRemoved: determineListSize(json.numRemoved),
				})

				setFetchingBanListRemovedContent(false)
			})

			FetchHandler.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List Content'].href, (json) => {
				if (format === 'DL') {
					selectedBanListDispatch({
						type: 'UPDATE_DUEL_LINKS_FORMAT_LIST',
						forbidden: json.forbidden,
						limitedOne: json.limitedOne,
						limitedTwo: json.limitedTwo,
						limitedThree: json.limitedThree,
						numForbidden: determineListSize(json.numForbidden),
						numLimitedOne: determineListSize(json.numLimitedOne),
						numLimitedTwo: determineListSize(json.numLimitedTwo),
						numLimitedThree: determineListSize(json.numLimitedThree),
					})
				} else {
					selectedBanListDispatch({
						type: 'UPDATE_NORMAL_FORMAT_LIST',
						forbidden: json.forbidden,
						limited: json.limited,
						semiLimited: json.semiLimited,
						numForbidden: determineListSize(json.numForbidden),
						numLimited: determineListSize(json.numLimited),
						numSemiLimited: determineListSize(json.numSemiLimited),
					})
				}

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
									<BanListDates
										format={format}
										setFormat={setFormat}
										banListStartDates={banListStartDates}
										setSelectedBanList={(ind: number) => setSelectedBanList(banListStartDates[ind])}
									/>
								</div>
							}
						/>
					</Suspense>
				}
				twoThirdComponent={
					<Suspense fallback={<div />}>
						{format === 'DL' ? (
							<BanListContentDuelLinksFormat
								forbidden={forbidden}
								limitedOne={limitedOne}
								limitedTwo={limitedTwo}
								limitedThree={limitedThree}
								numForbidden={numForbidden}
								numLimitedOne={numLimitedOne}
								numLimitedTwo={numLimitedTwo}
								numLimitedThree={numLimitedThree}
								removedCards={removedCards}
								numRemoved={numRemoved}
								newForbiddenCards={newForbiddenCards}
								newLimitedOneCards={newLimitedOneCards}
								newLimitedTwoCards={newLimitedTwoCards}
								newLimitedThreeCards={newLimitedThreeCards}
								numNewForbidden={numNewForbidden}
								numNewLimitedOne={numNewLimitedOne}
								numNewLimitedTwo={numNewLimitedTwo}
								numNewLimitedThree={numNewLimitedThree}
								isFetchingBanListNewContent={isFetchingBanListNewContent}
								isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
								isFetchingBanList={isFetchingBanList}
							/>
						) : (
							<BanListContentNormalFormat
								forbidden={forbidden}
								limited={limited}
								semiLimited={semiLimited}
								numForbidden={numForbidden}
								numLimited={numLimited}
								numSemiLimited={numSemiLimited}
								removedCards={removedCards}
								numRemoved={numRemoved}
								newForbiddenCards={newForbiddenCards}
								newLimitedCards={newLimitedCards}
								newSemiLimitedCards={newSemiLimitedCards}
								numNewForbidden={numNewForbidden}
								numNewLimited={numNewLimited}
								numNewSemiLimited={numNewSemiLimited}
								isFetchingBanListNewContent={isFetchingBanListNewContent}
								isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
								isFetchingBanList={isFetchingBanList}
							/>
						)}
					</Suspense>
				}
			/>
		</div>
	)
}
