
import React from 'react'
import styled from 'styled-components'

import { Typography, Link, Paper } from '@material-ui/core'

import { NAME_maps_ROUTE } from '../Routes'


const HomeContent = styled.div`
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin-top: 30px;
	align-content: center;
`

const MainContentCard = styled(Paper)`
	@media screen and (min-width: 0px)
	{
		padding: 15px;
		margin: 8px;
	}
	@media screen and (min-width: 400px)
	{
		padding: 30px;
		margin: 16px;
	}
	@media screen and (min-width: 600px)
	{
		padding: 30px;
		margin: 16px;
	}
	@media screen and (min-width: 800px)
	{
		padding: 30px;
		margin: 30px;
	}
	@media screen and (min-width: 1000px)
	{
		padding: 40px;
		margin: 60px;
	}
`

export default function Home()
{
	return (
		<HomeContent>
			<MainContentCard>
				<Typography variant='h4' >
					News
				</Typography>
				<Typography variant='h6' >
					&bull; <strong>January 20, 2020</strong> ban list has been added! The site has slight new look - updated fonts and colors. There are slight performance improvements to page loading. YGO API has been updated to include more info about new/removed cards.
				</Typography>
				<Typography variant='h6'>
					&bull; Site launch! - Dec 25, 2019
				</Typography>
				<Typography variant='h6'>
					&bull;&nbsp;
					<Link
						href={ NAME_maps_ROUTE.BanList }
						color='secondary' >
							Ban List
					</Link> has been updated - Oct 14, 2019
				</Typography>
			</MainContentCard>
		</HomeContent>
	)
}