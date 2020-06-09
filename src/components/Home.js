
import React from 'react'
import styled from 'styled-components'

import { Typography, Grid, Link } from '@material-ui/core'
import { MainContentContainer, ChildPaper } from './MainContent'
import Breadcrumb from './Breadcrumb'


const HomeContent = styled.div`
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin-top: 30px;
	align-content: center;
`

const CenteredText = styled(Typography)`
	text-align: center;
`

export default function Home()
{
	return (
		<MainContentContainer>
			<Breadcrumb crumbs={['Home']} />

			<Grid container spacing={2} >
				<Grid item xs={12} sm={12} md={7} lg={8} xl={9} >
					<ChildPaper>
						<CenteredText variant='h4' >
							Welcome Duelist
						</CenteredText>

						<Typography variant='h6' >
							This is the Supreme Kings Castle. The Supreme King is the most formidable duelist you will ever meet. His castle has many secrets waiting to be explored.
						</Typography>

						<br /><br />

						<CenteredText variant='h4' >
							Content
						</CenteredText>

						<Typography variant='h6' >
							There are <strong>986</strong> cards currently in the database. There are also <Link color='secondary' href='/ban_list'><strong>11</strong></Link> ban lists from the past 3 years to browse.
						</Typography>
						<Typography variant='h6' >
							Yugioh is ever expanding and evolving. New products are continuously released and new ban lists established. As such this website will also  be continuously updated to accommodate.
							Enjoy the website ad free with a fast and beautiful UI. There is no tracking and the only money we make is though donations. Want to become a patreon or learn more? Check out the <Link color='secondary' href='/ban_list'><strong>About</strong></Link> section
						</Typography>
					</ChildPaper>
				</Grid>

				<Grid item xs={12} sm={12} md={5} lg={4} xl={3} >
					<ChildPaper>
						<CenteredText variant='h4' >
							Whats New?
						</CenteredText>

						<Typography variant='subtitle2' >
							<strong>March 26, 2020:</strong> New ban list - content added for it.
						</Typography>
						<Typography variant='subtitle2' >
							<strong>March 21, 2020:</strong> The Castle was cleaned up - navigating it is faster. The Database was updated to improve load times The Supreme King expects.
						</Typography>
						<Typography variant='subtitle2' >
							<strong>January 20, 2020:</strong> New ban list - content added for it. The Castle got a slight change in looks.
						</Typography>
						<Typography variant='subtitle2'>
							<strong>Dec 25, 2019:</strong> The Supreme King allows guests to The Castle.
						</Typography>
					</ChildPaper>
					<CenteredText variant='subtitle2'>Copyright 2020</CenteredText>
					<CenteredText variant='subtitle2'>Konami Digital Entertainment owns all rights to Yu-Gi-Oh!</CenteredText>
				</Grid>
			</Grid>
		</MainContentContainer>
	)
}