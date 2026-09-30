import { memo } from 'react'
import { Typography, Link } from '@mui/material'
import AppRoutes from '../../helper/AppRoutes'

const navLinks = [
	{ href: AppRoutes.Home, label: 'Home' },
	{ href: AppRoutes.BanList, label: 'Ban List' },
	{ href: AppRoutes.CardBrowse, label: 'Card Browse' },
	{ href: AppRoutes.ProductBrowse, label: 'Product Browse' },
	{ href: AppRoutes.About, label: 'About' },
]

const SubNav = memo(function SubNav() {
	return (
		<div className='scrollable-nav'>
			{navLinks.map(({ href, label }) => (
				<Link key={href} underline='none' color='inherit' href={href}>
					<Typography className='nav-button' color='inherit'>
						{label}
					</Typography>
				</Link>
			))}
		</div>
	)
})

SubNav.displayName = 'SubNav'
export default SubNav
