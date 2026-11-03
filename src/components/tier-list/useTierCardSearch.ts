import { useEffect } from 'react'
import axios from 'axios'

import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'
import { useHistoryEntryState } from '../util/useHistoryEntry'

const SEARCH_DELAY_MS = 150

type SearchState = { query: string; term: string; cards: YGOCard.Deets[]; failed: boolean }

// kept for back navigation only once the results match what's typed
const isSettled = (state: SearchState) => state.query.trim() === state.term

/*
 * Cards by name or passcode, as the search popup finds them. The results answer `term` - while that differs from what's typed
 * the next answer is on its way. Going back restores both, so nothing is fetched again
 */
export default function useTierCardSearch() {
	const [search, setSearch] = useHistoryEntryState<SearchState>('tierListSearch', { query: '', term: '', cards: [], failed: false }, isSettled)
	const term = search.query.trim()

	useEffect(() => {
		if (term === search.term) return
		if (term === '') {
			setSearch((s) => ({ ...s, term: '', cards: [], failed: false }))
			return
		}

		// passcodes are all digits, so those also search by id
		const searchQuery = /^\d+$/.test(term) ? `cName=${term}&cId=${term}` : `cName=${encodeURIComponent(term)}`
		const fetchToken = axios.CancelToken.source()
		let isStale = false

		const timer = setTimeout(() => {
			FetchHandler.handleFetch<YGOCard.Deets[]>(
				`${DownstreamServices.SKC_API_ENDPOINTS.search}?limit=10&${searchQuery}`,
				(cards) => {
					if (!isStale) setSearch((s) => ({ ...s, term, cards, failed: false }))
				},
				false,
				fetchToken
			)?.catch((err) => {
				if (!isStale && !axios.isCancel(err)) setSearch((s) => ({ ...s, term, cards: [], failed: true }))
			})
		}, SEARCH_DELAY_MS)

		return () => {
			isStale = true
			clearTimeout(timer)
			fetchToken.cancel()
		}
	}, [term, search.term, setSearch])

	return {
		query: search.query,
		setQuery: (query: string) => setSearch((s) => ({ ...s, query })),
		cards: search.cards,
		isLoading: term !== search.term,
		failed: search.failed,
	}
}
