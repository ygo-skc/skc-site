import { useCallback, useEffect, useState } from 'react'

import { Autocomplete, AutocompleteRenderGroupParams, AutocompleteRenderInputParams } from '@mui/material'
import FetchHandler from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'

import DBSearchGrouping from './DBSearchGrouping'
import axios, { CancelTokenSource } from 'axios'
import SearchInput from './SearchInput'
import DBSearchOptions from './DBSearchOptions'

type DBSearchResults = YGOCard.Deets & {
	cardColor: string // override cardColor field from SKCCard to prevent undefined
}

class DatabaseSearchStatic {
	static readonly search = (
		searchSubject: string,
		setSearchOptions: React.Dispatch<React.SetStateAction<DBSearchResults[]>>,
		fetchToken: CancelTokenSource,
		setIsFetching: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		// if there are only digits in search term, also include the search term in query params using cId param
		searchSubject = searchSubject.trim()
		const searchQuery = /^\d+$/.test(searchSubject) ? `cName=${searchSubject}&cId=${searchSubject}` : `cName=${searchSubject}`

		FetchHandler.handleFetch<DBSearchResults[]>(
			`${DownstreamServices.NAME_maps_ENDPOINT.search}?limit=10&${searchQuery}`,
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

export default function DBSearch() {
	const [searchInput, setSearchInput] = useState<string>('')
	const [searchOptions, setSearchOptions] = useState<DBSearchResults[]>([])
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
			DatabaseSearchStatic.search(searchInput, setSearchOptions, fetchToken, setIsFetching)
		}
	}, [fetchToken])

	const handleGetOptionLabel = useCallback((option: YGOCard.Deets) => option.cardName, [])
	const handleGroupBy = useCallback((option: DBSearchResults) => option.cardColor, [])
	const handleOnChange = useCallback((_event: React.SyntheticEvent, value: YGOCard.Deets | null, reason: string) => {
		if (reason === 'selectOption' && value != null) {
			window.location.assign(`/card/${value.cardID}`)
		}
	}, [])
	const handleRenderGroup = useCallback(
		(option: AutocompleteRenderGroupParams) => (
			<DBSearchGrouping key={option.group} group={option.group}>
				{option.children}
			</DBSearchGrouping>
		),
		[]
	)
	const handleRenderInput = useCallback(
		(params: AutocompleteRenderInputParams) => <SearchInput searchParams={params} setSearchInput={setSearchInput} placeholder='Search database for specific card...' />,
		[]
	)
	const handleRenderOption = useCallback(
		(props: React.HTMLAttributes<HTMLLIElement>, option: YGOCard.Deets) => (
			<DBSearchOptions
				key={option.cardID}
				props={props}
				searchSubject={searchInput}
				cardNameOption={option.cardName}
				cardIdOption={option.cardID}
				monsterTypeOption={option.monsterType!}
			/>
		),
		[searchInput]
	)
	const handleFilterOptions = useCallback((options: DBSearchResults[]) => options, []) // this override is necessary as filtering happens at API level

	return (
		<Autocomplete
			className='search-bar'
			forcePopupIcon={false}
			inputValue={searchInput}
			disableCloseOnSelect
			loading={isFetching}
			id='search'
			noOptionsText={searchInput === '' ? 'Type For Suggestions' : 'No Results'}
			getOptionLabel={handleGetOptionLabel}
			options={searchOptions}
			groupBy={handleGroupBy}
			onChange={handleOnChange}
			renderGroup={handleRenderGroup}
			renderInput={handleRenderInput}
			renderOption={handleRenderOption}
			filterOptions={handleFilterOptions}
		/>
	)
}
