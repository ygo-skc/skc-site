import { useEffect, useState } from 'react'

// top - how far the visible area has been pushed down the page. covered - how much of the bottom is hidden behind the keyboard and the toolbar above it
type VisibleArea = { top: number; covered: number }

/*
 * The part of the page the user can actually see - on phones the on screen keyboard (and, on newer iOS, Safari's toolbar floating
 * above it) covers the bottom of the layout viewport. Undefined when off or when the browser has no visualViewport
 */
export default function useVisualViewport(enabled: boolean): VisibleArea | undefined {
	const [area, setArea] = useState<VisibleArea>()

	useEffect(() => {
		const viewport = window.visualViewport
		if (!enabled || !viewport) {
			setArea(undefined)
			return
		}

		const update = () =>
			setArea({
				top: viewport.offsetTop,
				covered: Math.max(0, document.documentElement.clientHeight - viewport.offsetTop - viewport.height),
			})
		update()
		viewport.addEventListener('resize', update)
		viewport.addEventListener('scroll', update)

		return () => {
			viewport.removeEventListener('resize', update)
			viewport.removeEventListener('scroll', update)
		}
	}, [enabled])

	return area
}
