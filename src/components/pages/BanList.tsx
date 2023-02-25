import { lazy, useState, useEffect, Suspense, useReducer, startTransition, useCallback } from 'react'
import { Helmet } from 'react-helmet'

import { Skeleton } from '@mui/material'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import BreadCrumb from '../header-footer/Breadcrumb'

import '../../css/main-pages/ban-list.css'
import Section from '../util/generic/Section'
import dateReducer, { BanListDateReducerActionType } from '../../helper/reducers/BanListDateReducer'
import currentlySelectedBanListReducer, { CurrentlySelectedBanListReducerActionType } from '../../helper/reducers/CurrentBanListReducer'
import { useParams } from 'react-router-dom'
import { AcceptableBanListFormat, determineListSize, getValidFormat } from '../../helper/BanListUtil'

const BanListDates = lazy(() => import('../banlist/BanListDates'))
const BanListFormat = lazy(() => import('../banlist/BanListFormat'))

const BanListBreakdown = lazy(() => import('../banlist/breakdown/BanListBreakdown'))
const BanListContent = lazy(() => import('../banlist/content/BanListContent'))

export default function BanList() {
	const [selectedBanList, setSelectedBanList] = useState<string>('')
	const [isFetchingBanList, setIsFetchingBanList] = useState(true)
	const [isFetchingBanListNewContent, setFetchingBanListNewContent] = useState(true)
	const [isFetchingBanListRemovedContent, setFetchingBanListRemovedContent] = useState(true)

	const { specifiedFormat } = useParams<'specifiedFormat'>()
	const [format, setFormat] = useState<AcceptableBanListFormat>(getValidFormat(specifiedFormat))

	const [{ banListStartDates, banContentLinks, isFetchingBanListDates }, dateDispatch] = useReducer(dateReducer, {
		banListStartDates: [],
		banContentLinks: [],
		isFetchingBanListDates: true,
	})

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
		window.history.replaceState(null, '', `/ban_list/${format}`)

		dateDispatch({
			type: BanListDateReducerActionType.FETCHING_DATES,
		})

		setIsFetchingBanList(true)
		setFetchingBanListNewContent(true)
		setFetchingBanListRemovedContent(true)

		FetchHandler.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT['banListsUrl']}?format=${format}`, (json) => {
			dateDispatch({
				type: BanListDateReducerActionType.DATES_RECEIVED,
				payload: {
					banContentLinks: json.banListDates.map((item: SKCBanListDate) => item._links),
					banListStartDates: json.banListDates.map((item: SKCBanListDate) => item.effectiveDate),
				},
			})
		})
	}, [format])

	useEffect(() => {
		if (banContentLinks.length !== 0) setSelectedBanList(banListStartDates[0])
	}, [banListStartDates, banContentLinks])

	useEffect(() => {
		if (selectedBanList && selectedBanList.length !== 0) {
			setIsFetchingBanList(true)
			setFetchingBanListNewContent(true)
			setFetchingBanListRemovedContent(true)

			FetchHandler.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List New Content'].href, (json) => {
				startTransition(() => {
					if (format === 'DL') {
						selectedBanListDispatch({
							type: CurrentlySelectedBanListReducerActionType.UPDATE_NEW_ADDITIONS_DUEL_LINKS_FORMAT,
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
							type: CurrentlySelectedBanListReducerActionType.UPDATE_NEW_ADDITIONS_NORMAL_FORMAT,
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
			})

			FetchHandler.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List Removed Content'].href, (json) => {
				startTransition(() => {
					selectedBanListDispatch({
						type: CurrentlySelectedBanListReducerActionType.UPDATE_REMOVED,
						removedCards: json.removedCards,
						numRemoved: determineListSize(json.numRemoved),
					})

					setFetchingBanListRemovedContent(false)
				})
			})

			FetchHandler.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List Content'].href, (json) => {
				startTransition(() => {
					if (format === 'DL') {
						selectedBanListDispatch({
							type: CurrentlySelectedBanListReducerActionType.UPDATE_DUEL_LINKS_FORMAT_LIST,
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
							type: CurrentlySelectedBanListReducerActionType.UPDATE_NORMAL_FORMAT_LIST,
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
			})
		}
	}, [selectedBanList])

	const handleBanListChosen = useCallback((ind: number) => setSelectedBanList(banListStartDates[ind]), [selectedBanList])

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
					<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='500px' />}>
						<Section
							sticky
							sectionHeaderBackground={'ban-list'}
							sectionName='Overview'
							sectionContent={
								<div className='section-content'>
									<BanListFormat format={format} setFormat={setFormat} />
									<BanListDates
										isFetchingBanListDates={isFetchingBanListDates}
										banListStartDates={banListStartDates}
										selectedBanList={selectedBanList}
										setSelectedBanList={handleBanListChosen}
									/>

									<BanListBreakdown
										normalFormatSpreads={{ numForbidden, numLimited, numSemiLimited }}
										normalFormatDiffSpreads={{ numNewForbidden, numNewLimited, numNewSemiLimited, numRemoved }}
										dlFormatSpreads={{ numForbidden, numLimitedOne, numLimitedTwo, numLimitedThree }}
										dlFormatDiffSpreads={{ numNewForbidden, numNewLimitedOne, numNewLimitedTwo, numNewLimitedThree, numRemoved }}
										isFetchingBanList={isFetchingBanList}
										isFetchingBanListNewContent={isFetchingBanListNewContent}
										isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
										format={format}
									/>
								</div>
							}
						/>
					</Suspense>
				}
				twoThirdComponent={
					<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='500px' />}>
						<BanListContent
							normalFormatContent={{
								forbidden: forbidden,
								limited: limited,
								semiLimited: semiLimited,
								numForbidden: numForbidden,
								numLimited: numLimited,
								numSemiLimited: numSemiLimited,
								isFetchingBanList: isFetchingBanList,
							}}
							normalFormatDiffContent={{
								removedCards: removedCards,
								numRemoved: numRemoved,
								newForbiddenCards: newForbiddenCards,
								newLimitedCards: newLimitedCards,
								newSemiLimitedCards: newSemiLimitedCards,
								numNewForbidden: numNewForbidden,
								numNewLimited: numNewLimited,
								numNewSemiLimited: numNewSemiLimited,
								isFetchingBanListNewContent: isFetchingBanListNewContent,
								isFetchingBanListRemovedContent: isFetchingBanListRemovedContent,
							}}
							dlFormatContent={{
								forbidden: forbidden,
								limitedOne: limitedOne,
								limitedTwo: limitedTwo,
								limitedThree: limitedThree,
								numForbidden: numForbidden,
								numLimitedOne: numLimitedOne,
								numLimitedTwo: numLimitedTwo,
								numLimitedThree: numLimitedThree,
								isFetchingBanList: isFetchingBanList,
							}}
							dlFormatDiffContent={{
								removedCards: removedCards,
								numRemoved: numRemoved,
								newForbiddenCards: newForbiddenCards,
								newLimitedOneCards: newLimitedOneCards,
								newLimitedTwoCards: newLimitedTwoCards,
								newLimitedThreeCards: newLimitedThreeCards,
								numNewForbidden: numNewForbidden,
								numNewLimitedOne: numNewLimitedOne,
								numNewLimitedTwo: numNewLimitedTwo,
								numNewLimitedThree: numNewLimitedThree,
								isFetchingBanListNewContent: isFetchingBanListNewContent,
								isFetchingBanListRemovedContent: isFetchingBanListRemovedContent,
							}}
							format={format}
							isFetchingBanListNewContent={isFetchingBanListNewContent}
							isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
							isFetchingBanList={isFetchingBanList}
						/>
					</Suspense>
				}
			/>
		</div>
	)
}
