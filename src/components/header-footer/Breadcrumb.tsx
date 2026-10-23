import { FunctionComponent, memo } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton, Typography } from '@mui/material'

import '../../css/header-footer/breadcrumb.css'
import AppRoutes from '../../helper/AppRoutes'

type BreadcrumbProps = {
	crumbs: string[]
}

// parent crumbs are named after their route - 'Card Browse' -> AppRoutes.CardBrowse
function routeFor(crumb: string) {
	return AppRoutes[crumb.replace(/ /g, '') as keyof typeof AppRoutes]
}

/*
 * Path bar from Home to the current page. Parent crumbs link to their page, the last crumb is the page itself.
 * An empty last crumb means the page is still loading its name. On narrow screens css collapses the trail to a back button.
 */
const Breadcrumb: FunctionComponent<BreadcrumbProps> = memo(
	({ crumbs }) => {
		const parents = crumbs.slice(0, -1)
		const current = crumbs[crumbs.length - 1]

		return (
			<nav className='breadcrumb' aria-label='Breadcrumb'>
				<ol className='breadcrumb__trail'>
					{parents.map((crumb) => (
						<li key={crumb} className='breadcrumb__crumb'>
							<Link className='breadcrumb__item' to={routeFor(crumb)}>
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
	},
	(prevProps, newProps) => {
		if (prevProps.crumbs[prevProps.crumbs.length - 1] !== newProps.crumbs[newProps.crumbs.length - 1]) return false

		return true
	}
)

Breadcrumb.displayName = 'Breadcrumb'
export default Breadcrumb
