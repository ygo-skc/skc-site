import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import AppRoutes from '../../helper/AppRoutes'

const navLinks = [
	{ to: AppRoutes.Home, label: 'Home', end: true },
	{ to: AppRoutes.BanList, label: 'Ban List' },
	{ to: AppRoutes.CardBrowse, label: 'Card Browse' },
	{ to: AppRoutes.ProductBrowse, label: 'Product Browse' },
	{ to: AppRoutes.About, label: 'About' },
]

/*
 * NavLink sets aria-current='page' on the link for the current route, which the stylesheet keys off of for the active state
 */
const SubNav = memo(function SubNav() {
	return (
		<nav className='site-nav__links' aria-label='Main'>
			{navLinks.map(({ to, label, end }) => (
				<NavLink key={to} to={to} end={end} className='site-nav__link'>
					{label}
				</NavLink>
			))}
		</nav>
	)
})

SubNav.displayName = 'SubNav'
export default SubNav
