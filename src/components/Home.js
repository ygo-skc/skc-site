
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { throttle } from 'underscore'

import { Typography, Grid, Link, TextField, Divider, Badge } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
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


const searchThrottle = throttle( (searchSubject, setSearchOptions, history) => {
	handleFetch(`${NAME_maps_ENDPOINT['search']}?limit=12&cName=${searchSubject}`, history, json => { setSearchOptions(json) })
}, 100)


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


	const [searchInput, setSearchInput] = useState('')
	const [searchOptions, setSearchOptions] = useState([])



	useEffect( () => {
		if (searchInput !== '' || searchInput !== null || searchInput !== undefined)	searchThrottle(searchInput, setSearchOptions, history)
		else setSearchOptions([])
	}
	, [searchInput])


	return (
		<MainContentContainer>
			<Breadcrumb crumbs={['Home']} />

			<CenteredText style={{background: '#53539e', width: '100%', height: '100px', justifyContent: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
				<Autocomplete
					id='search'
					style={{ minWidth: '70%', background: 'rgba(255, 255, 255, .3)' }}
					noOptionsText={ (searchInput === '')? 'Type For Suggestions' : 'No Results' }
					getOptionLabel={ option => option.cardName }
					options={searchOptions}
					autoComplete
					includeInputInList
					groupBy={ option => option.cardColor }
					freeSolo
					disableCloseOnSelect
					getOptionSelected={ (option, value) => window.location.assign(`/card/${value.cardID}`) }
					renderGroup={ option => {
						return(
							<div style={{margin: '1rem'}} >
								<Typography variant='subtitle2'>{option.group}</Typography>
								<Divider />
								{option.children}
							</div>
						)
					}}
					renderInput={ (params) => (
						<TextField
							{...params}
							style={{ minWidth: '100%', background: 'rgba(255, 255, 255, .3)' }}
							label={null}
							placeholder='Search...'
							variant='filled'
							fullWidth={false}
							onChange={ event => {setSearchInput(event.target.value)} }
							/>
					)}
					renderOption={ option => {
						return(
							<div>
								<Typography variant='body1'>{option.cardName}</Typography>
								<Typography variant='body2' style={{marginLeft: '.5rem', color: 'rgb(101,119,134)'}} >{option.monsterType}</Typography>
							</div>
						)
					}}
				/>
			</CenteredText>

			<br /><br /><br />


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
							Currently there are <strong>{ cardTotal } cards</strong>, <Link color='secondary' href='/ban_list'><strong>{ banListTotal } ban lists</strong></Link> from the past <strong>{ yearsOfBanListCoverage }</strong> years and information about <strong>{ productTotal }</strong> products.
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