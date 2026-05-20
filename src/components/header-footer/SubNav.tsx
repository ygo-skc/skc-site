import { Typography, Link } from '@mui/material'
import AppRoutes from '../../helper/AppRoutes'

const navLinks = [
	{ href: AppRoutes.Home, label: 'Home' },
	{ href: AppRoutes.BanList, label: 'Ban List' },
	{ href: AppRoutes.CardBrowse, label: 'Card Browse' },
	{ href: AppRoutes.ProductBrowse, label: 'Product Browse' },
	{ href: AppRoutes.About, label: 'About' },
]

export default function SubNav() {
	const pathname = window.location.pathname

	const navClass = (route: string) => {
		const active = route === AppRoutes.Home ? pathname === AppRoutes.Home : pathname.startsWith(route)
		return active ? 'nav-button nav-button-active' : 'nav-button'
	}

	return (
		<div className='scrollable-nav'>
			{navLinks.map(({ href, label }) => (
				<Link key={href} underline='none' color='inherit' href={href}>
					<Typography className={navClass(href)} variant='button' color='inherit'>
						{label}
					</Typography>
				</Link>
			))}
		</div>
	)
}
