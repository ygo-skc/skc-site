import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

const SINGLE_KEY_SHORTCUTS_KEY = 'singleKeyShortcuts'

// storage can throw (private windows, blocked site data) - fall back to on, which is how the site worked before the setting
function readSingleKeyShortcuts(): boolean {
	try {
		return localStorage.getItem(SINGLE_KEY_SHORTCUTS_KEY) !== 'off'
	} catch {
		return true
	}
}

const ShortcutsContext = createContext<{ singleKeyShortcuts: boolean; setSingleKeyShortcuts: (on: boolean) => void }>({
	singleKeyShortcuts: true,
	setSingleKeyShortcuts: () => {},
})

/*
 * Whether single key shortcuts (/ for search, g then a letter for a page) are on - set from the nav's settings and saved in this browser.
 * WCAG 2.1.4 asks for a way to turn them off, since speech input can type them by accident. Chords with cmd / ctrl aren't covered and always work
 */
export function ShortcutsProvider({ children }: { children: ReactNode }) {
	const [singleKeyShortcuts, setOn] = useState(readSingleKeyShortcuts)

	const setSingleKeyShortcuts = useCallback((on: boolean) => {
		setOn(on)
		try {
			localStorage.setItem(SINGLE_KEY_SHORTCUTS_KEY, on ? 'on' : 'off')
		} catch {
			// still applies for this visit
		}
	}, [])

	const value = useMemo(() => ({ singleKeyShortcuts, setSingleKeyShortcuts }), [singleKeyShortcuts, setSingleKeyShortcuts])

	return <ShortcutsContext.Provider value={value}>{children}</ShortcutsContext.Provider>
}

export const useShortcutsPreference = () => useContext(ShortcutsContext)
