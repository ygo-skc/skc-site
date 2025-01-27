import Autocomplete, { AutocompleteRenderGroupParams, AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import DBSearchGrouping from './DBSearchGrouping'

import startCase from 'lodash.startcase'
import { FC, Fragment, useCallback, useEffect, useReducer } from 'react'
import SearchInput from './SearchInput'
import Typography from '@mui/material/Typography'
import SelectedCardBrowseCriteria from './SelectedCardBrowseCriteria'
import { CardBrowseReducerAction, CardBrowseReducerActionType } from '../../../reducers/CardBrowseCriteriaReducer'
import cardBrowseCriteriaSearchReducer, { CardBrowseCriteriaSearchReducerActionType } from '../../../reducers/CardBrowseCriteriaSearchReducer'

const CardBrowse: FC<{
	skcCardBrowseCriteriaOutput: YGOData.CardBrowseCriteria
	selectedCriteria: YGOData.CardBrowseValues[]
	browseCriteriaDispatch: React.Dispatch<CardBrowseReducerAction>
}> = ({ skcCardBrowseCriteriaOutput, selectedCriteria, browseCriteriaDispatch }) => {
	const [{ browseInput, browseCriteria }, browseCriteriaSearchDispatch] = useReducer(cardBrowseCriteriaSearchReducer, { browseInput: '', browseCriteria: [] })

	useEffect(() => {
		const criteria: YGOData.CardBrowseValues[] = []

		Object.keys(skcCardBrowseCriteriaOutput).forEach((criteriaName: string) => {
			const criteriaNameKey = criteriaName as keyof typeof skcCardBrowseCriteriaOutput

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
		})

		browseCriteriaSearchDispatch({ type: CardBrowseCriteriaSearchReducerActionType.UPDATE_BROWSE_CRITERIA, browseCriteria: criteria })
	}, [skcCardBrowseCriteriaOutput])

	const handleGetOptionLabel = useCallback((option: YGOData.CardBrowseValues) => option.value, [])
	const handleGroupBy = useCallback((option: YGOData.CardBrowseValues) => option.name, [])
	const handleOnChange = useCallback(
		(_event: React.SyntheticEvent, newValue: YGOData.CardBrowseValues[]) =>
			browseCriteriaDispatch({ type: CardBrowseReducerActionType.UPDATE_SELECTED_CRITERIA, selectedCriteria: newValue }),
		[browseCriteriaDispatch]
	)
	const renderTags = useCallback(() => null, [])
	const handleRenderGroup = useCallback((option: AutocompleteRenderGroupParams) => <DBSearchGrouping group={startCase(option.group)}>{option.children}</DBSearchGrouping>, [])
	const handleRenderInput = useCallback(
		(params: AutocompleteRenderInputParams) => <SearchInput setInput={browseCriteriaSearchDispatch} searchParams={params} placeholder='Narrow criteria...' />,
		[]
	)
	const handleRenderOption = useCallback(
		(props: React.HTMLAttributes<HTMLLIElement>, option: YGOData.CardBrowseValues) => (
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
