import { createContext, lazy, ReactNode, Suspense, useCallback, useContext, useMemo, useState } from 'react'

import useSearchShortcut from './useSearchShortcut'

const SearchPalette = lazy(() => import('./SearchPalette'))

const SiteSearchContext = createContext({ openSearch: () => {} })

/*
 * Owns the one search popup for the whole site, so the nav button, the home page field and the keyboard shortcut all open the same one.
 * The popup's code only loads the first time search is opened
 */
export function SiteSearchProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false)
	const [hasOpened, setHasOpened] = useState(false)

	const openSearch = useCallback(() => {
		setHasOpened(true)
		setIsOpen(true)
	}, [])
	const closeSearch = useCallback(() => setIsOpen(false), [])

	useSearchShortcut(openSearch)

	const value = useMemo(() => ({ openSearch }), [openSearch])

	return (
		<SiteSearchContext.Provider value={value}>
			{children}
			{hasOpened && (
				<Suspense fallback={null}>
					<SearchPalette open={isOpen} onClose={closeSearch} />
				</Suspense>
			)}
		</SiteSearchContext.Provider>
	)
}

export const useSiteSearch = () => useContext(SiteSearchContext)
