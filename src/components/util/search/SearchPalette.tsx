import '../../../css/util/search-palette.css'

import { CSSProperties, Fragment, KeyboardEvent, ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { Button, Dialog, IconButton, InputBase, Typography, useMediaQuery, useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import axios from 'axios'
import { YGOCardPreview } from 'skc-rcl'

import FetchHandler from '../../../helper/FetchHandler'
import * as DownstreamServices from '../../../helper/DownstreamServices'
import AppRoutes from '../../../helper/AppRoutes'
import useVisualViewport from './useVisualViewport'
import usePreventPagePan from './usePreventPagePan'

const DESTINATIONS = [
	{ label: 'Home', to: AppRoutes.Home, hint: 'Trending cards and database stats' },
	{ label: 'Ban List', to: AppRoutes.BanList, hint: 'Current and past forbidden & limited lists' },
	{ label: 'Card Browse', to: AppRoutes.CardBrowse, hint: 'Filter cards by attribute, type and level' },
	{ label: 'Product Browse', to: AppRoutes.ProductBrowse, hint: 'Every set, deck and pack by release' },
	{ label: 'About', to: AppRoutes.About, hint: 'The project, its API and how to contribute' },
]

// gives the api a moment between keystrokes rather than firing a request per letter
const SEARCH_DELAY_MS = 150

// widths of the placeholder name lines, so the skeleton doesn't look like a ruled block
const SKELETON_WIDTHS = [62, 48, 70, 55, 40]

type Option = { id: string; card: YGOCard.Deets; destination?: never } | { id: string; destination: (typeof DESTINATIONS)[number]; card?: never }

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

function highlight(text: string, query: string): ReactNode {
	const terms = query
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

	if (terms.length === 0) return text

	return text.split(new RegExp(`(${terms.join('|')})`, 'gi')).map((part, index) => (index % 2 === 1 ? <mark key={index}>{part}</mark> : <Fragment key={index}>{part}</Fragment>))
}

type SearchPaletteProps = {
	open: boolean
	onClose: () => void
}

/*
 * Site wide search - cards by name or passcode, plus shortcuts to the main pages.
 * Desktop previews the highlighted card beside the list; phones go full screen with an inline peek per card instead
 */
export default function SearchPalette({ open, onClose }: SearchPaletteProps) {
	const navigate = useNavigate()
	const isPhone = useMediaQuery(useTheme().breakpoints.down('md'), { noSsr: true })
	const listboxId = useId()
	// on phones the popup runs down behind the keyboard and toolbar, with the list padded so its last rows can scroll clear of them
	const visibleArea = useVisualViewport(open && isPhone)
	const listRef = useRef<HTMLUListElement>(null)
	usePreventPagePan(open && isPhone, listRef)

	const [query, setQuery] = useState('')
	const [cards, setCards] = useState<YGOCard.Deets[]>([])
	// the term the current cards belong to - when it trails the query, the cards are stale and the skeleton shows instead
	const [resultsTerm, setResultsTerm] = useState('')
	const [activeIndex, setActiveIndex] = useState(0)
	const [peekedId, setPeekedId] = useState<string>()

	useEffect(() => {
		const term = query.trim()
		if (term === '') {
			setCards([])
			setResultsTerm('')
			return
		}

		// passcodes are all digits, so those also search by id
		const searchQuery = /^\d+$/.test(term) ? `cName=${term}&cId=${term}` : `cName=${encodeURIComponent(term)}`
		const fetchToken = axios.CancelToken.source()

		const timer = setTimeout(() => {
			FetchHandler.handleFetch<YGOCard.Deets[]>(
				`${DownstreamServices.SKC_API_ENDPOINTS.search}?limit=10&${searchQuery}`,
				(json) => {
					setCards(json)
					setResultsTerm(term)
				},
				false,
				fetchToken
			)?.catch((err) => {
				if (!axios.isCancel(err)) {
					setCards([])
					setResultsTerm(term)
				}
			})
		}, SEARCH_DELAY_MS)

		return () => {
			clearTimeout(timer)
			fetchToken.cancel()
		}
	}, [query])

	// page shortcuts are for an empty search - once typing starts the list is all cards, so nothing shifts or steals enter while they load
	const destinations = useMemo(() => (query.trim() === '' ? DESTINATIONS : []), [query])

	const isLoading = query.trim() !== resultsTerm

	// stale cards aren't offered while the next ones load - the skeleton holds their place
	const options: Option[] = useMemo(
		() => [
			...(isLoading ? [] : cards).map((card) => ({ id: `${listboxId}-card-${card.cardID}`, card })),
			...destinations.map((destination) => ({ id: `${listboxId}-page-${destination.to}`, destination })),
		],
		[isLoading, cards, destinations, listboxId]
	)

	useEffect(() => {
		setActiveIndex(0)
		setPeekedId(undefined)
	}, [options])

	// a peek left open while the window was narrow shouldn't reappear if it narrows again later
	useEffect(() => {
		if (!isPhone) setPeekedId(undefined)
	}, [isPhone])

	const activeOption = options[activeIndex] as Option | undefined

	const choose = useCallback(
		(option: Option) => {
			navigate(option.card ? generatePath(AppRoutes.Card, { cardId: option.card.cardID }) : option.destination.to)
			onClose()
		},
		[navigate, onClose]
	)

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (options.length === 0) return

			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault()
				const step = event.key === 'ArrowDown' ? 1 : -1
				setActiveIndex((index) => (index + step + options.length) % options.length)
			} else if (event.key === 'Enter' && activeOption !== undefined) {
				event.preventDefault()
				choose(activeOption)
			}
		},
		[options.length, activeOption, choose]
	)

	const handleExited = useCallback(() => setQuery(''), [])

	const renderOption = (option: Option, index: number) => {
		const isActive = index === activeIndex
		// the peek is the phone layout's preview - desktop has the preview column instead
		const isPeeked = isPhone && option.card !== undefined && option.card.cardID === peekedId
		const name = option.card ? option.card.cardName : option.destination.label
		// monster type already says normal/effect/etc, so spells and traps fall back to their colour
		const sub = option.card ? [...new Set([option.card.monsterType ?? option.card.cardColor, option.card.cardAttribute].filter(Boolean))].join(' · ') : option.destination.hint

		return (
			<li key={option.id} className={`search-palette__row${isPeeked ? ' search-palette__row--peeked' : ''}`} role='none'>
				<div
					id={option.id}
					role='option'
					aria-selected={isActive}
					// the highlighted name is split into marks, so the option is named from plain text
					aria-label={name}
					aria-describedby={`${option.id}-sub`}
					className='search-palette__option'
					onMouseMove={() => !isActive && setActiveIndex(index)}
					onClick={() => choose(option)}
				>
					{option.card ? (
						<img className='search-palette__thumb' src={`https://images.thesupremekingscastle.com/cards/tn/${option.card.cardID}.jpg`} alt='' />
					) : (
						<span className='search-palette__thumb search-palette__thumb--page'>
							<ArrowForwardIcon />
						</span>
					)}
					<span className='search-palette__text'>
						<Typography variant='subtitle2' component='span' className='search-palette__name'>
							{highlight(name, query)}
						</Typography>
						<Typography id={`${option.id}-sub`} variant='body2' component='span' className='search-palette__sub'>
							{sub}
						</Typography>
					</span>
				</div>
				{isPhone && option.card && (
					<IconButton
						className='search-palette__peek'
						aria-label={`Preview ${option.card.cardName}`}
						aria-expanded={isPeeked}
						onClick={() => setPeekedId(isPeeked ? undefined : option.card.cardID)}
					>
						<ExpandMoreIcon />
					</IconButton>
				)}
				{isPeeked && option.card && (
					<div className='search-palette__peek-detail'>
						<YGOCardPreview card={option.card} />
						<Button className='search-palette__open' variant='contained' disableElevation onClick={() => choose(option)}>
							Open card
						</Button>
					</div>
				)}
			</li>
		)
	}

	const groups = [
		{ name: 'Cards', key: 'cards', options: options.filter((option) => option.card) },
		{ name: 'Jump to', key: 'pages', options: options.filter((option) => option.destination) },
	].filter((group) => group.options.length > 0)

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullScreen={isPhone}
			maxWidth={false}
			className='search-palette-root'
			slotProps={{
				paper: {
					className: 'search-palette',
					'aria-label': 'Search',
					style: visibleArea && ({ '--search-palette-top': `${visibleArea.top}px`, '--search-palette-covered': `${visibleArea.covered}px` } as CSSProperties),
				},
				transition: { onExited: handleExited },
			}}
		>
			<div className='search-palette__bar'>
				<SearchIcon className='search-palette__icon' />
				<InputBase
					autoFocus
					className='search-palette__input'
					sx={{ typography: isPhone ? 'subtitle1' : 'h5', color: 'var(--capsule-text)' }}
					placeholder='Search cards by name or passcode'
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					onKeyDown={handleKeyDown}
					slotProps={{
						input: {
							role: 'combobox',
							'aria-label': 'Search cards',
							'aria-expanded': true,
							'aria-controls': listboxId,
							'aria-autocomplete': 'list',
							'aria-activedescendant': activeOption?.id,
							enterKeyHint: 'go',
						},
					}}
				/>
				{isPhone ? (
					<Button className='search-palette__close' onClick={onClose} aria-label='Close search'>
						Close
					</Button>
				) : (
					<Typography variant='caption' component='kbd' className='search-palette__key'>
						esc
					</Typography>
				)}
			</div>

			<div className='search-palette__body'>
				<ul ref={listRef} id={listboxId} role='listbox' aria-label='Search results' aria-busy={isLoading} className='search-palette__list'>
					{isLoading && (
						<li role='none' aria-hidden='true' className='search-palette__loading'>
							<Typography variant='subtitle2' component='div' className='search-palette__label'>
								Cards
							</Typography>
							{SKELETON_WIDTHS.map((width) => (
								<div key={width} className='search-palette__skeleton'>
									<span className='search-palette__thumb' />
									<span className='search-palette__skeleton-lines'>
										<span style={{ width: `${width}%` }} />
										<span style={{ width: `${width * 0.6}%` }} />
									</span>
								</div>
							))}
						</li>
					)}
					{groups.map((group) => (
						<li key={group.name} role='none'>
							<ul role='group' aria-labelledby={`${listboxId}-${group.key}`} className='search-palette__group'>
								<Typography id={`${listboxId}-${group.key}`} variant='subtitle2' component='li' role='presentation' className='search-palette__label'>
									{group.name}
								</Typography>
								{group.options.map((option) => renderOption(option, options.indexOf(option)))}
							</ul>
						</li>
					))}
					{groups.length === 0 && !isLoading && (
						<Typography variant='body2' component='li' role='presentation' className='search-palette__empty'>
							No cards match “{query.trim()}”
						</Typography>
					)}
				</ul>

				{!isPhone && activeOption?.card && (
					<aside className='search-palette__preview' aria-label='Card preview'>
						<YGOCardPreview key={activeOption.card.cardID} card={activeOption.card} />
					</aside>
				)}
			</div>

			{!isPhone && (
				<Typography variant='body2' component='div' className='search-palette__foot'>
					<span>
						<kbd>↑</kbd>
						<kbd>↓</kbd> move
					</span>
					<span>
						<kbd>↵</kbd> open
					</span>
					<span className='search-palette__foot-end'>
						<kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
						<kbd>K</kbd> from any page
					</span>
				</Typography>
			)}
		</Dialog>
	)
}
