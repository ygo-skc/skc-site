
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Typography, Grid, Link } from '@material-ui/core'
import { MainContentContainer, ChildPaper } from './MainContent'
import Breadcrumb from './Breadcrumb'
import { handleFetch } from '../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../helper/YgoApiEndpoints'


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

export default function Home( {history} )
{
	useEffect( () => {
		handleFetch(NAME_maps_ENDPOINT['databaseStats'], history, (json) => {
			console.log(json)
			setCardTotal(json.cardTotal)
			setBanListTotal(json.banListTotal)
			setYearsOfBanListCoverage(json.yearsOfBanListCoverage)
			setProductTotal(json.productTotal)
		})
	}, [])


	const [cardTotal, setCardTotal] = useState(0)
	const [banListTotal, setBanListTotal] = useState(0)
	const [yearsOfBanListCoverage, setYearsOfBanListCoverage] = useState(0)
	const [productTotal, setProductTotal] = useState(0)


	return (
		<MainContentContainer>
			<Breadcrumb crumbs={['Home']} />

			<Grid container spacing={2} >
				<Grid item xs={12} sm={12} md={7} lg={8} xl={9} >
					<ChildPaper>
						<CenteredText variant='h4' >
							Welcome Duelist
						</CenteredText>

						<Typography variant='body1' >
							This is the Supreme Kings Castle. The Supreme King is the most formidable duelist you will ever meet. His castle has many secrets waiting to be explored.
						</Typography>

						<br /><br /><br />

						<CenteredText variant='h4' >
							Content
						</CenteredText>

						<Typography variant='body1' >
							Currently there are <strong>{ cardTotal }</strong> cards, <Link color='secondary' href='/ban_list'><strong>{ banListTotal }</strong></Link> ban lists from the past <strong>{ yearsOfBanListCoverage }</strong> and information about <strong>{ productTotal }</strong> card products.
						</Typography>
						<br />
						<Typography variant='body1' >
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

						<Typography variant='body1' >
							<Typography variant='inherit' style={{ color: '#2b3239' }} ><strong>March 26, 2020:</strong></Typography> New ban list - content added for it.
						</Typography>
						<Typography variant='body1' >
							<Typography variant='inherit' style={{ color: '#2b3239' }} ><strong>March 21, 2020:</strong></Typography> The Castle was cleaned up - navigating it is faster. The Database was updated to improve load times The Supreme King expects.
						</Typography>
						<Typography variant='body1' >
							<Typography variant='inherit' style={{ color: '#2b3239' }} ><strong>January 20, 2020:</strong></Typography> New ban list - content added for it. The Castle got a slight change in looks.
						</Typography>
						<Typography variant='body1'>
							<Typography variant='inherit' style={{ color: '#2b3239' }} ><strong>Dec 25, 2019:</strong></Typography> The Supreme King allows guests to The Castle.
						</Typography>
					</ChildPaper>
					<CenteredText variant='body2' style={{color: 'rgb(101, 119, 134)'}} >Copyright 2020</CenteredText>
					<CenteredText variant='body2' style={{color: 'rgb(101, 119, 134)'}} >Konami Digital Entertainment owns all rights to Yu-Gi-Oh!</CenteredText>
				</Grid>
			</Grid>
		</MainContentContainer>
	)
}