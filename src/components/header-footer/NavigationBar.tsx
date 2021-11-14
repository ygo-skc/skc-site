import { AppBar, Toolbar, Typography, Link, Box } from '@material-ui/core'

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
				<Messages />
			</Toolbar>
			<SubNav />
		</AppBar>
	)
}