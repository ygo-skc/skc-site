import '../../css/nav/navigation-icon.css'

import { lazy, Suspense } from 'react'
import { AppBar, Toolbar, Typography, Link, Box, IconButton } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'
import YouTube from '@material-ui/icons/YouTube'
import NotificationsIcon from '@material-ui/icons/Notifications'

import { NAME_maps_ROUTE } from '../../Routes'
import Styled from 'styled-components'
import SubNav from './SubNav'
// import Messages from './Messages'

const Messages = lazy(() => import('./Messages'))

const EmptySpace = Styled(Box)`
	&& {
		flex-grow: 1;
	}
`

export default function NavigationBar()
{
	return (
		<AppBar position='static' className='app-bar-container' >
			<Toolbar
				className='app-bar' >
				<Link
					underline='none'
					color='inherit'
					href={NAME_maps_ROUTE.Home} >
					<Typography
						className='app-bar-button'
						color='inherit' >
						SKC (BETA)
					</Typography>
				</Link>

				<EmptySpace />

				<IconButton
					className='styled-icon-button'
					onClick={(_event: React.MouseEvent<HTMLButtonElement>) => { window.open('https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ') }}
					color="inherit">
						<YouTube />
				</IconButton>

				<IconButton
					className='styled-icon-button'
					onClick={(_event: React.MouseEvent<HTMLButtonElement>) => { window.open('https://github.com/YGO-SKC/skc-site') }}
					color="inherit">
						<GitHubIcon />
				</IconButton>

				<Suspense fallback={
					<IconButton
						className='styled-icon-button'
						color="inherit">
							<NotificationsIcon />
					</IconButton>
				} >
					<Messages />
				</Suspense>
			</Toolbar>
			<SubNav />
		</AppBar>
	)
}