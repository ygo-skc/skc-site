import { Dispatch, FC, KeyboardEvent, Ref, useEffect, useId, useRef, useState } from 'react'
import { Button, Chip, ClickAwayListener, IconButton, InputBase, Popper, PopperProps, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

import { findPlace, TierListAction, TierListState } from './tierListState'
import useTierCardSearch from './useTierCardSearch'
import CardFrameRing from '../util/CardFrameRing'
import highlight from '../util/search/highlight'
import { useHistoryEntryState } from '../util/useHistoryEntry'

type PopperInstance = NonNullable<PopperProps['popperRef']> extends Ref<infer Instance> ? Instance : never

// name widths for the rows that hold the results' place while they load, like the search popup's
const SKELETON_WIDTHS = [72, 54, 64, 46, 60]

/*
 * Search for cards to add to the tray. Each result says whether it's on the page already - only new cards can be added,
 * by clicking the row or Enter on the highlighted one (up / down move the highlight). Esc or a click outside hides the results (focusing the field brings them back),
 * a second Esc or the clear button empties the search
 */
const TierListSearch: FC<{ list: TierListState; dispatch: Dispatch<TierListAction>; onAdded: (card: YGOCard.Deets) => void }> = ({ list, dispatch, onAdded }) => {
	const { query, setQuery, cards, isLoading, failed } = useTierCardSearch()
	const [highlighted, setHighlighted] = useState(0)
	const [shownCards, setShownCards] = useState(cards)
	const listboxId = useId()
	// in the history entry, so results the reader hid stay hidden when they come back
	const [isOpen, setIsOpen] = useHistoryEntryState('tierListSearchOpen', true)
	const inputRef = useRef<HTMLInputElement>(null)
	const [field, setField] = useState<HTMLDivElement | null>(null)
	const popper = useRef<PopperInstance>(null)

	// a new set of results starts back at the top
	if (shownCards !== cards) {
		setShownCards(cards)
		setHighlighted(0)
	}

	const statusOf = (card: YGOCard.Deets) => {
		const place = findPlace(list, card.cardID)
		return place === undefined ? 'Add' : place === 'tray' ? 'In tray' : `Ranked ${place}`
	}

	const add = (card: YGOCard.Deets) => {
		if (findPlace(list, card.cardID) !== undefined) return
		dispatch({ type: 'add', card })
		onAdded(card)
	}

	const showResults = isOpen && query.trim() !== '' && !isLoading && !failed

	const clear = () => {
		setQuery('')
		inputRef.current?.focus()
	}

	// the results scroll inside the popup. scrolls only the popup, so the page itself doesn't jump the way scrollIntoView can
	const scrollToOption = (index: number) => {
		const row = document.getElementById(optionId(index))
		const popup = row?.closest('.tier-list-search__popup')
		if (!row || !popup) return

		const { top, bottom } = row.getBoundingClientRect()
		const view = popup.getBoundingClientRect()
		if (top < view.top) popup.scrollTop -= view.top - top
		else if (bottom > view.bottom) popup.scrollTop += bottom - view.bottom
	}

	// only the results on screen - while the next answer loads, the old ones are hidden and can't be added
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			if (isOpen && query !== '') setIsOpen(false)
			else setQuery('')
			return
		}
		if (!showResults || cards.length === 0) return
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault()
			const step = event.key === 'ArrowDown' ? 1 : -1
			const next = (highlighted + step + cards.length) % cards.length
			setHighlighted(next)
			scrollToOption(next)
		} else if (event.key === 'Enter') {
			event.preventDefault()
			add(cards[highlighted])
		}
	}

	// the popup is placed before the answer fills it - place it again once it has its height, so it can open upward when there's no room below
	useEffect(() => {
		popper.current?.update()
	}, [cards, showResults, failed, isLoading])

	const optionId = (index: number) => `${listboxId}-option-${index}`

	return (
		<ClickAwayListener onClickAway={() => setIsOpen(false)}>
			<div className='tier-list-search'>
				<div className='tier-list-search__field' ref={setField}>
					<SearchIcon aria-hidden='true' />
					{/* body2, like the rest of the side column - the field takes its size from here */}
					<Typography variant='body2' component='div' className='tier-list-search__input'>
						<InputBase
							fullWidth
							inputRef={inputRef}
							value={query}
							onChange={(event) => {
								setQuery(event.target.value)
								setIsOpen(true)
							}}
							onFocus={() => setIsOpen(true)}
							onKeyDown={onKeyDown}
							placeholder='Search cards by name or passcode'
							inputProps={{
								role: 'combobox',
								'aria-label': 'Search cards by name or passcode',
								'aria-autocomplete': 'list',
								'aria-expanded': showResults && cards.length > 0,
								'aria-controls': listboxId,
								'aria-activedescendant': showResults && cards.length > 0 ? optionId(highlighted) : undefined,
							}}
						/>
					</Typography>
					{query !== '' && (
						<IconButton className='tier-list-search__clear' aria-label='Clear search' onClick={clear}>
							<CloseIcon />
						</IconButton>
					)}
				</div>

				{/* the results float over the page under the field, as wide as it - fixed, so the phone sheet's scrolling doesn't clip them, and kept
				    in the DOM (inside the search, for its styles, the click-away check and tab order) so the combobox always has its listbox */}
				<Popper
					open={isOpen && query.trim() !== ''}
					anchorEl={field}
					popperRef={popper}
					keepMounted
					disablePortal
					placement='bottom-start'
					className='tier-list-search__popup'
					popperOptions={{ strategy: 'fixed' }}
					modifiers={[
						{ name: 'offset', options: { offset: [0, 8] } },
						// against the window, not the phone sheet that scrolls around the field - with more room above (the sheet sits at the bottom), the results open upward
						{ name: 'flip', options: { boundary: document.documentElement, rootBoundary: 'viewport', fallbackPlacements: ['top-start'], padding: 16 } },
						{ name: 'preventOverflow', options: { boundary: document.documentElement, rootBoundary: 'viewport', padding: 16 } },
						{
							name: 'sameWidth',
							enabled: true,
							phase: 'beforeWrite',
							requires: ['computeStyles'],
							fn: ({ state }) => {
								state.styles.popper.width = `${state.rects.reference.width}px`
							},
						},
					]}
				>
					{/* the rows the answer will fill - a first search, or the next one while the last results are swapped out */}
					{isLoading && (
						<div className='tier-list-search__loading' aria-hidden='true'>
							{SKELETON_WIDTHS.map((width) => (
								<div key={width} className='tier-list-search__skeleton'>
									<span className='tier-list-search__skeleton-thumb' />
									<span className='tier-list-search__skeleton-lines'>
										<span style={{ width: `${width}%` }} />
										<span className='tier-list-search__skeleton-pill' />
									</span>
								</div>
							))}
						</div>
					)}
					{failed && !isLoading && (
						<Typography variant='body2' className='tier-list-search__note' role='status'>
							Couldn&apos;t search cards
						</Typography>
					)}
					{showResults && cards.length === 0 && (
						<Typography variant='body2' className='tier-list-search__note' role='status'>
							No cards match
						</Typography>
					)}

					<ul id={listboxId} role='listbox' aria-label='Search results' aria-busy={isLoading} className='tier-list-search__results' hidden={!showResults || cards.length === 0}>
						{showResults &&
							cards.map((card, index) => {
								const status = statusOf(card)
								return (
									// the combobox owns keyboard focus, so a row is picked with Enter there - clicking is for the mouse
									<li
										key={card.cardID}
										id={optionId(index)}
										role='option'
										aria-selected={index === highlighted}
										aria-disabled={status !== 'Add'}
										aria-label={`${card.cardName}, ${status}`}
										className='tier-list-search__option'
										onClick={() => add(card)}
										onMouseMove={() => setHighlighted(index)}
									>
										<CardFrameRing cardColor={card.cardColor}>
											<img className='tier-list-search__thumb' src={`https://images.thesupremekingscastle.com/cards/tn/${card.cardID}.jpg`} alt='' />
										</CardFrameRing>
										<span className='tier-list-search__text'>
											<Typography variant='body2' component='span' className='tier-list-search__name'>
												{highlight(card.cardName, query)}
											</Typography>
											{/* the combobox's Enter adds from the keyboard, so the button stays out of the tab order */}
											{status === 'Add' ? (
												<Button
													tabIndex={-1}
													className='tier-list-search__add'
													onClick={(event) => {
														event.stopPropagation()
														add(card)
													}}
												>
													<Typography variant='subtitle2' component='span'>
														Add
													</Typography>
												</Button>
											) : (
												// a flat grey tag with a tick - where the card already is, nothing to press
												<Chip className='tier-list-search__status' icon={<CheckIcon aria-hidden='true' />} label={status} />
											)}
										</span>
									</li>
								)
							})}
					</ul>
				</Popper>
			</div>
		</ClickAwayListener>
	)
}

export default TierListSearch
