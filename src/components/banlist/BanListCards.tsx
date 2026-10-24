import { FC, useMemo, useState } from 'react'
import {
	Button,
	Chip,
	InputBase,
	MenuItem,
	Select,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import { Link } from 'react-router-dom'
import { decodeHTML } from 'entities'
import { CardImageRounded, YGOCardWithImage } from 'skc-rcl'
import { usePageView } from '../util/ResultsViewPreference'
import { BanStatus, banStatusClass, banStatuses, cardKind, CardKind, cardTypeLabel, toBanStatus } from '../../helper/BanStatus'

export type BanListStatusCards = {
	status: BanStatus
	cards: YGOCard.Deets[]
}

type BanListCardsProps = {
	isLoading: boolean
	lists: BanListStatusCards[]
	// status each changed card had on the previous list, by card ID
	previousStatus: Map<string, string>
}

type Row = { card: YGOCard.Deets; status: BanStatus; previous?: string }
type SortKey = 'name' | 'type' | 'status'
type View = 'table' | 'cards'

const PAGE_SIZE = 30

function compareRows(a: Row, b: Row, key: SortKey): number {
	const byName = a.card.cardName.localeCompare(b.card.cardName)
	if (key === 'type') return cardTypeLabel(a.card).localeCompare(cardTypeLabel(b.card)) || byName
	if (key === 'status') return banStatuses.indexOf(a.status) - banStatuses.indexOf(b.status) || byName
	return byName
}

// rows shaped like the loaded ones (thumbnail + name, type, status chip, previous) while the list loads
const TableSkeletonRows: FC = () => (
	<>
		{Array.from({ length: 8 }, (_, i) => (
			<TableRow key={i} data-testid='ban-list-row-skeleton'>
				<TableCell>
					<span className='ban-list-cards__card'>
						<Skeleton className='ban-list-thumb' variant='circular' width={36} height={36} />
						<span className='ban-list-cards__card-text'>
							<Typography variant='subtitle2' component='span'>
								<Skeleton width='12ch' />
							</Typography>
							<Typography variant='body2' component='span' className='ban-list-cards__phone-only'>
								<Skeleton width='10ch' />
							</Typography>
						</span>
					</span>
				</TableCell>
				<TableCell className='ban-list-cards__secondary'>
					<Typography variant='body2'>
						<Skeleton width='14ch' />
					</Typography>
				</TableCell>
				<TableCell>
					<Skeleton variant='rounded' width='5.5rem' height='1.5rem' className='ban-list-changes__chip-skeleton' />
				</TableCell>
				<TableCell className='ban-list-cards__secondary'>
					<Typography variant='caption'>
						<Skeleton width='8ch' />
					</Typography>
				</TableCell>
			</TableRow>
		))}
	</>
)

// every card on the selected list, filterable by name / status / card type, shown as a table or as card images
// a change shows the old status as a tinted chip so it stands out from the quiet dash of unchanged rows
const PreviousStatus: FC<{ previous?: string }> = ({ previous }) => {
	if (!previous) {
		return (
			<Typography variant='body2' className='ban-list-cards__muted'>
				<span aria-hidden='true'>—</span>
				<span className='ban-list-header__sr-only'>No change</span>
			</Typography>
		)
	}

	const status = toBanStatus(previous)
	return (
		<span className='ban-list-cards__previous'>
			<Typography variant='body2' component='span' className='ban-list-cards__muted'>
				was
			</Typography>
			<Chip size='small' className={`ban-status-chip ${status ? banStatusClass(status) : ''}`} label={status ?? previous} />
		</span>
	)
}

const BanListCards: FC<BanListCardsProps> = ({ isLoading, lists, previousStatus }) => {
	const [query, setQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<BanStatus | 'All'>('All')
	const [kindFilter, setKindFilter] = useState<CardKind | 'All'>('All')
	const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'status', direction: 'asc' })
	const [view, setView] = usePageView<View>({ list: 'table', grid: 'cards' })
	const [numShown, setNumShown] = useState(PAGE_SIZE)

	// another list starts from the first page again, keeping the search, filters and view
	const [pagedLists, setPagedLists] = useState(lists)
	if (pagedLists !== lists) {
		setPagedLists(lists)
		setNumShown(PAGE_SIZE)
	}

	const allRows = useMemo<Row[]>(
		() => lists.flatMap(({ status, cards }) => cards.map((card) => ({ card, status, previous: previousStatus.get(card.cardID) }))),
		[lists, previousStatus]
	)

	const rows = useMemo(() => {
		const needle = query.trim().toLowerCase()
		const filtered = allRows.filter(
			(row) =>
				(statusFilter === 'All' || row.status === statusFilter) &&
				(kindFilter === 'All' || cardKind(row.card) === kindFilter) &&
				(needle === '' || row.card.cardName.toLowerCase().includes(needle))
		)
		const direction = sort.direction === 'asc' ? 1 : -1
		return filtered.sort((a, b) => direction * compareRows(a, b, sort.key))
	}, [allRows, query, statusFilter, kindFilter, sort])

	// a new filter starts from the first page again
	const filterBy =
		<T,>(set: (value: T) => void) =>
		(value: T) => {
			set(value)
			setNumShown(PAGE_SIZE)
		}

	const sortBy = (key: SortKey) => setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))

	const shown = rows.slice(0, numShown)

	return (
		<section className='ban-list-block' aria-labelledby='ban-list-cards-heading'>
			<div className='ban-list-cards'>
				<div className='ban-list-cards__tools'>
					<Typography variant='h4' component='h2' id='ban-list-cards-heading' className='ban-list-cards__title'>
						Full list
					</Typography>

					<InputBase
						className='ban-list-cards__search'
						placeholder='Search this list'
						type='search'
						value={query}
						onChange={(event) => filterBy(setQuery)(event.target.value)}
						startAdornment={<SearchIcon />}
						inputProps={{ 'aria-label': 'Search this list' }}
					/>

					<div className='ban-list-cards__filters' role='group' aria-label='Status'>
						{(['All', ...banStatuses.filter((status) => status !== 'Unlimited')] as const).map((status) => (
							<Chip
								key={status}
								className={`ban-list-cards__filter ${status === 'All' ? '' : banStatusClass(status)}`}
								aria-pressed={statusFilter === status}
								onClick={() => filterBy(setStatusFilter)(status)}
								label={
									<>
										{status}
										{!isLoading && ' '}
										{!isLoading && (
											<Typography variant='caption' component='span' className='ban-list-cards__filter-count'>
												{status === 'All' ? allRows.length : lists.find((list) => list.status === status)?.cards.length ?? 0}
											</Typography>
										)}
									</>
								}
							/>
						))}
					</div>

					<div className='ban-list-cards__tools-end'>
						<Typography component='label' variant='body2' id='ban-list-kind-label' className='ban-list-header__sr-only'>
							Card type
						</Typography>
						<Select
							className='ban-list-cards__kind'
							labelId='ban-list-kind-label'
							value={kindFilter}
							onChange={(event) => filterBy(setKindFilter)(event.target.value as CardKind | 'All')}
						>
							<MenuItem value='All'>All types</MenuItem>
							<MenuItem value='Monster'>Monsters</MenuItem>
							<MenuItem value='Spell'>Spells</MenuItem>
							<MenuItem value='Trap'>Traps</MenuItem>
						</Select>

						<ToggleButtonGroup className='ban-list-cards__view' exclusive aria-label='View' value={view} onChange={(_, value: View | null) => value && setView(value)}>
							<ToggleButton value='table'>
								<TableRowsRoundedIcon />
								Table
							</ToggleButton>
							<ToggleButton value='cards'>
								<GridViewRoundedIcon />
								Cards
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
				</div>

				{!isLoading && rows.length === 0 ? (
					<Typography variant='body1' className='ban-list-cards__empty'>
						No cards match these filters.
					</Typography>
				) : view === 'table' ? (
					<TableContainer className='ban-list-cards__table'>
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									{(['name', 'type', 'status'] as const).map((key) => (
										<TableCell key={key} className={key === 'type' ? 'ban-list-cards__secondary' : undefined} sortDirection={sort.key === key ? sort.direction : false}>
											<TableSortLabel active={sort.key === key} direction={sort.key === key ? sort.direction : 'asc'} onClick={() => sortBy(key)}>
												{key === 'name' ? 'Card' : key === 'type' ? 'Type' : 'Status'}
											</TableSortLabel>
										</TableCell>
									))}
									<TableCell className='ban-list-cards__secondary'>Previous</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading && <TableSkeletonRows />}
								{shown.map(({ card, status, previous }) => (
									<TableRow key={card.cardID} hover>
										<TableCell>
											<Link to={`/card/${card.cardID}`} className='ban-list-cards__card'>
												<span className='ban-list-thumb'>
													<CardImageRounded cardID={card.cardID} size='tn' variant='circle' loading='lazy' />
												</span>
												<span className='ban-list-cards__card-text'>
													<Typography variant='subtitle2' component='span' className='ban-list-cards__name'>
														{card.cardName}
													</Typography>
													{/* phones drop the Type column, so the type sits under the name */}
													<Typography variant='body2' component='span' className='ban-list-cards__muted ban-list-cards__phone-only'>
														{cardTypeLabel(card)}
													</Typography>
												</span>
											</Link>
										</TableCell>
										<TableCell className='ban-list-cards__secondary'>
											<Typography variant='body2' className='ban-list-cards__muted'>
												{cardTypeLabel(card)}
											</Typography>
										</TableCell>
										<TableCell>
											<span className='ban-list-cards__status'>
												<Chip size='small' className={`ban-status-chip ${banStatusClass(status)}`} label={status} />
												{/* and the previous status sits under the chip */}
												{previous && (
													<span className='ban-list-cards__phone-only'>
														<PreviousStatus previous={previous} />
													</span>
												)}
											</span>
										</TableCell>
										<TableCell className='ban-list-cards__secondary'>
											<PreviousStatus previous={previous} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<ul className='ban-list-cards__grid'>
						{isLoading &&
							Array.from({ length: 8 }, (_, i) => (
								<li key={i} className='ban-list-cards__grid-item' data-testid='ban-list-card-skeleton'>
									<Skeleton className='ban-list-cards__card-skeleton' variant='rounded' />
								</li>
							))}
						{shown.map(({ card, status, previous }) => (
							<li key={card.cardID} className='ban-list-cards__grid-item'>
								<Link to={`/card/${card.cardID}`} className='aggregate-anchor'>
									<YGOCardWithImage card={{ ...card, cardEffect: decodeHTML(card.cardEffect) }} imgLoadingType='lazy' />
								</Link>
								<div className='ban-list-cards__grid-badge'>
									<Chip size='small' className={`ban-status-chip ${banStatusClass(status)}`} label={status} />
									{previous && (
										<Typography variant='body2' component='span' className='ban-list-cards__grid-was'>
											was {previous}
										</Typography>
									)}
								</div>
							</li>
						))}
					</ul>
				)}

				{!isLoading && rows.length !== 0 && (
					<div className='ban-list-cards__foot'>
						{numShown < rows.length && (
							<Button className='ban-list-cards__more' onClick={() => setNumShown((n) => n + PAGE_SIZE)}>
								Show more
							</Button>
						)}
						<Typography variant='caption' className='ban-list-cards__muted'>
							{shown.length} of {rows.length} cards
						</Typography>
					</div>
				)}
			</div>
		</section>
	)
}

export default BanListCards
