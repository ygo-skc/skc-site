import '../../css/header-footer/navigation-icon.css'

import { lazy, Suspense, useCallback } from 'react'
import { AppBar, Toolbar, Typography, Link, IconButton } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import YouTube from '@mui/icons-material/YouTube'
import NotificationsIcon from '@mui/icons-material/Notifications'

import SubNav from './SubNav'
import AppRoutes from '../../helper/AppRoutes'

const Messages = lazy(() => import('./Messages'))

const NavigationBar = () => {
	const handleYTIconClicked = useCallback(() => window.open('https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ'), [])
	const handleGHIconClicked = useCallback(() => window.open('https://github.com/YGO-SKC/skc-site'), [])

	return (
		<AppBar position='static' className='app-bar-container'>
			<Toolbar className='app-bar'>
				<Link underline='none' color='inherit' href={AppRoutes.Home}>
					<Typography className='app-bar-button' color='inherit'>
						SKC (BETA)
					</Typography>
				</Link>

				<div className='empty-space' />

				<IconButton className='styled-icon-button' onClick={handleYTIconClicked} color='inherit'>
					<YouTube />
				</IconButton>

				<IconButton className='styled-icon-button' onClick={handleGHIconClicked} color='inherit'>
					<GitHubIcon />
				</IconButton>

				<Suspense
					fallback={
						<IconButton className='styled-icon-button' color='inherit'>
							<NotificationsIcon />
						</IconButton>
					}
				>
					<Messages />
				</Suspense>
			</Toolbar>
			<SubNav />
		</AppBar>
	)
}

export default NavigationBar
