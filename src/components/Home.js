
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { throttle } from 'underscore'
import { Helmet } from 'react-helmet'

import { Typography, Link, InputBase, Paper, IconButton, Avatar } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MainContentContainer, ChildPaper } from './MainContent'
import Breadcrumb from './Breadcrumb'
import { handleFetch } from '../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../helper/YgoApiEndpoints'
import Footer from './Footer'

import OneThirdTwoThirdsGrid from './util/grid/OneThirdTwoThirdsGrid'

import { RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography } from './util/grid/OneThirdTwoThirdsGrid'

import {RenderGroup, SearchSuggestionTypography} from './util/Search'

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
	}, [])


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
		, [searchInput])


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

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<RightBoxPaper>
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
									<div style={{ width: '100%', display: 'flex' }} >
										<InputBase
											ref={params.InputProps.ref}
											inputProps={params.inputProps}
											style={{ color: 'rgba(0,0,0,.87)', flex: '1', margin: '.65rem', fontSize: '1.23rem' }}
											placeholder='Search...'
											onChange={event => { setSearchInput(event.target.value) }}
										/>
										<IconButton>
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
						<RightBoxHeaderTypography variant='h4' >
							Social
						</RightBoxHeaderTypography>
						<RightBoxSubHeaderTypography variant='h5'>
							Start A Conversation
						</RightBoxSubHeaderTypography>
						<iframe src="https://discord.com/widget?id=659477868799197185&theme=dark" width="100%" height="300" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
					</RightBoxPaper>
				}
				twoThirdComponent={
					<div>
						<ChildPaper >
							<Typography variant='h4' align='center' >
								Welcome Duelist
							</Typography>

							<Typography variant='body1' >
								This is the Supreme Kings Castle. The Supreme King is the most formidable duelist you will ever meet. His castle has many secrets waiting to be explored.
							</Typography>

							<br /><br /><br />

							<Typography variant='h4' align='center' >
								Content
							</Typography>

							<Typography variant='body1' >
								Currently there are <strong>{cardTotal} cards</strong>, <Link color='secondary' href='/ban_list'><strong>{banListTotal} ban lists</strong></Link> from the past <strong>{yearsOfBanListCoverage}</strong> years and information about <strong>{productTotal}</strong> products.
							</Typography>
							<br />
							<Typography variant='body1' >
								Yugioh is ever expanding and evolving. New products are continuously released and new ban lists established. As such this website will also  be continuously updated to accommodate.
								Enjoy the website ad free with a fast and beautiful UI. There is no tracking and the only money we make is though donations. Want to become a patreon or learn more? Check out the <Link color='secondary' href='/about'><strong>About</strong></Link> section
							</Typography>
						</ChildPaper>

						<ChildPaper >
							<Typography variant='h4' align='center' >
								Whats New?
							</Typography>

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
					</div>
					}
				/>





			<Footer />
		</MainContentContainer>
	)
}