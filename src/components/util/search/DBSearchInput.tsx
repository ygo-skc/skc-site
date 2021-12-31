import { FC } from 'react'

import { AutocompleteRenderInputParams, IconButton, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const DBSearchInput: FC<{ searchParams: AutocompleteRenderInputParams; setSearchInput: React.Dispatch<React.SetStateAction<string>> }> = ({ searchParams, setSearchInput }) => {
	return (
		<div {...searchParams} className='search-input-parent'>
			<InputBase
				className='search-input-field'
				ref={searchParams.InputProps.ref}
				inputProps={searchParams.inputProps}
				placeholder='Search database for specific card...'
				onChange={(event) => {
					setSearchInput(event.target.value)
				}}
			/>
			<IconButton>
				<SearchIcon className='search-icon' />
			</IconButton>
		</div>
	)
}

export default DBSearchInput
