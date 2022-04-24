import React, { FC } from 'react'

import { AutocompleteRenderInputParams, IconButton, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const SearchInput: FC<{
	searchParams: AutocompleteRenderInputParams
	setSearchInput?: React.Dispatch<React.SetStateAction<string>>
	setInput?: React.Dispatch<{ type: string; browseInput: string }>
	placeholder: string
}> = ({ searchParams, setSearchInput, placeholder, setInput }) => {
	return (
		<div className='search-input-parent'>
			<TextField
				{...searchParams}
				className='search-input-field'
				placeholder={placeholder}
				onChange={(event) => {
					// TODO: update to have one method
					if (setSearchInput === undefined && setInput !== undefined) {
						setInput({ type: 'UPDATE_INPUT', browseInput: event.target.value })
					} else if (setSearchInput !== undefined) {
						setSearchInput(event.target.value)
					}
				}}
			/>
			<div className='search-icon-container'>
				<IconButton className='search-icon'>
					<SearchIcon className='search-icon' />
				</IconButton>
			</div>
		</div>
	)
}

export default SearchInput
