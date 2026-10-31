import { memo, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, matchPath, useLocation } from 'react-router-dom'
import { Menu, MenuItem, Typography } from '@mui/material'
import AppRoutes from '../../helper/AppRoutes'

const navLinks = [
	{ to: AppRoutes.Home, label: 'Home', end: true },
	{ to: AppRoutes.BanList, label: 'Ban List' },
	{ to: AppRoutes.CardBrowse, label: 'Card Browse' },
	{ to: AppRoutes.ProductBrowse, label: 'Product Browse' },
]

// pages under the Utilities menu, which sits between the browse links and About
const utilityLinks = [
	{ to: AppRoutes.TierList, label: 'Tier List' },
	{ to: AppRoutes.PullCost, label: 'Pull Cost' },
]

/*
 * NavLink sets aria-current='page' on the link for the current route, which the stylesheet keys off of for the active state.
 * Utilities is a button opening a menu, marked current the same way while one of its pages is open.
 * The lens (the nav's ::before) slides under that link - its position comes from --lens-x / --lens-w, and data-lens shows it.
 */
const SubNav = memo(function SubNav() {
	const navRef = useRef<HTMLElement>(null)
	const { pathname } = useLocation()
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
	const isUtilityPage = utilityLinks.some(({ to }) => matchPath(to, pathname))

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
		nav.querySelectorAll('a, button').forEach((link) => observer.observe(link))
		return () => observer.disconnect()
	}, [pathname])

	const navLink = ({ to, label, end }: { to: string; label: string; end?: boolean }) => (
		<NavLink key={to} to={to} end={end} className='site-nav__link'>
			<Typography variant='body1' component='span'>
				{label}
			</Typography>
		</NavLink>
	)

	return (
		<nav ref={navRef} className='site-nav__links' aria-label='Main'>
			{navLinks.map(navLink)}
			<button
				type='button'
				className='site-nav__link site-nav__menu-button'
				aria-haspopup='menu'
				aria-expanded={menuAnchor !== null}
				aria-controls={menuAnchor ? 'utilities-menu' : undefined}
				aria-current={isUtilityPage ? 'page' : undefined}
				onClick={(event) => setMenuAnchor(event.currentTarget)}
			>
				<Typography variant='body1' component='span'>
					Utilities
				</Typography>
			</button>
			<Menu
				id='utilities-menu'
				className='site-nav__menu'
				anchorEl={menuAnchor}
				open={menuAnchor !== null}
				onClose={() => setMenuAnchor(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				{utilityLinks.map(({ to, label }) => {
					const isCurrent = matchPath(to, pathname) !== null
					return (
						<MenuItem key={to} component={Link} to={to} selected={isCurrent} aria-current={isCurrent ? 'page' : undefined} onClick={() => setMenuAnchor(null)}>
							<Typography variant='body1'>{label}</Typography>
						</MenuItem>
					)
				})}
			</Menu>
			{navLink({ to: AppRoutes.About, label: 'About' })}
		</nav>
	)
})

SubNav.displayName = 'SubNav'
export default SubNav
