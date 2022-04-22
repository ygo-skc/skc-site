import { FC } from 'react'

import { AutocompleteRenderInputParams, IconButton, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const DBSearchInput: FC<{ searchParams: AutocompleteRenderInputParams; setSearchInput: React.Dispatch<React.SetStateAction<string>> }> = ({ searchParams, setSearchInput }) => {
	return (
		<div className='search-input-parent'>
			<TextField
				{...searchParams}
				className='search-input-field'
				placeholder='Search database for specific card...'
				onChange={(event) => {
					setSearchInput(event.target.value)
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

export default DBSearchInput
