import '../../css/nav/navigation-icon.css'

import { lazy, Suspense } from 'react'
import { AppBar, Toolbar, Typography, Link, IconButton } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import YouTube from '@mui/icons-material/YouTube'
import NotificationsIcon from '@mui/icons-material/Notifications'

import { NAME_maps_ROUTE } from '../Routes'
import SubNav from './SubNav'

const Messages = lazy(() => import('./Messages'))

const NavigationBar = () => {
	return (
		<AppBar position='static' className='app-bar-container'>
			<Toolbar className='app-bar'>
				<Link underline='none' color='inherit' href={NAME_maps_ROUTE.Home}>
					<Typography className='app-bar-button' color='inherit'>
						SKC (BETA)
					</Typography>
				</Link>

				<div className='empty-space' />

				<IconButton
					className='styled-icon-button'
					onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {
						window.open('https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ')
					}}
					color='inherit'
				>
					<YouTube />
				</IconButton>

				<IconButton
					className='styled-icon-button'
					onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {
						window.open('https://github.com/YGO-SKC/skc-site')
					}}
					color='inherit'
				>
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
