import { lazy, useState, useEffect, Suspense, useReducer, useCallback, useMemo } from 'react'

import { Skeleton } from '@mui/material'
import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'

import '../../css/main-pages/ban-list.css'
import dateReducer, { BanListDateReducerActionType } from '../../reducers/BanListDateReducer'
import { useNavigate, useParams } from 'react-router-dom'
import { AcceptableBanListFormat, determineListSize, getValidFormat } from '../../helper/BanListUtil'
import AppRoutes from '../../helper/AppRoutes'
import { BanListReducerType, currentBanListReducer } from '../../reducers/CurrentBanListReducer'
import * as Dates from '../../helper/Dates'
import { toBanStatus } from '../../helper/BanStatus'
import BreadCrumb from '../header-footer/Breadcrumb'

const BanListHeader = lazy(() => import('../banlist/BanListHeader'))
const BanListChanges = lazy(() => import('../banlist/BanListChanges'))
const BanListCards = lazy(() => import('../banlist/BanListCards'))

// Duel Links lists aren't supported anymore - an old /ban_list/DL link opens the TCG list
function supportedFormat(specifiedFormat: string | undefined): AcceptableBanListFormat {
	const format = getValidFormat(specifiedFormat)
	return format === AcceptableBanListFormat.DL ? AcceptableBanListFormat.TCG : format
}

export default function BanList() {
	const navigate = useNavigate()

	const [selectedBanList, setSelectedBanList] = useState<string>('')

	const { specifiedFormat } = useParams<'specifiedFormat'>()
	const [format, setFormat] = useState<AcceptableBanListFormat>(supportedFormat(specifiedFormat))

	const [{ banListStartDates, isFetchingBanListDates }, dateDispatch] = useReducer(dateReducer, {
		banListStartDates: [],
		isFetchingBanListDates: true,
	})

	const [
		{
			forbidden,
			limited,
			semiLimited,
			numForbidden,
			numLimited,
			numSemiLimited,
			removedCards,
			newForbidden,
			newLimited,
			newSemiLimited,
			isFetchingBanListNewContent,
			isFetchingBanListContent,
			isFetchingBanListRemovedContent,
		},
		currentBanListDispatch,
	] = useReducer(currentBanListReducer, {
		forbidden: [],
		limited: [],
		semiLimited: [],
		numForbidden: 0,
		numLimited: 0,
		numSemiLimited: 0,
		removedCards: [],
		numRemoved: 0,
		newForbidden: [],
		newLimited: [],
		newSemiLimited: [],
		numNewForbidden: 0,
		numNewLimited: 0,
		numNewSemiLimited: 0,
		isFetchingBanListNewContent: true,
		isFetchingBanListContent: true,
		isFetchingBanListRemovedContent: true,
	})

	useEffect(() => {
		// keep the URL in sync with the chosen format via the router, so router state
		// and the address bar cannot drift apart the way history.replaceState allowed
		navigate(`${AppRoutes.BanList}/${format}`, { replace: true })

		dateDispatch({
			type: BanListDateReducerActionType.FETCHING_DATES,
		})

		currentBanListDispatch({
			type: BanListReducerType.FETCHING_INFO,
		})

		setSelectedBanList('')

		FetchHandler.handleFetch<YGOBanList.Dates>(`${DownstreamServices.SKC_API_ENDPOINTS.banListsUrl}?format=${format}`, (json) => {
			dateDispatch({
				type: BanListDateReducerActionType.DATES_RECEIVED,
				payload: {
					banListStartDates: json.banListDates.map((item: YGOBanList.Date) => item.effectiveDate),
				},
			})
		})
	}, [format, navigate])

	useEffect(() => {
		if (banListStartDates.length !== 0) setSelectedBanList(banListStartDates[0])
	}, [banListStartDates])

	useEffect(() => {
		if (selectedBanList && selectedBanList.length !== 0) {
			currentBanListDispatch({
				type: BanListReducerType.FETCHING_INFO,
			})

			FetchHandler.handleFetch<YGOBanList.NormalFormatNewlyAdded>(`${DownstreamServices.SKC_API_ENDPOINTS.banListUrl}/${selectedBanList}/new?format=${format}`, (json) => {
				currentBanListDispatch({
					type: BanListReducerType.UPDATE_NEW_CONTENT,
					newForbidden: json.newForbidden,
					newLimited: json.newLimited,
					newSemiLimited: json.newSemiLimited,
					numNewForbidden: json.numNewForbidden,
					numNewLimited: json.numNewLimited,
					numNewSemiLimited: json.numNewSemiLimited,
				})
			})

			FetchHandler.handleFetch<YGOBanList.NormalFormatRemovedCards>(`${DownstreamServices.SKC_API_ENDPOINTS.banListUrl}/${selectedBanList}/removed?format=${format}`, (json) => {
				currentBanListDispatch({
					type: BanListReducerType.UPDATE_REMOVED_CONTENT,
					removedCards: json.removedCards,
					numRemoved: determineListSize(json.numRemoved),
				})
			})

			FetchHandler.handleFetch<YGOBanList.NormalFormatContent>(`${DownstreamServices.SKC_API_ENDPOINTS.banListUrl}/${selectedBanList}/cards?format=${format}`, (json) => {
				currentBanListDispatch({
					type: BanListReducerType.UPDATE_LIST_CONTENT,
					forbidden: json.forbidden,
					limited: json.limited,
					semiLimited: json.semiLimited,
					numForbidden: determineListSize(json.numForbidden),
					numLimited: determineListSize(json.numLimited),
					numSemiLimited: determineListSize(json.numSemiLimited),
				})
			})
		}
	}, [selectedBanList])

	const handleBanListChosen = useCallback((ind: number) => setSelectedBanList(banListStartDates[ind]), [banListStartDates])

	// the list after the selected one in the (newest first) dates is the one it replaced
	const previousBanList = banListStartDates[banListStartDates.indexOf(selectedBanList) + 1]

	// the API leaves out empty lists, so default each to []
	const changeColumns = useMemo(
		() => [
			{ status: 'Forbidden' as const, cards: newForbidden ?? [] },
			{ status: 'Limited' as const, cards: newLimited ?? [] },
			{ status: 'Semi-Limited' as const, cards: newSemiLimited ?? [] },
			{ status: 'Unlimited' as const, cards: removedCards ?? [] },
		],
		[newForbidden, newLimited, newSemiLimited, removedCards]
	)

	const previousDate = previousBanList ? Dates.fromYYYYMMDDToDateStr(previousBanList) : undefined
	const numChanged = changeColumns.reduce((total, column) => total + column.cards.length, 0)

	const totals = useMemo(
		() => [
			{ status: 'Forbidden' as const, count: numForbidden },
			{ status: 'Limited' as const, count: numLimited },
			{ status: 'Semi-Limited' as const, count: numSemiLimited },
		],
		[numForbidden, numLimited, numSemiLimited]
	)

	const statusLists = useMemo(
		() => [
			{ status: 'Forbidden' as const, cards: forbidden ?? [] },
			{ status: 'Limited' as const, cards: limited ?? [] },
			{ status: 'Semi-Limited' as const, cards: semiLimited ?? [] },
		],
		[forbidden, limited, semiLimited]
	)

	const previousStatus = useMemo(
		() =>
			new Map(
				[...(newForbidden ?? []), ...(newLimited ?? []), ...(newSemiLimited ?? [])].map(({ card, previousBanStatus }) => [
					card.cardID,
					toBanStatus(previousBanStatus) ?? previousBanStatus,
				])
			),
		[newForbidden, newLimited, newSemiLimited]
	)

	return (
		<div className='generic-container'>
			<title>{`SKC - Ban List: ${selectedBanList}`}</title>
			<meta name='description' content={`Ban list content/info for list effective ${selectedBanList}`} />
			<meta name='keywords' content={`YuGiOh, ban list, The Supreme Kings Castle, ${selectedBanList}`} />

			<BreadCrumb crumbs={['Home', 'Ban List']} />

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='13.625rem' />}>
				<BanListHeader
					format={format}
					setFormat={setFormat}
					isFetchingBanListDates={isFetchingBanListDates}
					banListStartDates={banListStartDates}
					selectedBanList={selectedBanList}
					setSelectedBanList={handleBanListChosen}
					isFetchingTotals={isFetchingBanListContent || isFetchingBanListNewContent || isFetchingBanListRemovedContent}
					totals={totals}
					numChanged={numChanged}
					previousDate={previousDate}
				/>
			</Suspense>

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='26rem' />}>
				<BanListChanges isLoading={isFetchingBanListNewContent || isFetchingBanListRemovedContent} columns={changeColumns} previousDate={previousDate} />
			</Suspense>

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='30rem' />}>
				<BanListCards isLoading={isFetchingBanListContent || isFetchingBanListNewContent} lists={statusLists} previousStatus={previousStatus} />
			</Suspense>
		</div>
	)
}
