import Autocomplete, {
	AutocompleteChangeReason,
	AutocompleteRenderGroupParams,
	AutocompleteRenderInputParams,
	AutocompleteRenderValueGetItemProps,
} from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { useMediaQuery, useTheme } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

import { FC, Fragment, useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import SearchInput from './SearchInput'
import CardBrowseFilters from './CardBrowseFilters'
import parseCriteriaQuery, { criteriaGroupLabel, CriteriaSuggestion } from './parseCriteriaQuery'
import Typography from '@mui/material/Typography'
import { CardBrowseReducerAction, CardBrowseReducerActionType } from '../../../reducers/CardBrowseCriteriaReducer'
import cardBrowseCriteriaSearchReducer, { CardBrowseCriteriaSearchReducerActionType } from '../../../reducers/CardBrowseCriteriaSearchReducer'

const criteriaKey = (criteria: YGOData.CardBrowseValues) => `${criteria.name}:${criteria.value}`
const suggestionKey = (suggestion: CriteriaSuggestion) =>
	suggestion.kind === 'all' ? `all:${suggestion.criteria.map(criteriaKey).join('|')}` : suggestion.kind === 'one' ? criteriaKey(suggestion.criteria) : 'unknown'
// "Level 4" already says it's a level, so its group isn't repeated beside it
const groupLabel = (criteria: YGOData.CardBrowseValues) => {
	const label = criteriaGroupLabel[criteria.name]
	return criteria.value.toLowerCase().startsWith(label.toLowerCase()) ? undefined : label
}
// phrases the field reads as several filters at once, offered under the pills to show what typing can do
const EXAMPLE_QUERIES = ['light dragon lv 4', 'xyz rank 4', 'link 2 cyberse', 'water tuner']
const suggestionLabel = (suggestion: CriteriaSuggestion) =>
	suggestion.kind === 'all' ? suggestion.criteria.map((criteria) => criteria.value).join(', ') : suggestion.kind === 'one' ? suggestion.criteria.value : suggestion.words.join(' ')

const CardBrowse: FC<{
	skcCardBrowseCriteriaOutput: YGOData.CardBrowseCriteria
	selectedCriteria: YGOData.CardBrowseValues[]
	browseCriteriaDispatch: React.Dispatch<CardBrowseReducerAction>
}> = ({ skcCardBrowseCriteriaOutput, selectedCriteria, browseCriteriaDispatch }) => {
	const [{ browseInput, browseCriteria }, browseCriteriaSearchDispatch] = useReducer(cardBrowseCriteriaSearchReducer, { browseInput: '', browseCriteria: [] })
	const fieldRef = useRef<HTMLDivElement>(null)

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

	const updateSelectedCriteria = useCallback(
		(newValue: YGOData.CardBrowseValues[]) => browseCriteriaDispatch({ type: CardBrowseReducerActionType.UPDATE_SELECTED_CRITERIA, selectedCriteria: newValue }),
		[browseCriteriaDispatch]
	)

	// what's typed is read as words naming criteria - "light dragon lv 4 tuner" - and offered all at once and one by one
	const suggestions = useMemo(() => parseCriteriaQuery(browseInput, browseCriteria, selectedCriteria), [browseInput, browseCriteria, selectedCriteria])
	const hasAddAll = suggestions[0]?.kind === 'all'
	// the picks sit in the field as tokens, so they're kept as suggestions of one
	const value = useMemo(() => selectedCriteria.map((criteria): CriteriaSuggestion => ({ kind: 'one', criteria })), [selectedCriteria])

	const handleOnChange = useCallback(
		(_event: React.SyntheticEvent, newValue: CriteriaSuggestion[], reason: AutocompleteChangeReason) => {
			const picks = newValue.flatMap((suggestion) => (suggestion.kind === 'all' ? suggestion.criteria : suggestion.kind === 'one' ? [suggestion.criteria] : []))
			updateSelectedCriteria(picks.filter((pick, index) => picks.findIndex((other) => criteriaKey(other) === criteriaKey(pick)) === index))
			// a picked suggestion is done with what was typed
			if (reason === 'selectOption') browseCriteriaSearchDispatch({ type: CardBrowseCriteriaSearchReducerActionType.UPDATE_INPUT, browseInput: '' })
		},
		[updateSelectedCriteria]
	)
	const isSameSuggestion = useCallback((option: CriteriaSuggestion, other: CriteriaSuggestion) => suggestionKey(option) === suggestionKey(other), [])
	const isUnknown = useCallback((option: CriteriaSuggestion) => option.kind === 'unknown', [])
	// singles under an "add all" are headed "Or add one"
	const handleGroupBy = useCallback((option: CriteriaSuggestion) => (hasAddAll && option.kind === 'one' ? 'Or add one' : ''), [hasAddAll])
	const keepAll = useCallback((options: CriteriaSuggestion[]) => options, [])

	// selected criteria sit inside the field as white tokens, removed with their x or backspace
	const renderTokens = useCallback(
		(values: CriteriaSuggestion[], getItemProps: AutocompleteRenderValueGetItemProps<true>) =>
			values.map((option, index) => {
				const { key, className, ...itemProps } = getItemProps({ index })
				return <Chip key={key} {...itemProps} className={`${className} card-browse-token`} label={suggestionLabel(option)} />
			}),
		[]
	)
	const handleRenderGroup = useCallback(
		(params: AutocompleteRenderGroupParams) => (
			<li key={params.key} className='criteria-suggestions__group'>
				{params.group && (
					<Typography variant='subtitle2' component='p' className='criteria-suggestions__heading'>
						{params.group}
					</Typography>
				)}
				<ul>{params.children}</ul>
			</li>
		),
		[]
	)
	// an example goes into the field and focuses it, so its "Add all N filters" suggestion opens highlighted
	const tryExample = useCallback((query: string) => {
		browseCriteriaSearchDispatch({ type: CardBrowseCriteriaSearchReducerActionType.UPDATE_INPUT, browseInput: query })
		fieldRef.current?.querySelector('input')?.focus()
	}, [])

	// the examples sit under the pills, so the hint just says what to type. phones cut a long one off, and after the tokens there's room for less still
	const isPhone = useMediaQuery(useTheme().breakpoints.down('sm'), { noSsr: true })
	const placeholder = !isPhone ? 'Add filters in words - a type, attribute or level' : selectedCriteria.length > 0 ? 'Add more' : 'Add filters in words'
	const handleRenderInput = useCallback(
		(params: AutocompleteRenderInputParams) => <SearchInput setInput={browseCriteriaSearchDispatch} searchParams={params} placeholder={placeholder} />,
		[placeholder]
	)
	const handleRenderOption = useCallback(({ key, ...props }: React.HTMLAttributes<HTMLLIElement> & { key: React.Key }, option: CriteriaSuggestion) => {
		if (option.kind === 'all') {
			return (
				<li key={key} {...props} className={`${props.className} criteria-suggestion criteria-suggestion--all`}>
					<Typography variant='subtitle1' component='span'>
						Add all {option.criteria.length} filters
					</Typography>
					<span className='criteria-suggestion__picks'>
						{option.criteria.map((criteria) => (
							<Chip
								key={criteriaKey(criteria)}
								className='criteria-suggestion__pick'
								label={
									<>
										{criteria.value}
										{groupLabel(criteria) && (
											<Typography variant='inherit' component='span' className='criteria-suggestion__group'>
												{' '}
												{groupLabel(criteria)}
											</Typography>
										)}
									</>
								}
							/>
						))}
					</span>
				</li>
			)
		}

		if (option.kind === 'unknown') {
			return (
				<li key={key} {...props} className={`${props.className} criteria-suggestion criteria-suggestion--unknown`}>
					<Typography variant='body2' component='span'>
						No filter matches {option.words.map((word) => `“${word}”`).join(', ')}
					</Typography>
				</li>
			)
		}

		return (
			<li key={key} {...props} className={`${props.className} criteria-suggestion`}>
				<span className='criteria-suggestion__add' aria-hidden='true'>
					<AddRoundedIcon />
				</span>
				<Typography variant='body1' component='span'>
					{option.criteria.value}
				</Typography>
				{groupLabel(option.criteria) && (
					<Typography variant='body2' component='span' className='criteria-suggestion__group'>
						{groupLabel(option.criteria)}
					</Typography>
				)}
			</li>
		)
	}, [])

	return (
		<Fragment>
			<Autocomplete
				ref={fieldRef}
				className='search-bar'
				multiple
				forcePopupIcon={false}
				disableCloseOnSelect
				openOnFocus
				value={value}
				inputValue={browseInput}
				id='browseCriteriaFilter'
				options={suggestions}
				filterOptions={keepAll}
				getOptionLabel={suggestionLabel}
				getOptionKey={suggestionKey}
				getOptionDisabled={isUnknown}
				isOptionEqualToValue={isSameSuggestion}
				groupBy={handleGroupBy}
				autoHighlight
				noOptionsText={browseInput.trim() === '' ? 'Type filters in words - try “xyz rank 4” or “fire warrior”' : 'Already added'}
				onChange={handleOnChange}
				renderValue={renderTokens}
				renderGroup={handleRenderGroup}
				renderInput={handleRenderInput}
				renderOption={handleRenderOption}
				slotProps={{ paper: { className: 'criteria-suggestions' } }}
			/>
			<CardBrowseFilters options={browseCriteria} selectedCriteria={selectedCriteria} onChange={updateSelectedCriteria} />
			<div className='card-browse-examples' role='group' aria-label='Example searches'>
				<Typography variant='body2' component='span' className='card-browse-examples__label'>
					Try
				</Typography>
				{EXAMPLE_QUERIES.map((query) => (
					<Chip key={query} className='card-browse-examples__chip' label={query} onClick={() => tryExample(query)} />
				))}
			</div>
		</Fragment>
	)
}

export default CardBrowse
