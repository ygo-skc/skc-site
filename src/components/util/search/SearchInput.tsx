import React, { FC, useCallback } from 'react'

import { AutocompleteRenderInputParams, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { CardBrowseCriteriaSearchReducerAction, CardBrowseCriteriaSearchReducerActionType } from '../../../reducers/CardBrowseCriteriaSearchReducer'

const SearchInput: FC<{
	searchParams: AutocompleteRenderInputParams
	setInput: React.Dispatch<CardBrowseCriteriaSearchReducerAction>
	placeholder: string
}> = ({ searchParams, placeholder, setInput }) => {
	const handleUserTyping = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setInput({ type: CardBrowseCriteriaSearchReducerActionType.UPDATE_INPUT, browseInput: event.target.value })
		},
		[setInput]
	)

	// the magnifier leads the field, ahead of the selected criteria tokens (the autocomplete's start adornment)
	return (
		<TextField
			{...searchParams}
			className='search-input-field'
			placeholder={placeholder}
			onChange={handleUserTyping}
			slotProps={{
				...searchParams.slotProps,
				input: {
					...searchParams.slotProps.input,
					startAdornment: (
						<>
							<SearchIcon className='search-input-field__icon' aria-hidden='true' />
							{searchParams.slotProps.input.startAdornment}
						</>
					),
				},
				htmlInput: { ...searchParams.slotProps.htmlInput, 'aria-label': 'Filter cards' },
			}}
		/>
	)
}

export default SearchInput
