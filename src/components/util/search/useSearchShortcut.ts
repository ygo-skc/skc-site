import { useEffect } from 'react'

const isTyping = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/*
 * Opens search from anywhere on the site - cmd/ctrl + k (the common palette shortcut) or / (as on GitHub and YouTube).
 * Slash is a single key, so it only fires when the user isn't typing in a field
 */
export default function useSearchShortcut(onOpen: () => void) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isPaletteChord = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
			const isSlash = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping(event.target)

			if (isPaletteChord || isSlash) {
				event.preventDefault()
				onOpen()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [onOpen])
}
