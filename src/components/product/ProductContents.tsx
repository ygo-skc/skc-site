import { FC, useEffect, useMemo, useRef } from 'react'
import { Button, InputBase, Skeleton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'

import CardBrowseFilters, { FilterPill } from '../util/search/CardBrowseFilters'
import CardBrowseResults, { CardBrowseView, cardSummary } from '../util/search/CardBrowseResults'
import { usePageView } from '../util/ResultsViewPreference'
import useHistoryEntry, { useHistoryEntryReducer, useHistoryEntryState } from '../util/useHistoryEntry'
import cardDisplayGridReducer, { CardDisplayGridState, CardDisplayGridStateReducerActionType } from '../../reducers/CardDisplayGridReducer'
import { byRarity, contentFilterOptions, matchesFilters, matchesQuery, setNumber } from './productFilters'

const PAGE_SIZE = 50

// card browse's pills, with rarity first since collectors sort a set by it
const pills: FilterPill[] = [
	{ label: 'Rarity', groups: [{ name: 'rarities', heading: 'Rarity' }] },
	{ label: 'Card type', groups: [{ name: 'cardColors', heading: 'Card type' }] },
	{ label: 'Attribute', groups: [{ name: 'attributes', heading: 'Attribute' }] },
	{ label: 'Monster type', groups: [{ name: 'monsterTypes', heading: 'Monster type' }] },
	{
		label: 'Level / Rank / Link',
		groups: [
			{ name: 'levels', heading: 'Level' },
			{ name: 'ranks', heading: 'Rank' },
			{ name: 'linkRatings', heading: 'Link rating' },
		],
	},
	{ label: 'Sub type', groups: [{ name: 'monsterSubTypes', heading: 'Sub type' }] },
]

const isGridSettled = (state: CardDisplayGridState) => !state.isLoading

/*
 * "In this set": a white sheet like the ban list's full list - title, search (name, set number or effect) and the List | Grid switch,
 * then card browse's filter pills built from the set's own cards. the results are card browse's list with its preview, or rcl's cards
 */
const ProductContents: FC<{ product?: YGOProduct.Info }> = ({ product }) => {
	const [query, setQuery] = useHistoryEntryState('product-contents-query', '')
	const [picks, setPicks] = useHistoryEntryState<YGOData.CardBrowseValues[]>('product-contents-picks', [])
	const [savedView, rememberView] = useHistoryEntry<CardBrowseView>('product-contents-view')
	const [view, setView] = usePageView<CardBrowseView>({ list: 'list', grid: 'grid' }, savedView)
	useEffect(() => {
		rememberView(view)
	}, [view, rememberView])
	const [gridState, dispatch, isGridRestored] = useHistoryEntryReducer(
		'product-grid',
		cardDisplayGridReducer,
		{ results: [], totalResults: 0, totalDisplaying: 0, numItemsToLoadWhenNeeded: PAGE_SIZE, isLoading: true },
		isGridSettled
	)

	const content = useMemo(() => [...(product?.productContent ?? [])].sort((a, b) => a.productPosition.localeCompare(b.productPosition)), [product])
	const options = useMemo(() => contentFilterOptions(content), [content])

	// each card's set number and rarities, for its row
	const items = useMemo(() => new Map(content.map((item) => [item.card.cardID, { item, number: product ? setNumber(product, item) : '' }])), [content, product])

	const matches = useMemo(() => Array.from(items.values()).filter(({ item, number }) => matchesFilters(item, picks) && matchesQuery(item, number, query)), [items, picks, query])

	// a restored page already holds these results (and the picked row that goes with them), so its first pass is skipped
	const skipRestored = useRef(isGridRestored)
	useEffect(() => {
		if (!product) return
		if (skipRestored.current) {
			skipRestored.current = false
			return
		}
		dispatch({
			type: CardDisplayGridStateReducerActionType.INIT_GRID,
			results: matches.map(({ item }) => item.card),
			totalResults: matches.length,
			totalDisplaying: PAGE_SIZE,
		})
	}, [product, matches, dispatch])

	const rowDetail = (card: YGOCard.Deets) => {
		const entry = items.get(card.cardID)
		if (!entry) return cardSummary(card)
		return [entry.number, [...entry.item.rarities].sort(byRarity).join(' / '), cardSummary(card)].filter(Boolean).join(' · ')
	}

	const isFiltered = picks.length > 0 || query.trim() !== ''
	const isLoading = !product || gridState.isLoading

	return (
		<section className='product-contents' aria-labelledby='product-contents-heading'>
			<div className='product-contents__tools'>
				<div className='product-contents__tools-row'>
					<Typography variant='h4' component='h2' id='product-contents-heading' className='product-contents__title'>
						In this set
					</Typography>

					<InputBase
						className='product-contents__search'
						placeholder='Name, set number or effect'
						type='search'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						startAdornment={<SearchIcon />}
						inputProps={{ 'aria-label': 'Search this set' }}
					/>

					{/* search, filters, then the view switch at the end - the ban list's order */}
					{product ? (
						<CardBrowseFilters options={options} selectedCriteria={picks} onChange={setPicks} pills={pills} />
					) : (
						// the pills only show once the set's cards give them options - hold their place, each sized by the pill it hides
						<div className='card-browse-filters' aria-hidden='true' data-testid='product-contents-pills-skeleton'>
							{pills.map((pill) => (
								<Skeleton key={pill.label} variant='rounded' className='product-contents__pill-skeleton'>
									<Button className='card-browse-pill' endIcon={<ExpandMoreIcon />}>
										{pill.label}
									</Button>
								</Skeleton>
							))}
						</div>
					)}

					{/* the count and the view switch close the row, like the ban list's type select and switch */}
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
									`${matches.length} of ${content.length} cards`
								) : (
									<>
										{content.length} cards
										{/* phones drop the order so the count fits beside the view switch */}
										<span className='product-contents__order'> · pack order</span>
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
						No cards in this set match these filters.
					</Typography>
				) : (
					<CardBrowseResults cardGridState={product ? gridState : { ...gridState, isLoading: true }} dispatch={dispatch} view={view} rowDetail={rowDetail} fetchDetails={false} />
				)}
			</div>
		</section>
	)
}

export default ProductContents
