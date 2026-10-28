import '../../../css/util/search-palette.css'

import { CSSProperties, Fragment, KeyboardEvent, ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { Button, Chip, Dialog, IconButton, InputBase, Typography, useMediaQuery, useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HistoryIcon from '@mui/icons-material/History'
import axios from 'axios'
import { decodeHTML } from 'entities'
import { ProductImage, YGOCardPreview } from 'skc-rcl'

import FetchHandler from '../../../helper/FetchHandler'
import * as DownstreamServices from '../../../helper/DownstreamServices'
import AppRoutes from '../../../helper/AppRoutes'
import { clearRecentlyViewed, groupRecentlyViewed, readRecentlyViewed, RecentlyViewedItem, RecentProduct } from '../../../helper/RecentlyViewed'
import useVisualViewport from './useVisualViewport'
import usePreventPagePan from './usePreventPagePan'
import CardFrameRing from '../CardFrameRing'

const DESTINATIONS = [
	{ label: 'Home', to: AppRoutes.Home },
	{ label: 'Ban List', to: AppRoutes.BanList },
	{ label: 'Card Browse', to: AppRoutes.CardBrowse },
	{ label: 'Product Browse', to: AppRoutes.ProductBrowse },
	{ label: 'About', to: AppRoutes.About },
]

// gives the api a moment between keystrokes rather than firing a request per letter
const SEARCH_DELAY_MS = 150

// widths of the placeholder name lines, so the skeleton doesn't look like a ruled block
const SKELETON_WIDTHS = [62, 48, 70, 55, 40]

// a card from the search or the history, a product from the history, or a page shortcut - time is when a recent one was viewed
type Option = { id: string; time?: string } & (
	| { card: YGOCard.Deets; product?: never; destination?: never }
	| { product: RecentProduct; card?: never; destination?: never }
	| { destination: (typeof DESTINATIONS)[number]; card?: never; product?: never }
)

// the api sends effects with html entities (bullets, quotes) - the preview renders text as is
const previewCard = (card: YGOCard.Deets): YGOCard.Deets => ({ ...card, cardEffect: decodeHTML(card.cardEffect) })

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
 * Site wide search - cards by name or passcode. Before anything is typed it shows shortcuts to the main pages and the cards and
 * products viewed lately, under day headings. Desktop previews the highlighted card beside the list; phones go full screen with an
 * inline peek per card instead
 */
export default function SearchPalette({ open, onClose }: SearchPaletteProps) {
	const navigate = useNavigate()
	const isPhone = useMediaQuery(useTheme().breakpoints.down('md'), { noSsr: true })
	const listboxId = useId()
	const jumpToId = `${listboxId}-jump`
	// on phones the popup runs down behind the keyboard and toolbar, with the list padded so its last rows can scroll clear of them
	const visibleArea = useVisualViewport(open && isPhone)
	const listRef = useRef<HTMLUListElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	usePreventPagePan(open && isPhone, listRef)

	const [query, setQuery] = useState('')
	const [cards, setCards] = useState<YGOCard.Deets[]>([])
	// the term the current cards belong to - when it trails the query, the cards are stale and the skeleton shows instead
	const [resultsTerm, setResultsTerm] = useState('')
	const [activeIndex, setActiveIndex] = useState(0)
	const [peekedId, setPeekedId] = useState<string>()
	const [recents, setRecents] = useState<RecentlyViewedItem[]>([])

	// the history is read each time search opens, during render so the first frame already has it
	const [wasOpen, setWasOpen] = useState(false)
	if (open !== wasOpen) {
		setWasOpen(open)
		if (open) setRecents(readRecentlyViewed())
	}

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

	// page shortcuts and the history are for an empty search - once typing starts the list is all cards
	const isEmpty = query.trim() === ''
	const isLoading = query.trim() !== resultsTerm

	// stale cards aren't offered while the next ones load - the skeleton holds their place
	const groups: { name: string; key: string; options: Option[] }[] = useMemo(() => {
		if (isEmpty) {
			return groupRecentlyViewed(recents).map((day, index) => ({
				name: day.label,
				key: `recent-${index}`,
				options: day.items.map(
					({ item, time }): Option =>
						item.kind === 'card' ? { id: `${listboxId}-recent-card-${item.id}`, card: item.card, time } : { id: `${listboxId}-recent-product-${item.id}`, product: item, time }
				),
			}))
		}

		return isLoading || cards.length === 0 ? [] : [{ name: 'Cards', key: 'cards', options: cards.map((card) => ({ id: `${listboxId}-card-${card.cardID}`, card })) }]
	}, [isEmpty, recents, isLoading, cards, listboxId])

	// the page shortcuts come first, in their own row above the list
	const jumpCount = isEmpty ? DESTINATIONS.length : 0
	const options = useMemo(
		() => [...DESTINATIONS.slice(0, jumpCount).map((destination): Option => ({ id: `${jumpToId}-${destination.to}`, destination })), ...groups.flatMap((group) => group.options)],
		[jumpCount, groups, jumpToId]
	)

	// a new list starts on its first card or product - the page shortcuts only when there's nothing else
	useEffect(() => {
		setActiveIndex(
			Math.max(
				0,
				options.findIndex((option) => !option.destination)
			)
		)
		setPeekedId(undefined)
	}, [options])

	// a peek left open while the window was narrow shouldn't reappear if it narrows again later
	useEffect(() => {
		if (!isPhone) setPeekedId(undefined)
	}, [isPhone])

	const activeOption = options[activeIndex] as Option | undefined

	// set by the arrow keys, so a row picked by the mouse doesn't scroll the list under the pointer
	const scrollToActive = useRef(false)
	useEffect(() => {
		if (!scrollToActive.current) return
		scrollToActive.current = false

		const list = listRef.current
		const row = activeOption && !activeOption.destination ? document.getElementById(activeOption.id) : null
		if (!list || !row) return

		// the first row of a day brings its heading with it. scrolls only the list, so the page itself doesn't jump the way scrollIntoView can
		const group = row.closest('.search-palette__group')
		const top = (group?.querySelector('[role=option]') === row ? group : row).getBoundingClientRect().top
		const { bottom } = row.getBoundingClientRect()
		const view = list.getBoundingClientRect()
		if (top < view.top) list.scrollTop -= view.top - top
		else if (bottom > view.bottom) list.scrollTop += bottom - view.bottom
	}, [activeOption])

	const choose = useCallback(
		(option: Option) => {
			navigate(
				option.card
					? generatePath(AppRoutes.Card, { cardId: option.card.cardID })
					: option.product
					? generatePath(AppRoutes.ProductInformation, { productId: option.product.id })
					: option.destination.to
			)
			onClose()
		},
		[navigate, onClose]
	)

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (options.length === 0) return

			const onShortcut = activeIndex < jumpCount
			const hasRows = options.length > jumpCount
			const wrap = (index: number) => (index + options.length) % options.length

			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault()
				scrollToActive.current = true
				if (event.key === 'ArrowDown') {
					// down from the shortcut row drops into the list
					setActiveIndex(onShortcut && hasRows ? jumpCount : wrap(activeIndex + 1))
				} else {
					// up from the top of the list goes to the first shortcut, up from the shortcuts wraps to the bottom of the list
					setActiveIndex(activeIndex === jumpCount && jumpCount !== 0 ? 0 : onShortcut && hasRows ? options.length - 1 : wrap(activeIndex - 1))
				}
			} else if (onShortcut && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
				// the input is empty while the shortcuts show, so the caret has nowhere to go
				event.preventDefault()
				setActiveIndex((activeIndex + (event.key === 'ArrowRight' ? 1 : -1) + jumpCount) % jumpCount)
			} else if (event.key === 'Enter' && activeOption !== undefined) {
				event.preventDefault()
				choose(activeOption)
			}
		},
		[options.length, activeIndex, jumpCount, activeOption, choose]
	)

	const handleExited = useCallback(() => setQuery(''), [])

	const clearHistory = useCallback(() => {
		clearRecentlyViewed()
		setRecents([])
		// the button goes with the history, so focus returns to the field rather than dropping to the page
		inputRef.current?.focus()
	}, [])

	const renderOption = (option: Option, index: number) => {
		const isActive = index === activeIndex
		// the peek is the phone layout's preview - desktop has the preview column instead
		const isPeeked = isPhone && option.card !== undefined && option.card.cardID === peekedId
		const name = option.card ? option.card.cardName : option.product?.name ?? ''
		// monster type already says normal/effect/etc, so spells and traps fall back to their colour
		const sub = option.card
			? [...new Set([option.card.monsterType ?? option.card.cardColor, option.card.cardAttribute].filter(Boolean))].join(' · ')
			: [option.product?.productType, option.product?.productSubType].filter(Boolean).join(' · ')

		return (
			<li key={option.id} className={`search-palette__row${isPeeked ? ' search-palette__row--peeked' : ''}`} role='none'>
				<div
					id={option.id}
					role='option'
					aria-selected={isActive}
					// the highlighted name is split into marks, so the option is named from plain text
					aria-label={name}
					aria-describedby={option.time ? `${option.id}-sub ${option.id}-time` : `${option.id}-sub`}
					className='search-palette__option'
					onMouseMove={() => !isActive && setActiveIndex(index)}
					onClick={() => choose(option)}
				>
					{option.card ? (
						<CardFrameRing cardColor={option.card.cardColor}>
							<img className='search-palette__thumb' src={`https://images.thesupremekingscastle.com/cards/tn/${option.card.cardID}.jpg`} alt='' />
						</CardFrameRing>
					) : (
						// rcl's image falls back to a stock cover when a product has none
						<ProductImage className='search-palette__thumb search-palette__thumb--product' productID={option.product?.id ?? ''} size='tn' />
					)}
					<span className='search-palette__text'>
						<Typography variant='subtitle2' component='span' className='search-palette__name'>
							{highlight(name, query)}
						</Typography>
						<Typography id={`${option.id}-sub`} variant='body2' component='span' className='search-palette__sub'>
							{sub}
						</Typography>
					</span>
					{option.time && (
						<Typography id={`${option.id}-time`} variant='body2' component='span' className='search-palette__time'>
							{option.time}
						</Typography>
					)}
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
						<YGOCardPreview card={previewCard(option.card)} />
						<Button className='search-palette__open' variant='contained' disableElevation onClick={() => choose(option)}>
							Open card
						</Button>
					</div>
				)}
			</li>
		)
	}

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
					inputRef={inputRef}
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
							'aria-controls': isEmpty ? `${jumpToId} ${listboxId}` : listboxId,
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

			{isEmpty && (
				<div className='search-palette__jump'>
					<Typography id={`${jumpToId}-label`} variant='subtitle2' component='span' className='search-palette__jump-label'>
						Jump to
					</Typography>
					{/* a second listbox for the combobox, so the arrow keys reach the shortcuts too */}
					<div id={jumpToId} role='listbox' aria-labelledby={`${jumpToId}-label`} aria-orientation='horizontal' className='search-palette__jump-list'>
						{options.slice(0, jumpCount).map((option, index) => (
							<Chip
								key={option.id}
								id={option.id}
								role='option'
								aria-selected={index === activeIndex}
								tabIndex={-1}
								className='search-palette__jump-link'
								label={option.destination?.label}
								onMouseMove={() => index !== activeIndex && setActiveIndex(index)}
								onClick={() => choose(option)}
							/>
						))}
					</div>
					{recents.length !== 0 && (
						<Button className='search-palette__clear' onClick={clearHistory}>
							Clear history
						</Button>
					)}
				</div>
			)}

			{/* the preview column stays while a page shortcut is highlighted (they have no preview), so the list keeps its width */}
			<div className={`search-palette__body${options.some((option) => !option.destination) ? '' : ' search-palette__body--list-only'}`}>
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
					{isEmpty && recents.length === 0 && (
						<li role='presentation' className='search-palette__first-visit'>
							<span className='search-palette__first-visit-icon' aria-hidden='true'>
								<HistoryIcon />
							</span>
							<Typography variant='h6' component='p' className='search-palette__first-visit-title'>
								Nothing here yet
							</Typography>
							<Typography variant='body2' component='p' className='search-palette__first-visit-text'>
								Cards and products you open will show up here, so you can get back to them.
							</Typography>
						</li>
					)}
					{groups.map((group) => (
						<li key={group.name} role='none'>
							<ul role='group' aria-labelledby={`${listboxId}-${group.key}`} className='search-palette__group'>
								<Typography
									id={`${listboxId}-${group.key}`}
									variant={isEmpty ? 'subtitle1' : 'subtitle2'}
									component='li'
									role='presentation'
									className={`search-palette__label${isEmpty ? ' search-palette__label--day' : ''}`}
								>
									{group.name}
								</Typography>
								{group.options.map((option) => renderOption(option, options.indexOf(option)))}
							</ul>
						</li>
					))}
					{groups.length === 0 && !isLoading && !isEmpty && (
						<Typography variant='body2' component='li' role='presentation' className='search-palette__empty'>
							No cards match “{query.trim()}”
						</Typography>
					)}
				</ul>

				{!isPhone && activeOption?.card && (
					<aside className='search-palette__preview' aria-label='Card preview'>
						<YGOCardPreview key={activeOption.card.cardID} card={previewCard(activeOption.card)} />
					</aside>
				)}
				{/* holds the preview column while a recent product is highlighted, so the list doesn't change width between rows */}
				{!isPhone && activeOption?.product && (
					<aside className='search-palette__preview search-palette__preview--plain' aria-label='Product preview'>
						<ProductImage key={activeOption.product.id} className='search-palette__cover' productID={activeOption.product.id} size='md' />
						<Typography variant='h6' component='p' className='search-palette__plain-name'>
							{activeOption.product.name}
						</Typography>
						<Typography variant='body2' component='p' className='search-palette__sub'>
							{[activeOption.product.productType, activeOption.product.productSubType].filter(Boolean).join(' · ')}
						</Typography>
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
