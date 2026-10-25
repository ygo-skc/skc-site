import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import AppRoutes from '../../helper/AppRoutes'
import { isTyping } from '../../helper/Keyboard'

// g, then one of these - the same pages as search's "Jump to" pills
const GO_TO_SHORTCUTS: Record<string, AppRoutes> = {
	h: AppRoutes.Home,
	b: AppRoutes.BanList,
	c: AppRoutes.CardBrowse,
	p: AppRoutes.ProductBrowse,
	a: AppRoutes.About,
}

// how long after g the second key still counts
export const GO_TO_WINDOW_MS = 1000

/*
 * GitHub style page shortcuts - press g, let go, then a letter (g b opens the ban list).
 * Both are single keys, so they're ignored while the user types in a field, has a popup open or is in a menu (which types ahead)
 */
export default function useGoToShortcuts() {
	const navigate = useNavigate()

	useEffect(() => {
		let pressedGAt = 0

		const handleKeyDown = (event: KeyboardEvent) => {
			const target = event.target
			if (event.metaKey || event.ctrlKey || event.altKey || event.repeat || isTyping(target)) return
			if (target instanceof Element && target.closest('[role="dialog"], [role="listbox"], [role="menu"]')) return

			const key = event.key.toLowerCase()
			const to = GO_TO_SHORTCUTS[key]

			if (to !== undefined && Date.now() - pressedGAt <= GO_TO_WINDOW_MS) {
				event.preventDefault()
				pressedGAt = 0
				navigate(to)
			} else {
				// any other key ends the sequence
				pressedGAt = key === 'g' ? Date.now() : 0
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [navigate])
}
