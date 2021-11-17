import '../../css/nav/navigation-icon.css'

import { AppBar, Toolbar, Typography, Link, Box, IconButton } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'

import Messages from './Messages'
import { NAME_maps_ROUTE } from '../../Routes'
import Styled from 'styled-components'
import SubNav from './SubNav'

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
					onClick={(_event: React.MouseEvent<HTMLButtonElement>) => { window.open('https://github.com/YGO-SKC/skc-site') }}
					color="inherit">
						<GitHubIcon />
				</IconButton>

				<Messages />
			</Toolbar>
			<SubNav />
		</AppBar>
	)
}