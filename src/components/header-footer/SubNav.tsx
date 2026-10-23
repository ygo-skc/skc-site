import { memo, useLayoutEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'
import AppRoutes from '../../helper/AppRoutes'

const navLinks = [
	{ to: AppRoutes.Home, label: 'Home', end: true },
	{ to: AppRoutes.BanList, label: 'Ban List' },
	{ to: AppRoutes.CardBrowse, label: 'Card Browse' },
	{ to: AppRoutes.ProductBrowse, label: 'Product Browse' },
	{ to: AppRoutes.About, label: 'About' },
]

/*
 * NavLink sets aria-current='page' on the link for the current route, which the stylesheet keys off of for the active state.
 * The lens (the nav's ::before) slides under that link - its position comes from --lens-x / --lens-w, and data-lens shows it.
 */
const SubNav = memo(function SubNav() {
	const navRef = useRef<HTMLElement>(null)
	const { pathname } = useLocation()

	// layout effect so the lens is placed before paint - on first load it appears in place rather than sliding in from the left
	useLayoutEffect(() => {
		const nav = navRef.current
		if (!nav) return

		const placeLens = () => {
			const active = nav.querySelector<HTMLElement>('[aria-current="page"]')
			if (!active) {
				nav.removeAttribute('data-lens')
				return
			}

			nav.style.setProperty('--lens-x', `${active.offsetLeft}px`)
			nav.style.setProperty('--lens-w', `${active.offsetWidth}px`)
			nav.setAttribute('data-lens', '')

			// on phones the links scroll sideways - bring a current link that's out of view to the middle of the track.
			// scrolls only the track, so the page itself doesn't jump the way scrollIntoView can
			const linkEnd = active.offsetLeft + active.offsetWidth
			if (active.offsetLeft < nav.scrollLeft || linkEnd > nav.scrollLeft + nav.clientWidth) {
				nav.scrollTo({ left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2 })
			}
		}

		placeLens()

		// links change width when Open Sans finishes loading or the viewport crosses a breakpoint
		const observer = new ResizeObserver(placeLens)
		nav.querySelectorAll('a').forEach((link) => observer.observe(link))
		return () => observer.disconnect()
	}, [pathname])

	return (
		<nav ref={navRef} className='site-nav__links' aria-label='Main'>
			{navLinks.map(({ to, label, end }) => (
				<NavLink key={to} to={to} end={end} className='site-nav__link'>
					<Typography variant='body1' component='span'>
						{label}
					</Typography>
				</NavLink>
			))}
		</nav>
	)
})

SubNav.displayName = 'SubNav'
export default SubNav
