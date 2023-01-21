import { useCallback, useEffect, useState } from 'react'

import { Autocomplete } from '@mui/material'
import FetchHandler from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'

import DBSearchGrouping from './DBSearchGrouping'
import axios, { CancelTokenSource } from 'axios'
import SearchInput from './SearchInput'
import DBSearchOptions from './DBSearchOptions'

class DatabaseSearchStatic {
	static readonly search = (searchSubject: string, setSearchOptions: any, fetchToken: CancelTokenSource, setIsFetching: React.Dispatch<React.SetStateAction<boolean>>) => {
		FetchHandler.handleFetch(
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
			DatabaseSearchStatic.search(searchInput, setSearchOptions, fetchToken, setIsFetching)
		}
	}, [fetchToken])

	const handleGetOptionLabel = useCallback((option: SKCCard) => option.cardName, [])
	const handleGroupBy = useCallback((option: any) => option.cardColor, [])
	const handleOnChange = useCallback((_event: any, value: SKCCard | null, reason: string) => {
		if (reason === 'selectOption' && value != null) {
			window.location.assign(`/card/${value.cardID}`)
		}
	}, [])
	const handleRenderGroup = useCallback((option: any) => <DBSearchGrouping group={option.group} children={option.children} />, [])
	const handleRenderInput = useCallback(
		(params: any) => <SearchInput searchParams={params} setSearchInput={setSearchInput} placeholder='Search database for specific card...' />,
		[]
	)
	const handleRenderOption = useCallback(
		(props: React.HTMLAttributes<HTMLLIElement>, option: SKCCard) => (
			<DBSearchOptions props={props} searchSubject={searchInput} cardNameOption={option.cardName} cardIdOption={option.cardID} monsterTypeOption={option.monsterType!} />
		),
		[]
	)

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
		/>
	)
}
