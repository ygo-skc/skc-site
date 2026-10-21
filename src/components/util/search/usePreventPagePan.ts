import { RefObject, useEffect } from 'react'

/*
 * With the keyboard open, iOS lets a drag pan the visible area over the page to reach what's under the keyboard - overflow
 * hidden and a fixed body don't stop it, only cancelling the touchmove does. Drags are cancelled unless they would scroll the
 * given list, so a short list (or one already at its end) can't hand the drag on to the page
 */
export default function usePreventPagePan(enabled: boolean, scrollable: RefObject<HTMLElement | null>) {
	useEffect(() => {
		if (!enabled) return

		let startY = 0

		const handleTouchStart = (event: TouchEvent) => {
			startY = event.touches[0]?.clientY ?? 0
		}

		const handleTouchMove = (event: TouchEvent) => {
			const list = scrollable.current
			if (!list || !list.contains(event.target as Node)) {
				event.preventDefault()
				return
			}

			// finger moving down scrolls towards the top of the list
			const towardsTop = (event.touches[0]?.clientY ?? 0) > startY
			const atTop = list.scrollTop <= 0
			const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1
			if ((towardsTop && atTop) || (!towardsTop && atBottom)) event.preventDefault()
		}

		document.addEventListener('touchstart', handleTouchStart, { passive: true })
		document.addEventListener('touchmove', handleTouchMove, { passive: false })

		return () => {
			document.removeEventListener('touchstart', handleTouchStart)
			document.removeEventListener('touchmove', handleTouchMove)
		}
	}, [enabled, scrollable])
}
