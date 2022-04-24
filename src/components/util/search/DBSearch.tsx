import { useEffect, useState } from 'react'

import { Autocomplete } from '@mui/material'
import Fetch from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'

import DBSearchGrouping from './DBSearchGrouping'
import axios, { CancelTokenSource } from 'axios'
import SearchInput from './SearchInput'
import DBSearchOptions from './DBSearchOptions'

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

export default function DBSearch() {
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
			inputValue={searchInput}
			disableCloseOnSelect
			loading={isFetching}
			id='search'
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
				return <DBSearchGrouping group={option.group} children={option.children} />
			}}
			renderInput={(params) => <SearchInput searchParams={params} setSearchInput={setSearchInput} placeholder='Search database for specific card...' />}
			renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: any) => (
				<DBSearchOptions props={props} searchSubject={searchInput} cardNameOption={option.cardName} cardIdOption={option.cardID} monsterTypeOption={option.monsterType} />
			)}
		/>
	)
}
