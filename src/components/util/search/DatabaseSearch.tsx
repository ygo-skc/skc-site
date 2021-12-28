import '../../../css/suggestion-box/database-search-styles.css'

import { useEffect, useState } from 'react'

import { InputBase, IconButton, Avatar, Autocomplete } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Fetch from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'

import RenderGroup, { SearchSuggestionTypography } from './Search'
import axios, { CancelTokenSource } from 'axios'

class _DatabaseSearch {
	static readonly search = (searchSubject: string, setSearchOptions: any, fetchToken: CancelTokenSource, setIsFetching: React.Dispatch<React.SetStateAction<boolean>>) => {
		Fetch.handleFetch(
			`${DownstreamServices.NAME_maps_ENDPOINT['search']}?limit=10&cName=${searchSubject}`,
			(json) => {
				setSearchOptions(json)
				setIsFetching(false)
			},
			false,
			fetchToken
		)!.catch(() => {
			setSearchOptions([])
			setIsFetching(false)
		})
	}
}

export default function DatabaseSearch() {
	const [searchInput, setSearchInput] = useState<string>('')
	const [searchOptions, setSearchOptions] = useState([])
	const [fetchToken, setFetchToken] = useState<CancelTokenSource>(axios.CancelToken.source())
	const [isFetching, setIsFetching] = useState<boolean>(false)

	useEffect(() => {
		if (searchInput !== '') {
			// cancel previous request
			fetchToken.cancel()
			setFetchToken(axios.CancelToken.source())
		} else {
			setSearchOptions([])
		}
	}, [searchInput])

	useEffect(() => {
		if (searchInput !== '') {
			setIsFetching(true)
			_DatabaseSearch.search(searchInput, setSearchOptions, fetchToken, setIsFetching)
		}
	}, [fetchToken])

	return (
		<Autocomplete
			className='search-bar'
			loading={isFetching}
			id='search'
			selectOnFocus
			noOptionsText={searchInput === '' ? 'Type For Suggestions' : 'No Results'}
			getOptionLabel={(option: any) => option.cardName}
			options={searchOptions}
			groupBy={(option) => option.cardColor}
			onChange={(_event, value, reason: string) => {
				if (reason === 'selectOption') {
					window.location.assign(`/card/${value.cardID}`)
				}
			}}
			renderGroup={(option) => {
				return <RenderGroup group={option.group} children={option.children} />
			}}
			renderInput={(params) => (
				<div {...params} className='search-input-parent'>
					<InputBase
						className='search-input-field'
						ref={params.InputProps.ref}
						inputProps={params.inputProps}
						placeholder='Search database for specific card...'
						onChange={(event) => {
							setSearchInput(event.target.value)
						}}
					/>
					<IconButton>
						<SearchIcon className='search-icon' />
					</IconButton>
				</div>
			)}
			renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: any) => {
				const CARD_NAME = option.cardName
				const UPPERCASE_CARD_NAME = CARD_NAME.toUpperCase()
				const UPPERCASE_SEARCH_TERM = searchInput.toUpperCase()

				const INDEX_OF_SEARCH_TERM = UPPERCASE_CARD_NAME.indexOf(UPPERCASE_SEARCH_TERM)
				const LENGTH_OF_SEARCH_TERM = UPPERCASE_SEARCH_TERM.length

				return (
					<li {...props} className='search-suggestions-parent'>
						<Avatar className='card-image-avatar' alt={`${CARD_NAME}-Avatar`} src={`https://images.thesupremekingscastle.com/cards/tn/${option.cardID}.jpg`} />
						<div className='search-suggestions-info-parent'>
							<SearchSuggestionTypography variant='subtitle1'>
								{CARD_NAME.slice(0, INDEX_OF_SEARCH_TERM)}
								<strong className='search-suggestion-substring-match'>{CARD_NAME.slice(INDEX_OF_SEARCH_TERM, INDEX_OF_SEARCH_TERM + LENGTH_OF_SEARCH_TERM)}</strong>
								{CARD_NAME.slice(INDEX_OF_SEARCH_TERM + LENGTH_OF_SEARCH_TERM)}
							</SearchSuggestionTypography>
							<SearchSuggestionTypography variant='body1' className='search-suggestion-subheader'>
								{option.monsterType}
							</SearchSuggestionTypography>
						</div>
					</li>
				)
			}}
		/>
	)
}
