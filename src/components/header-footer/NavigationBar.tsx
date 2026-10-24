import '../../css/header-footer/navigation-bar.css'
import '../../css/header-footer/navigation-icon.css'

import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { IconButton, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import YouTube from '@mui/icons-material/YouTube'
import NotificationsIcon from '@mui/icons-material/Notifications'

import AppRoutes from '../../helper/AppRoutes'
import SearchTrigger from '../util/search/SearchTrigger'

import SubNav from './SubNav'
import AppBanner from './AppBanner'

const Messages = lazy(() => import('./Messages'))

const socialLinks = [
	{ href: 'https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ', label: 'SKC on YouTube', Icon: YouTube },
	{ href: 'https://github.com/YGO-SKC/skc-site', label: 'SKC on GitHub', Icon: GitHubIcon },
]

const NavigationBar = () => {
	return (
		<header className='site-nav'>
			<div className='site-nav__bar'>
				<Link className='site-nav__brand' to={AppRoutes.Home} aria-label='SKC home'>
					<Typography variant='h6' component='span'>
						SKC
					</Typography>
				</Link>

				<SubNav />

				<div className='site-nav__actions'>
					<SearchTrigger />

					{socialLinks.map(({ href, label, Icon }) => (
						<a key={href} className='styled-icon-button' href={href} target='_blank' rel='noopener noreferrer' aria-label={label}>
							<Icon />
						</a>
					))}

					<Suspense
						fallback={
							<IconButton className='styled-icon-button' aria-label='notifications' disabled>
								<NotificationsIcon />
							</IconButton>
						}
					>
						<Messages />
					</Suspense>
				</div>
			</div>

			<AppBanner />
		</header>
	)
}

export default NavigationBar
