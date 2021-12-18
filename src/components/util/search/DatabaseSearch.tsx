import '../../../css/suggestion-box/database-search-styles.css'

import { useEffect, useState } from 'react'

import { InputBase, IconButton, Avatar } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { handleFetch } from '../../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../../helper/DownstreamServices'

import RenderGroup, { SearchSuggestionTypography } from './Search'
import axios, { CancelTokenSource } from 'axios'

class _DatabaseSearch {
	static readonly search = (
		searchSubject: string,
		setSearchOptions: React.Dispatch<React.SetStateAction<never[]>>,
		fetchToken: CancelTokenSource,
		setIsFetching: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		handleFetch(
			`${NAME_maps_ENDPOINT['search']}?limit=10&cName=${searchSubject}`,
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
	const [searchInput, setSearchInput] = useState('')
	const [searchOptions, setSearchOptions] = useState([])
	const [fetchToken, setFetchToken] = useState<CancelTokenSource>(axios.CancelToken.source())
	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		if (searchInput !== '') {
			// cancel previous request
			if (isFetching) {
				fetchToken.cancel()
				setFetchToken(axios.CancelToken.source())
			}

			setIsFetching(true)
			_DatabaseSearch.search(searchInput, setSearchOptions, fetchToken, setIsFetching)
		} else {
			setSearchOptions([])
		}
	}, [searchInput])

	return (
		<Autocomplete
			className='search-bar'
			id='search'
			clearOnEscape
			selectOnFocus
			noOptionsText={searchInput === '' ? 'Type For Suggestions' : 'No Results'}
			getOptionLabel={(option) => option.cardName}
			options={searchOptions}
			groupBy={(option) => option.cardColor}
			onChange={(_event, value, reason) => {
				if (reason === 'select-option') {
					window.location.assign(`/card/${value.cardID}`)
				}
			}}
			renderGroup={(option) => {
				return <RenderGroup group={option.group} children={option.children} />
			}}
			renderInput={(params) => (
				<div className='search-input-parent'>
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
			renderOption={(option: any) => {
				const CARD_NAME = option.cardName
				const UPPERCASE_CARD_NAME = CARD_NAME.toUpperCase()
				const UPPERCASE_SEARCH_TERM = searchInput.toUpperCase()

				const INDEX_OF_SEARCH_TERM = UPPERCASE_CARD_NAME.indexOf(UPPERCASE_SEARCH_TERM)
				const LENGTH_OF_SEARCH_TERM = UPPERCASE_SEARCH_TERM.length

				return (
					<div className='search-suggestions-parent'>
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
					</div>
				)
			}}
		/>
	)
}
