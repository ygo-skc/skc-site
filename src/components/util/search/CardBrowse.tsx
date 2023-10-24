import Autocomplete, { AutocompleteRenderGroupParams, AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import DBSearchGrouping from './DBSearchGrouping'

import startCase from 'lodash.startcase'
import { FC, Fragment, useCallback, useEffect, useReducer } from 'react'
import SearchInput from './SearchInput'
import Typography from '@mui/material/Typography'
import SelectedCardBrowseCriteria from './SelectedCardBrowseCriteria'

function browseCriteriaSearchReducer(state: { browseInput: string; browseCriteria: BrowseCriteria[] }, action: any) {
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
		default:
			return state
	}
}

const CardBrowse: FC<{
	skcCardBrowseCriteriaOutput: SKCCardBrowseCriteria
	selectedCriteria: BrowseCriteria[]
	browseCriteriaDispatch: React.Dispatch<{ type: string; selectedCriteria: readonly BrowseCriteria[] }>
}> = ({ skcCardBrowseCriteriaOutput, selectedCriteria, browseCriteriaDispatch }) => {
	const [{ browseInput, browseCriteria }, browseCriteriaSearchDispatch] = useReducer(browseCriteriaSearchReducer, { browseInput: '', browseCriteria: [] })

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

		browseCriteriaSearchDispatch({ type: 'UPDATE_BROWSE_CRITERIA', browseCriteria: criteria })
	}, [skcCardBrowseCriteriaOutput])

	const handleGetOptionLabel = useCallback((option: BrowseCriteria) => option.value, [])
	const handleGroupBy = useCallback((option: BrowseCriteria) => option.name, [])
	const handleOnChange = useCallback(
		(_event: React.SyntheticEvent, newValue: readonly BrowseCriteria[]) => browseCriteriaDispatch({ type: 'UPDATE_SELECTED_CRITERIA', selectedCriteria: newValue }),
		[browseCriteriaDispatch]
	)
	const renderTags = useCallback(() => null, [])
	const handleRenderGroup = useCallback((option: AutocompleteRenderGroupParams) => <DBSearchGrouping group={startCase(option.group)}>{option.children}</DBSearchGrouping>, [])
	const handleRenderInput = useCallback(
		(params: AutocompleteRenderInputParams) => <SearchInput setInput={browseCriteriaSearchDispatch} searchParams={params} placeholder='Narrow criteria...' />,
		[]
	)
	const handleRenderOption = useCallback(
		(props: React.HTMLAttributes<HTMLLIElement>, option: BrowseCriteria) => (
			<li {...props} className='search-suggestions-parent'>
				<Typography className='search-suggestion-text search-suggestion-header' variant='body1'>
					{option.value}
				</Typography>
			</li>
		),
		[]
	)

	return (
		<Fragment>
			<SelectedCardBrowseCriteria selectedCriteria={selectedCriteria} />
			<Autocomplete
				className='search-bar'
				multiple
				forcePopupIcon={false}
				disableCloseOnSelect
				inputValue={browseInput}
				id='browseCriteriaFilter'
				options={browseCriteria}
				getOptionLabel={handleGetOptionLabel}
				groupBy={handleGroupBy}
				autoHighlight
				onChange={handleOnChange}
				renderTags={renderTags}
				renderGroup={handleRenderGroup}
				renderInput={handleRenderInput}
				renderOption={handleRenderOption}
			/>
		</Fragment>
	)
}

export default CardBrowse
