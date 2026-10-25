import { FunctionComponent, memo } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton, Typography } from '@mui/material'

import '../../css/header-footer/breadcrumb.css'
import AppRoutes from '../../helper/AppRoutes'

// pages a crumb can link back to - a parent crumb has to be one of these, so a typo fails to compile instead of rendering a dead link
const parentRoutes = {
	Home: AppRoutes.Home,
	'Card Browse': AppRoutes.CardBrowse,
	'Product Browse': AppRoutes.ProductBrowse,
}

export type Crumbs = [...(keyof typeof parentRoutes)[], string]

type BreadcrumbProps = {
	crumbs: Crumbs
}

/*
 * Path bar from Home to the current page. Parent crumbs link to their page, the last crumb is the page itself.
 * An empty last crumb means the page is still loading its name. On narrow screens css collapses the trail to a back button.
 */
const Breadcrumb: FunctionComponent<BreadcrumbProps> = memo(({ crumbs }) => {
	const parents = crumbs.slice(0, -1) as (keyof typeof parentRoutes)[]
	const current = crumbs[crumbs.length - 1]

	return (
		<nav className='breadcrumb' aria-label='Breadcrumb'>
			<ol className='breadcrumb__trail'>
				{parents.map((crumb) => (
					<li key={crumb} className='breadcrumb__crumb'>
						<Link className='breadcrumb__item' to={parentRoutes[crumb]}>
							<Typography variant='body2' component='span'>
								{crumb}
							</Typography>
						</Link>
					</li>
				))}
				<li className='breadcrumb__crumb'>
					{current === '' ? (
						<Skeleton className='breadcrumb__loading' variant='rectangular' width={160} height={30} />
					) : (
						<Typography variant='body2' component='span' className='breadcrumb__item' aria-current='page'>
							{current}
						</Typography>
					)}
				</li>
			</ol>
		</nav>
	)
})

Breadcrumb.displayName = 'Breadcrumb'
export default Breadcrumb
