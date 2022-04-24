import Autocomplete from '@mui/material/Autocomplete'
import DBSearchGrouping from './DBSearchGrouping'

import startCase from 'lodash.startcase'
import { FC, useEffect, useReducer } from 'react'
import SearchInput from './SearchInput'
import Typography from '@mui/material/Typography'
import SelectedCardBrowseCriteria from './SelectedCardBrowseCriteria'

export type CardBrowseReducerType = { browseInput: string; browseCriteria: BrowseCriteria[]; selectedCriteria: BrowseCriteria[] }

function browseReducer(state: CardBrowseReducerType, action: any) {
	switch (action.type) {
		case 'UPDATE_INPUT':
			return {
				...state,
				browseInput: action.browseInput,
			}
		case 'UPDATE_BROWSE_CRITERIA':
			return {
				...state,
				browseCriteria: action.browseCriteria,
			}
		case 'UPDATE_SELECTED_CRITERIA':
			return {
				...state,
				selectedCriteria: action.selectedCriteria,
			}
		default:
			return state
	}
}

const CardBrowse: FC<{ skcCardBrowseCriteriaOutput: SKCCardBrowseCriteria }> = ({ skcCardBrowseCriteriaOutput }) => {
	const [{ browseInput, browseCriteria, selectedCriteria }, browseDispatch] = useReducer(browseReducer, { browseInput: '', browseCriteria: [], selectedCriteria: [] })

	useEffect(() => {
		const criteria: BrowseCriteria[] = []

		Object.keys(skcCardBrowseCriteriaOutput).forEach((criteriaName: string) => {
			const criteriaNameKey = criteriaName as keyof typeof skcCardBrowseCriteriaOutput

			// ignoring HATEOAS links
			if (criteriaNameKey !== ('_links' as const)) {
				const criteriaList: string[] | number[] = skcCardBrowseCriteriaOutput[criteriaNameKey]

				criteriaList.forEach((value: string | number) => {
					if (criteriaName === 'levels') value = `Level ${value}`
					else if (criteriaName === 'ranks') value = `Rank ${value}`
					else if (criteriaName === 'linkRatings') value = `Link Rating ${value}`

					criteria.push({
						name: criteriaName,
						value: value as string,
					})
				})
			}
		})

		browseDispatch({ type: 'UPDATE_BROWSE_CRITERIA', browseCriteria: criteria })
	}, [skcCardBrowseCriteriaOutput])

	return (
		<div>
			<SelectedCardBrowseCriteria selectedCriteria={selectedCriteria} />
			<Autocomplete
				className='search-bar'
				multiple
				forcePopupIcon={false}
				disableCloseOnSelect
				inputValue={browseInput}
				id='browseCriteriaFilter'
				options={browseCriteria}
				getOptionLabel={(option: BrowseCriteria) => option.value}
				groupBy={(option: BrowseCriteria) => option.name}
				autoHighlight
				onChange={(_, val: BrowseCriteria[]) => {
					browseDispatch({ type: 'UPDATE_SELECTED_CRITERIA', selectedCriteria: val })
				}}
				renderTags={() => null}
				renderGroup={(option) => {
					return <DBSearchGrouping group={startCase(option.group)} children={option.children} />
				}}
				renderInput={(params) => <SearchInput setInput={browseDispatch} searchParams={params} placeholder='Narrow criteria...' />}
				renderOption={(props, option) => {
					return (
						<li {...props} className='search-suggestions-parent'>
							<Typography className='search-suggestion-text search-suggestion-header' variant='body1'>
								{option.value}
							</Typography>
						</li>
					)
				}}
			/>
		</div>
	)
}

export default CardBrowse
