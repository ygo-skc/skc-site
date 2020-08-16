
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { throttle } from 'underscore'

import { Typography, Grid, Link, TextField, Divider, InputBase, Paper, IconButton, Popper } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
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

const DatabaseSearch = styled(Autocomplete)`
	&&&&&&&&&&&&&&&
	{
		.MuiAutocomplete-popper
		{
			background-color: black;
		}
	}
`


const SearchSuggestionTypography = styled(Typography)`
	&&
	{
		white-space: pre-wrap;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
`


const searchThrottle = throttle( (searchSubject, setSearchOptions, history) => {
	handleFetch(`${NAME_maps_ENDPOINT['search']}?limit=18&cName=${searchSubject}`, history, json => { setSearchOptions(json) })
}, 65)


export default function Home( {history} )
{
	useEffect( () => {
		handleFetch(NAME_maps_ENDPOINT['databaseStats'], history, (json) => {
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
	const [isLoadingSearchOptions, setIsLoadingSearchOptions] = useState(false)



	useEffect( () => {
		if (searchInput !== '')
		{
			searchThrottle(searchInput, setSearchOptions, history)
		}
	}
	, [searchInput])


	return (
		<MainContentContainer>
			<Breadcrumb crumbs={['Home']} />

			<br />

			<Paper style={{ display: 'flex', width: '90%', maxWidth: '500px',  margin: '0 auto' }} >
				<DatabaseSearch
					id='search'
					style={{ flex: '1' }}
					noOptionsText={ (searchInput == '')? 'Type For Suggestions' : 'No Results' }
					getOptionLabel={ option => option.cardName }
					options={ searchOptions }
					autoHighlight
					groupBy={ option => option.cardColor }
					getOptionSelected={ (option, value) => window.location.assign(`/card/${value.cardID}`) }
					renderGroup={ option => {
						return(
							<div style={{margin: '1.5rem', width: '100%'}} >
								<Typography
									variant='subtitle2'>
										{option.group}</Typography>
								<Divider />
								{option.children}
							</div>
						)
					}}
					renderInput={ (params) => (
						<div style={{ width: '100%', display: 'flex' }} >
						<InputBase
							ref={params.InputProps.ref}
							inputProps={params.inputProps}
							style={{ color: 'rgba(0,0,0,.87)', flex: '1', margin: '.8rem', fontSize: '1.23rem' }}
							placeholder='Search...'
							onChange={ event => {setSearchInput(event.target.value)} }
							/>
							<IconButton>
								<SearchIcon />
							</IconButton>
						</div>
					)}
					renderOption={ option => {
						return(
							<div>
								<SearchSuggestionTypography variant='body1'>{option.cardName}</SearchSuggestionTypography>
								<SearchSuggestionTypography variant='body1' style={{ color: 'rgb(101,119,134)'}} >{option.monsterType}</SearchSuggestionTypography>
							</div>
						)
					}}
				/>
			</Paper>

			<br />
			<br />
			<br />

			<ChildPaper >
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

			<ChildPaper >
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
		</MainContentContainer>
	)
}