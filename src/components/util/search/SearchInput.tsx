import React, { FC, useCallback, useRef } from 'react'

import { AutocompleteRenderInputParams, IconButton, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const SearchInput: FC<{
	searchParams: AutocompleteRenderInputParams
	setSearchInput?: React.Dispatch<React.SetStateAction<string>>
	setInput?: React.Dispatch<{ type: string; browseInput: string }>
	placeholder: string
}> = ({ searchParams, setSearchInput, placeholder, setInput }) => {
	const inputRef = useRef<HTMLDivElement>(null)
	const parentRef = useRef<HTMLDivElement>(null)

	const handleUserTyping = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			// TODO: update to have one method
			if (setSearchInput === undefined && setInput !== undefined) {
				setInput({ type: 'UPDATE_INPUT', browseInput: event.target.value })
			} else if (setSearchInput !== undefined) {
				setSearchInput(event.target.value)
			}
		},
		[setInput, setSearchInput]
	)

	const handleSearchIconClicked = useCallback(() => {
		if (inputRef.current !== null && parentRef.current !== null) {
			parentRef.current.focus()
			inputRef.current.focus()
		}
	}, [inputRef, parentRef])

	return (
		<div className='search-input-parent'>
			<TextField {...searchParams} className='search-input-field' inputRef={inputRef} ref={parentRef} placeholder={placeholder} onChange={handleUserTyping} />
			<div className='search-icon-container'>
				<IconButton onClick={handleSearchIconClicked} className='search-icon'>
					<SearchIcon className='search-icon' />
				</IconButton>
			</div>
		</div>
	)
}

export default SearchInput
