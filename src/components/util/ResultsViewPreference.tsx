import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

export type ResultsView = 'list' | 'grid'

const RESULTS_VIEW_KEY = 'resultsView'

// storage can throw (private windows, blocked site data) - fall back to list, which is what pages showed before the setting
function readResultsView(): ResultsView {
	try {
		return localStorage.getItem(RESULTS_VIEW_KEY) === 'grid' ? 'grid' : 'list'
	} catch {
		return 'list'
	}
}

const ResultsViewContext = createContext<{ resultsView: ResultsView; setResultsView: (view: ResultsView) => void }>({
	resultsView: 'list',
	setResultsView: () => {},
})

/*
 * The view (list or grid) result pages open in - set from the nav's settings and saved in this browser.
 * It's only the default: a page's own List | Grid toggle changes that page and never writes back here
 */
export function ResultsViewProvider({ children }: { children: ReactNode }) {
	const [resultsView, setView] = useState(readResultsView)

	const setResultsView = useCallback((view: ResultsView) => {
		setView(view)
		try {
			localStorage.setItem(RESULTS_VIEW_KEY, view)
		} catch {
			// still applies for this visit
		}
	}, [])

	const value = useMemo(() => ({ resultsView, setResultsView }), [resultsView, setResultsView])

	return <ResultsViewContext.Provider value={value}>{children}</ResultsViewContext.Provider>
}

export const useResultsViewPreference = () => useContext(ResultsViewContext)

/*
 * A page's view, starting from the saved preference (mapped to the page's own names, e.g. ban list's 'table' | 'cards').
 * Changing the preference switches the open page to it right away
 */
export function usePageView<V extends string>(names: Record<ResultsView, V>) {
	const { resultsView } = useResultsViewPreference()
	const [view, setView] = useState<V>(names[resultsView])

	// adjusted during render rather than in an effect, so the page never paints the old view first
	const [appliedPreference, setAppliedPreference] = useState(resultsView)
	if (appliedPreference !== resultsView) {
		setAppliedPreference(resultsView)
		setView(names[resultsView])
	}

	return [view, setView] as const
}
