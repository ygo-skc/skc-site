import { FC, useEffect, useMemo, useRef } from 'react'
import { Button, InputBase, Skeleton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'

import CardBrowseFilters, { browsePills } from '../util/search/CardBrowseFilters'
import CardBrowseResults, { CardBrowseView } from '../util/search/CardBrowseResults'
import { usePageView } from '../util/ResultsViewPreference'
import useHistoryEntry, { useHistoryEntryReducer, useHistoryEntryState } from '../util/useHistoryEntry'
import cardDisplayGridReducer, { CardDisplayGridState, CardDisplayGridStateReducerActionType } from '../../reducers/CardDisplayGridReducer'
import { cardValues, filterOptions, matchesValues } from '../product/productFilters'

const PAGE_SIZE = 50

const isGridSettled = (state: CardDisplayGridState) => !state.isLoading

const matchesQuery = (card: YGOCard.Deets, query: string) => {
	const needle = query.trim().toLowerCase()
	return needle === '' || [card.cardName, card.cardEffect].some((text) => text?.toLowerCase().includes(needle))
}

/*
 * "Members": the cards named after the archetype, in the product page's "In this set" sheet - title, search (name or effect),
 * card browse's filter pills built from these cards and the List | Grid switch, over card browse's results (A-Z, as the API sends them).
 * the header counts the qualified cards too, so the count says how many more sit under Not by name
 */
const ArchetypeMembers: FC<{ cards?: YGOCard.Deets[]; qualified?: number }> = ({ cards, qualified = 0 }) => {
	const [query, setQuery] = useHistoryEntryState('archetype-members-query', '')
	const [picks, setPicks] = useHistoryEntryState<YGOData.CardBrowseValues[]>('archetype-members-picks', [])
	const [savedView, rememberView] = useHistoryEntry<CardBrowseView>('archetype-members-view')
	const [view, setView] = usePageView<CardBrowseView>({ list: 'list', grid: 'grid' }, savedView)
	useEffect(() => {
		rememberView(view)
	}, [view, rememberView])
	const [gridState, dispatch, isGridRestored] = useHistoryEntryReducer(
		'archetype-grid',
		cardDisplayGridReducer,
		{ results: [], totalResults: 0, totalDisplaying: 0, numItemsToLoadWhenNeeded: PAGE_SIZE, isLoading: true },
		isGridSettled
	)

	const values = useMemo(() => new Map((cards ?? []).map((card) => [card.cardID, cardValues(card)])), [cards])
	const options = useMemo(() => filterOptions(Array.from(values.values())), [values])
	const matches = useMemo(() => (cards ?? []).filter((card) => matchesValues(values.get(card.cardID) ?? [], picks) && matchesQuery(card, query)), [cards, values, picks, query])

	// a restored page already holds these results (and the picked row that goes with them), so its first pass is skipped
	const skipRestored = useRef(isGridRestored)
	useEffect(() => {
		if (!cards) return
		if (skipRestored.current) {
			skipRestored.current = false
			return
		}
		dispatch({ type: CardDisplayGridStateReducerActionType.INIT_GRID, results: matches, totalResults: matches.length, totalDisplaying: PAGE_SIZE })
	}, [cards, matches, dispatch])

	const isFiltered = picks.length > 0 || query.trim() !== ''
	const isLoading = !cards || gridState.isLoading
	const total = cards?.length ?? 0

	return (
		<section className='product-contents' aria-labelledby='archetype-members-heading'>
			<div className='product-contents__tools'>
				<div className='product-contents__tools-row'>
					<Typography variant='h4' component='h2' id='archetype-members-heading' className='product-contents__title'>
						Members
					</Typography>

					<InputBase
						className='product-contents__search'
						placeholder='Name or effect'
						type='search'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						startAdornment={<SearchIcon />}
						inputProps={{ 'aria-label': 'Search members' }}
					/>

					{cards ? (
						<CardBrowseFilters options={options} selectedCriteria={picks} onChange={setPicks} />
					) : (
						// the pills only show once the cards give them options - hold their place, each sized by the pill it hides
						<div className='card-browse-filters' aria-hidden='true'>
							{browsePills.map((pill) => (
								<Skeleton key={pill.label} variant='rounded' className='product-contents__pill-skeleton'>
									<Button className='card-browse-pill' endIcon={<ExpandMoreIcon />}>
										{pill.label}
									</Button>
								</Skeleton>
							))}
						</div>
					)}

					<div className='product-contents__tools-end'>
						<div className='product-contents__summary'>
							{isFiltered && (
								<Button
									className='product-contents__clear'
									onClick={() => {
										setPicks([])
										setQuery('')
									}}
								>
									Clear filters
								</Button>
							)}
							<Typography variant='body2' component='p' className='product-contents__count' aria-live='polite'>
								{isLoading ? (
									'Loading cards'
								) : isFiltered ? (
									`${matches.length} of ${total} cards`
								) : (
									<>
										{total} cards
										{/* phones drop the order so the count fits beside the view switch */}
										<span className='product-contents__order'> · A–Z</span>
										{/* phones have ~150px beside the view switch, so they get the short form */}
										{qualified > 0 && (
											<>
												<span className='archetype-members__more'> · {qualified} more under Not by name</span>
												<span className='archetype-members__more archetype-members__more--short'> + {qualified} below</span>
											</>
										)}
									</>
								)}
							</Typography>
						</div>
						<ToggleButtonGroup
							className='card-browse__view product-contents__view'
							exclusive
							aria-label='View'
							value={view}
							onChange={(_, value: CardBrowseView | null) => value && setView(value)}
						>
							<ToggleButton value='list'>
								<ViewListRoundedIcon />
								List
							</ToggleButton>
							<ToggleButton value='grid'>
								<GridViewRoundedIcon />
								Grid
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
				</div>
			</div>

			<div className='product-contents__body'>
				{!isLoading && matches.length === 0 ? (
					<Typography variant='body1' className='product-contents__empty'>
						{total === 0 ? 'No cards are named after this archetype yet.' : 'No members match these filters.'}
					</Typography>
				) : (
					// the archetype answer leaves out levels, so the previewed card's details are still fetched
					<CardBrowseResults cardGridState={cards ? gridState : { ...gridState, isLoading: true }} dispatch={dispatch} view={view} />
				)}
			</div>
		</section>
	)
}

export default ArchetypeMembers
