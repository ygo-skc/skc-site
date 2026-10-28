import { useCallback, useEffect, useReducer, useState } from 'react'
import { useLocation } from 'react-router-dom'

// kept in memory by history entry (react-router's location.key), so it lasts until the tab reloads
const entries = new Map<string, unknown>()

// about as far back as browsers keep history, so older entries (which can't be gone back to) don't pile up
export const MAX_HISTORY_ENTRIES = 50

function rememberEntry(id: string, value: unknown) {
	// re-inserted so the map stays oldest first
	entries.delete(id)
	entries.set(id, value)
	if (entries.size > MAX_HISTORY_ENTRIES) entries.delete(entries.keys().next().value as string)
}

const always = () => true

/*
 * What a page leaves behind in its history entry, so going back to it shows the page as it was left - no reload, no skeletons,
 * and ScrollRestoration finds the page at its full height. A new visit to the same URL is a new entry, so it starts fresh
 */
export default function useHistoryEntry<T>(name: string) {
	const { key } = useLocation()
	const id = `${key}:${name}`

	// read once, when the page mounts - hasSaved tells a remembered undefined from nothing remembered
	const [[saved, hasSaved]] = useState(() => [entries.get(id) as T | undefined, entries.has(id)] as const)
	const remember = useCallback((value: T) => rememberEntry(id, value), [id])

	return [saved, remember, hasSaved] as const
}

/*
 * useReducer that comes back as it was left when the reader returns to this history entry. Only a settled state is kept
 * (isSettled - nothing still loading), since a restored page skips its mount's fetches: `isRestored` tells it to
 */
export function useHistoryEntryReducer<S, A>(name: string, reducer: (state: S, action: A) => S, initial: S, isSettled: (state: S) => boolean) {
	const [saved, remember, hasSaved] = useHistoryEntry<S>(name)
	const [state, dispatch] = useReducer(reducer, hasSaved ? (saved as S) : initial)

	useEffect(() => {
		if (isSettled(state)) remember(state)
	}, [state, isSettled, remember])

	return [state, dispatch, hasSaved] as const
}

// useState version of useHistoryEntryReducer
export function useHistoryEntryState<S>(name: string, initial: S, isSettled: (state: S) => boolean = always) {
	const [saved, remember, hasSaved] = useHistoryEntry<S>(name)
	const [state, setState] = useState<S>(hasSaved ? (saved as S) : initial)

	useEffect(() => {
		if (isSettled(state)) remember(state)
	}, [state, isSettled, remember])

	return [state, setState, hasSaved] as const
}

export const forgetHistoryEntries = () => entries.clear()
