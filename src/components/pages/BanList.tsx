import { lazy, useState, useEffect, Suspense, useReducer, useCallback } from 'react'
import { Helmet } from 'react-helmet'

import { Skeleton } from '@mui/material'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import '../../css/main-pages/ban-list.css'
import dateReducer, { BanListDateReducerActionType } from '../../reducers/BanListDateReducer'
import { useParams } from 'react-router-dom'
import { AcceptableBanListFormat, determineListSize, getValidFormat } from '../../helper/BanListUtil'
import { BanListReducerType, currentBanListReducer } from '../../reducers/CurrentBanListReducer'

const BreadCrumb = lazy(() => import('../header-footer/Breadcrumb'))

const BanListDates = lazy(() => import('../banlist/BanListDates'))
const BanListFormat = lazy(() => import('../banlist/BanListFormat'))
const BanListBreakdown = lazy(() => import('../banlist/breakdown/BanListBreakdown'))
const BanListDiffContent = lazy(() => import('../banlist/content/BanListDiffContent'))
const BanListContent = lazy(() => import('../banlist/content/BanListContent'))

const Section = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Section }
	})
)

export default function BanList() {
	const [selectedBanList, setSelectedBanList] = useState<string>('')

	const { specifiedFormat } = useParams<'specifiedFormat'>()
	const [format, setFormat] = useState<AcceptableBanListFormat>(getValidFormat(specifiedFormat))

	const [{ banListStartDates, isFetchingBanListDates }, dateDispatch] = useReducer(dateReducer, {
		banListStartDates: [],
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
			newForbidden,
			newLimited,
			newSemiLimited,
			newLimitedOne,
			newLimitedTwo,
			newLimitedThree,
			numNewForbidden,
			numNewLimited,
			numNewSemiLimited,
			numNewLimitedOne,
			numNewLimitedTwo,
			numNewLimitedThree,
			numLimitedOne,
			numLimitedTwo,
			numLimitedThree,
			isFetchingBanListNewContent,
			isFetchingBanListContent,
			isFetchingBanListRemovedContent,
		},
		currentBanListDispatch,
	] = useReducer(currentBanListReducer, {
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
		newForbidden: [],
		newLimited: [],
		newSemiLimited: [],
		newLimitedOne: [],
		newLimitedTwo: [],
		newLimitedThree: [],
		numNewForbidden: 0,
		numNewLimited: 0,
		numNewSemiLimited: 0,
		numNewLimitedOne: 0,
		numNewLimitedTwo: 0,
		numNewLimitedThree: 0,
		numLimitedOne: 0,
		numLimitedTwo: 0,
		numLimitedThree: 0,
		isFetchingBanListNewContent: true,
		isFetchingBanListContent: true,
		isFetchingBanListRemovedContent: true,
	})

	useEffect(() => {
		window.history.replaceState(null, '', `/ban_list/${format}`)

		dateDispatch({
			type: BanListDateReducerActionType.FETCHING_DATES,
		})

		currentBanListDispatch({
			type: BanListReducerType.FETCHING_INFO,
		})

		setSelectedBanList('')

		FetchHandler.handleFetch<SKCBanListDates>(`${DownstreamServices.NAME_maps_ENDPOINT.banListsUrl}?format=${format}`, (json) => {
			dateDispatch({
				type: BanListDateReducerActionType.DATES_RECEIVED,
				payload: {
					banListStartDates: json.banListDates.map((item: SKCBanListDate) => item.effectiveDate),
				},
			})
		})
	}, [format])

	useEffect(() => {
		if (banListStartDates.length !== 0) setSelectedBanList(banListStartDates[0])
	}, [banListStartDates])

	useEffect(() => {
		if (selectedBanList && selectedBanList.length !== 0) {
			currentBanListDispatch({
				type: BanListReducerType.FETCHING_INFO,
			})

			FetchHandler.handleFetch<SKCBanListNewCardsNormalFormat & SKCBanListNewCardsDuelLinksFormat>(
				`${DownstreamServices.NAME_maps_ENDPOINT.banListUrl}/${selectedBanList}/new?format=${format}`,
				(json) => {
					if (format === 'DL') {
						currentBanListDispatch({
							type: BanListReducerType.UPDATE_NEW_CONTENT_DL_FORMAT,
							newForbidden: json.newForbidden,
							newLimitedOne: json.newLimitedOne,
							newLimitedTwo: json.newLimitedTwo,
							newLimitedThree: json.newLimitedThree,
							numNewForbidden: json.numNewForbidden,
							numNewLimitedOne: json.numNewLimitedOne,
							numNewLimitedTwo: json.numNewLimitedTwo,
							numNewLimitedThree: json.numNewLimitedThree,
						})
					} else {
						currentBanListDispatch({
							type: BanListReducerType.UPDATE_NEW_CONTENT,
							newForbidden: json.newForbidden,
							newLimited: json.newLimited,
							newSemiLimited: json.newSemiLimited,
							numNewForbidden: json.numNewForbidden,
							numNewLimited: json.numNewLimited,
							numNewSemiLimited: json.numNewSemiLimited,
						})
					}
				}
			)

			FetchHandler.handleFetch<SKCBanListRemovedCards>(`${DownstreamServices.NAME_maps_ENDPOINT.banListUrl}/${selectedBanList}/removed?format=${format}`, (json) => {
				currentBanListDispatch({
					type: BanListReducerType.UPDATE_REMOVED_CONTENT,
					removedCards: json.removedCards,
					numRemoved: determineListSize(json.numRemoved),
				})
			})

			FetchHandler.handleFetch<SKCBanListContentNormalFormat & SKCBanListContentDuelLinksFormat>(
				`${DownstreamServices.NAME_maps_ENDPOINT.banListUrl}/${selectedBanList}/cards?format=${format}`,
				(json) => {
					if (format === 'DL') {
						currentBanListDispatch({
							type: BanListReducerType.UPDATE_LIST_CONTENT_DL_FORMAT,
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
						currentBanListDispatch({
							type: BanListReducerType.UPDATE_LIST_CONTENT,
							forbidden: json.forbidden,
							limited: json.limited,
							semiLimited: json.semiLimited,
							numForbidden: determineListSize(json.numForbidden),
							numLimited: determineListSize(json.numLimited),
							numSemiLimited: determineListSize(json.numSemiLimited),
						})
					}
				}
			)
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

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<BreadCrumb crumbs={['Home', 'Ban List']} />
			</Suspense>

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='500px' />}>
						<Section sectionHeaderBackground={'ban-list'} sectionName='Overview'>
							<div className='section-content'>
								<BanListFormat format={format} setFormat={setFormat} />
								<BanListDates
									isFetchingBanListDates={isFetchingBanListDates}
									banListStartDates={banListStartDates}
									selectedBanList={selectedBanList}
									setSelectedBanList={handleBanListChosen}
								/>

								<BanListBreakdown
									numForbidden={numForbidden}
									numLimited={numLimited}
									numSemiLimited={numSemiLimited}
									numLimitedOne={numLimitedOne}
									numLimitedTwo={numLimitedTwo}
									numLimitedThree={numLimitedThree}
									numNewForbidden={numNewForbidden}
									numNewLimited={numNewLimited}
									numNewSemiLimited={numNewSemiLimited}
									numRemoved={numRemoved}
									numNewLimitedOne={numNewLimitedOne}
									numNewLimitedTwo={numNewLimitedTwo}
									numNewLimitedThree={numNewLimitedThree}
									isFetchingBanList={isFetchingBanListContent}
									isFetchingBanListNewContent={isFetchingBanListNewContent}
									isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
									format={format}
								/>
							</div>
						</Section>
					</Suspense>
				}
				twoThirdComponent={
					<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='500px' />}>
						<BanListDiffContent
							format={format}
							normalFormatDiffContent={{
								removedCards: removedCards,
								numRemoved: numRemoved,
								newForbidden: newForbidden,
								newLimited: newLimited,
								newSemiLimited: newSemiLimited,
								numNewForbidden: numNewForbidden,
								numNewLimited: numNewLimited,
								numNewSemiLimited: numNewSemiLimited,
							}}
							dlFormatDiffContent={{
								removedCards: removedCards,
								numRemoved: numRemoved,
								newForbidden: newForbidden,
								newLimitedOne: newLimitedOne,
								newLimitedTwo: newLimitedTwo,
								newLimitedThree: newLimitedThree,
								numNewForbidden: numNewForbidden,
								numNewLimitedOne: numNewLimitedOne,
								numNewLimitedTwo: numNewLimitedTwo,
								numNewLimitedThree: numNewLimitedThree,
							}}
							isFetchingBanListNewContent={isFetchingBanListNewContent}
							isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
						/>
						<BanListContent
							format={format}
							normalFormatContent={{
								forbidden: forbidden,
								limited: limited,
								semiLimited: semiLimited,
								numForbidden: numForbidden,
								numLimited: numLimited,
								numSemiLimited: numSemiLimited,
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
							}}
							isFetchingBanList={isFetchingBanListContent}
							isFetchingBanListNewContent={isFetchingBanListNewContent}
							isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
						/>
					</Suspense>
				}
			/>
		</div>
	)
}
