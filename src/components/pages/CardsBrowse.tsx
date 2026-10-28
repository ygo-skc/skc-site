import '../../css/util/database-search-styles.css'
import '../../css/main-pages/card-browse.css'

import { useState, useEffect, useReducer, useRef, startTransition } from 'react'
import axios from 'axios'
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'

import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'

import CardBrowse from '../util/search/CardBrowse'
import { usePageView } from '../util/ResultsViewPreference'
import CardBrowseResults, { CardBrowseView } from '../util/search/CardBrowseResults'
import cardDisplayGridReducer, { CardDisplayGridState, CardDisplayGridStateReducerActionType } from '../../reducers/CardDisplayGridReducer'
import cardBrowseReducer from '../../reducers/CardBrowseCriteriaReducer'
import Breadcrumb from '../header-footer/Breadcrumb'
import useHistoryEntry from '../util/useHistoryEntry'

// with no criteria the answer is every card (~680KB gzipped), more than the default timeout allows on a slow phone connection
const BROWSE_TIMEOUT = 10000

function generateBrowseQueryURL(selectedCriteria: YGOData.CardBrowseValues[]) {
	const criteriaMap = new Map()
	criteriaMap.set('cardColors', [])
	criteriaMap.set('attributes', [])
	criteriaMap.set('monsterTypes', [])
	criteriaMap.set('monsterSubTypes', [])
	criteriaMap.set('levels', [])
	criteriaMap.set('ranks', [])
	criteriaMap.set('linkRatings', [])

	selectedCriteria.forEach((criteria: YGOData.CardBrowseValues) => {
		switch (criteria.name) {
			case 'cardColors':
			case 'attributes':
			case 'monsterTypes':
			case 'monsterSubTypes':
				criteriaMap.get(criteria.name).push(criteria.value)
				break
			case 'levels':
				criteriaMap.get(criteria.name).push(criteria.value.replace('Level ', ''))
				break
			case 'ranks':
				criteriaMap.get(criteria.name).push(criteria.value.replace('Rank ', ''))
				break
			case 'linkRatings':
				criteriaMap.get(criteria.name).push(criteria.value.replace('Link Rating ', ''))
				break
		}
	})

	return `${DownstreamServices.SKC_API_ENDPOINTS.browse}?cardColors=${criteriaMap.get('cardColors').join(',')}&attributes=${criteriaMap
		.get('attributes')
		.join(',')}&monsterTypes=${criteriaMap.get('monsterTypes').join(',')}&monsterSubTypes=${criteriaMap.get('monsterSubTypes').join(',')}&levels=${criteriaMap
		.get('levels')
		.join(',')}&ranks=${criteriaMap.get('ranks').join(',')}&linkRatings=${criteriaMap.get('linkRatings').join(',')}`
}

function browseStatus(hasCriteria: boolean, loadFailed: boolean, { isLoading, totalResults, totalDisplaying }: CardDisplayGridState) {
	if (isLoading) return 'Finding cards…'
	if (loadFailed) return 'Couldn’t load cards - check your connection and try again'
	if (totalResults === 0) return hasCriteria ? 'No cards match these filters' : 'No cards to show'
	return (
		<>
			{hasCriteria ? '' : 'All '}
			{totalResults.toLocaleString()} {totalResults === 1 ? 'card' : 'cards'}
			{/* dropped on phones so the count stays on one line, as "Finding cards…" does */}
			<span className='card-browse__sort'> · sorted by name</span>
			{totalDisplaying < totalResults && ` · showing ${totalDisplaying}`}
		</>
	)
}

// the loaded page, left in its history entry so coming back from a card shows the same criteria, results and view
type CardBrowseSnapshot = {
	selectedCriteria: YGOData.CardBrowseValues[]
	cardGridState: CardDisplayGridState
	skcCardBrowseCriteriaOutput: YGOData.CardBrowseCriteria
	view: CardBrowseView
}

export default function BrowseCards() {
	const [saved, rememberSnapshot] = useHistoryEntry<CardBrowseSnapshot>('card-browse')
	// a restored page skips the mount's fetches - it already has everything they would load
	const isRestored = useRef(saved !== undefined)

	const [{ selectedCriteria }, browseCriteriaDispatch] = useReducer(cardBrowseReducer, { selectedCriteria: saved?.selectedCriteria ?? [] })

	const [cardGridState, cardDisplayGridDispatch] = useReducer(
		cardDisplayGridReducer,
		saved?.cardGridState ?? {
			results: [],
			totalResults: 0,
			totalDisplaying: 0,
			numItemsToLoadWhenNeeded: 50,
			isLoading: false,
		}
	)

	const [skcCardBrowseCriteriaOutput, setSkcCardBrowseCriteriaOutput] = useState<YGOData.CardBrowseCriteria>(
		saved?.skcCardBrowseCriteriaOutput ?? ({} as YGOData.CardBrowseCriteria)
	)
	const [loadFailed, setLoadFailed] = useState(false)
	const [view, setView] = usePageView<CardBrowseView>({ list: 'list', grid: 'grid' }, saved?.view)

	useEffect(() => {
		if (isRestored.current) return
		FetchHandler.handleFetch<YGOData.CardBrowseCriteria>(DownstreamServices.SKC_API_ENDPOINTS.browseCriteria, (json) => {
			setSkcCardBrowseCriteriaOutput(json)
		})
	}, [])

	useEffect(() => {
		if (isRestored.current) return
		// with no criteria the endpoint returns every card, so there's something to browse before any filter is picked
		let isCurrent = true
		// criteria that change mid-download cancel it, so a phone isn't still pulling the whole card list after a filter is picked
		const request = axios.CancelToken.source()
		setLoadFailed(false)
		cardDisplayGridDispatch({ type: CardDisplayGridStateReducerActionType.LOADING_GRID })
		startTransition(() => {
			FetchHandler.handleFetch<YGOData.CardBrowseResults>(
				generateBrowseQueryURL(selectedCriteria ?? []),
				(json) => {
					// a slower answer for criteria that have since changed (the unfiltered list is the big one) mustn't replace newer results
					if (!isCurrent) return
					cardDisplayGridDispatch({
						type: CardDisplayGridStateReducerActionType.INIT_GRID,
						results: json.results,
						totalResults: json.numResults,
						totalDisplaying: 50,
					})
				},
				false,
				request,
				BROWSE_TIMEOUT
			)?.catch((err) => {
				// said in place rather than sending the reader to an error page, so the filters stay usable
				if (!isCurrent || axios.isCancel(err)) return
				setLoadFailed(true)
				cardDisplayGridDispatch({ type: CardDisplayGridStateReducerActionType.CLEAR_GRID })
			})
		})

		return () => {
			isCurrent = false
			request.cancel()
		}
	}, [selectedCriteria])

	// after the effects above, so only the mount's run is skipped
	useEffect(() => {
		isRestored.current = false
	}, [])

	// only a fully loaded page is left behind - a half loaded one would come back with skeletons and nothing fetching
	const isLoaded = !cardGridState.isLoading && !loadFailed && skcCardBrowseCriteriaOutput.cardColors !== undefined
	useEffect(() => {
		if (isLoaded) rememberSnapshot({ selectedCriteria, cardGridState, skcCardBrowseCriteriaOutput, view })
	}, [isLoaded, selectedCriteria, cardGridState, skcCardBrowseCriteriaOutput, view, rememberSnapshot])

	return (
		<div className='generic-container'>
			<title>{`SKC - Card Browser`}</title>
			<meta name='description' content={`Browse all cards in database to find the right card you want.`} />
			<meta name='keywords' content={`YuGiOh, card browse, The Supreme Kings Castle`} />

			<Breadcrumb crumbs={['Home', 'Card Browse']} />

			<section className='card-browse-header'>
				<Typography variant='subtitle2' component='p' className='card-browse-header__eyebrow'>
					Card Browse
				</Typography>
				<Typography variant='h1'>Find cards by what they are</Typography>
				<CardBrowse browseCriteriaDispatch={browseCriteriaDispatch} selectedCriteria={selectedCriteria} skcCardBrowseCriteriaOutput={skcCardBrowseCriteriaOutput} />
			</section>

			<div className='card-browse__toolbar'>
				<Typography variant='body1' className='card-browse__count' aria-live='polite'>
					{browseStatus(selectedCriteria.length > 0, loadFailed, cardGridState)}
				</Typography>
				<ToggleButtonGroup className='card-browse__view' exclusive aria-label='View' value={view} onChange={(_, value: CardBrowseView | null) => value && setView(value)}>
					<ToggleButton value='list'>
						<ViewListRoundedIcon />
						List
					</ToggleButton>
					<ToggleButton value='grid'>
						<GridViewRoundedIcon />
						Grid
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
			<CardBrowseResults cardGridState={cardGridState} dispatch={cardDisplayGridDispatch} view={view} />
		</div>
	)
}
