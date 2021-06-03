
import React, { useEffect, useState, lazy, Suspense } from 'react'
import styled from 'styled-components'
import { throttle } from 'underscore'
import { Helmet } from 'react-helmet'

import { Typography, Link, InputBase, Paper, IconButton, Avatar } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MainContentContainer, ChildPaper } from './MainContent'
import Breadcrumb from './Breadcrumb'
import { handleFetch } from '../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from './util/grid/OneThirdTwoThirdsGrid'

import { LeftBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography } from './util/grid/OneThirdTwoThirdsGrid'

import {RenderGroup, SearchSuggestionTypography} from './util/Search'

const YouTubeUploads = lazy(() => import('./YouTubeUploads'))

const DatabaseSearch = styled(Autocomplete)`
	&&&
	{
		.MuiAutocomplete-popper
		{
			background-color: black;
		}
	}
`


const searchThrottle = throttle((searchSubject, setSearchOptions, history) => {
	handleFetch(`${NAME_maps_ENDPOINT['search']}?limit=10&cName=${searchSubject}`, history, json => { setSearchOptions(json) })
}, 15)


export default function Home({ history }) {
	useEffect(() => {
		handleFetch(NAME_maps_ENDPOINT['databaseStats'], history, (json) => {
			setCardTotal(json.cardTotal)
			setBanListTotal(json.banListTotal)
			setYearsOfBanListCoverage(json.yearsOfBanListCoverage)
			setProductTotal(json.productTotal)
		})
	}, [history])


	const [cardTotal, setCardTotal] = useState(0)
	const [banListTotal, setBanListTotal] = useState(0)
	const [yearsOfBanListCoverage, setYearsOfBanListCoverage] = useState(0)
	const [productTotal, setProductTotal] = useState(0)


	const [searchInput, setSearchInput] = useState('')
	const [searchOptions, setSearchOptions] = useState([])



	useEffect(() => {
		if (searchInput !== '') {
			searchThrottle(searchInput, setSearchOptions, history)
		}
	}
		, [searchInput, history])


	return (
		<MainContentContainer>
			<Helmet>
				<title>The Supreme Kings Castle</title>
				<meta
					name={`The Supreme Kings Castle`}
					content={`YuGiOh Site for checking; card information, current and past ban lists, search cards, and browse cards.`}
					/>
				<meta name="keywords" content={`YuGiOh, ban list, card info, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={['Home']} />


			<Paper style={{ display: 'flex', width: '95%', maxWidth: '500px', margin: '0 auto', borderRadius: '1.5rem', marginBottom: '2rem' }} >
				<DatabaseSearch
					id='search'
					clearOnEscape
					selectOnFocus
					style={{ flex: '1' }}
					noOptionsText={(searchInput === '') ? 'Type For Suggestions' : 'No Results'}
					getOptionLabel={option => option.cardName}
					options={searchOptions}
					groupBy={option => option.cardColor}
					onChange={ (event, value, reason) => {
						if (reason === 'select-option') { window.location.assign(`/card/${value.cardID}`) }
					}
					}
					renderGroup={option => {
						return (
							<RenderGroup
								group={option.group}
								children={option.children}
							/>
						)
					}}
					renderInput={(params) => (
						<div style={{ width: '100%', display: 'flex', padding: '.25rem' }} >
							<InputBase
								ref={params.InputProps.ref}
								inputProps={params.inputProps}
								style={{ color: 'rgba(0,0,0,.90)', flex: '1', margin: '.65rem', fontSize: '1.1rem' }}
								placeholder='Search For Cards In Database...'
								onChange={event => { setSearchInput(event.target.value) }}
							/>
							<IconButton >
								<SearchIcon />
							</IconButton>
						</div>
					)}
					renderOption={option => {
						const CARD_NAME = option.cardName
						const UPPERCASE_CARD_NAME = CARD_NAME.toUpperCase()
						const UPPERCASE_SEARCH_TERM = searchInput.toUpperCase()

						const INDEX_OF_SEARCH_TERM = UPPERCASE_CARD_NAME.indexOf(UPPERCASE_SEARCH_TERM)
						const LENGTH_OF_SEARCH_TERM = UPPERCASE_SEARCH_TERM.length

						return (
							<div style={{display: 'flex'}} >
								<Avatar alt={`${CARD_NAME}-Avatar`} src={`https://images.thesupremekingscastle.com/${option.cardID}.jpg`} style={{marginRight: '.5rem'}} />
								<div style={{ padding: '0rem', margin: '0rem' }} >
									<SearchSuggestionTypography variant='body1'>
										{CARD_NAME.slice(0, INDEX_OF_SEARCH_TERM)}
										<strong>{CARD_NAME.slice(INDEX_OF_SEARCH_TERM, INDEX_OF_SEARCH_TERM + LENGTH_OF_SEARCH_TERM)}</strong>
										{CARD_NAME.slice(INDEX_OF_SEARCH_TERM + LENGTH_OF_SEARCH_TERM)}
									</SearchSuggestionTypography>
									<SearchSuggestionTypography variant='body1' style={{ color: 'rgb(81,99,114)' }} >{option.monsterType}</SearchSuggestionTypography>
								</div>
							</div>
						)
					}}
				/>
			</Paper>

			<Suspense>
				<YouTubeUploads history={history} />
			</Suspense>

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<LeftBoxPaper>
						<RightBoxHeaderTypography variant='h4' >
							Social
						</RightBoxHeaderTypography>
						<RightBoxSubHeaderTypography variant='h5'>
							Join The Discord
						</RightBoxSubHeaderTypography>

						<Typography variant='body1' >
							Use Discord to chat with others within the community. This is my personal server I use with friends. There are chats for you fine people there too! Lets grow the community!
						</Typography>
						<br />

						<div style={{borderStyle: 'solid', borderColor: '#543fda', borderWidth: '.25rem', borderRadius: '1.1rem'}}>
							<iframe style={{borderStyle: 'solid', borderRadius: '1rem'}} src="https://discord.com/widget?id=659477868799197185&theme=light" width="100%" height="400" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
						</div>
					</LeftBoxPaper>
				}
				twoThirdComponent={
					<ChildPaper >
						<Typography variant='h4' >
							Yo!
						</Typography>

						<Typography variant='body1' >
							This is the Supreme Kings Castle. A site dedicated to Yu-Gi-Oh! content.
						</Typography>

						<br />

						<Typography variant='body1' >
							Currently there are <strong>{cardTotal} cards</strong>, <Link color='secondary' href='/ban_list'><strong>{banListTotal} ban lists</strong></Link> from the past <strong>{yearsOfBanListCoverage}</strong> years and information about <strong>{productTotal}</strong> products.
						</Typography>

						<br />

						<Typography variant='body1' >
							Yugioh is ever expanding and evolving. New products are continuously released and new ban lists established. As such this website will also  be continuously updated to accommodate.
							Enjoy the website ad free with a fast and beautiful UI. There is no tracking and the only money we make is though donations. Want to learn more? Check out the <Link color='secondary' href='/about'><strong>About</strong></Link> section
						</Typography>
					</ChildPaper>
					}
				/>
		</MainContentContainer>
	)
}