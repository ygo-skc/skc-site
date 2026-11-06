import { FunctionComponent, useEffect, useId, useRef, useState } from 'react'
import { Button, ClickAwayListener, IconButton, InputBase, Popper, Typography, useMediaQuery, useTheme } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { AutoScroller, Cursor, Feedback, PointerActivationConstraints, PointerSensor, PreventSelection } from '@dnd-kit/dom'

import '../../css/main-pages/tier-list.css'
import useTierList from '../tier-list/useTierList'
import { DEFAULT_NAME, findPlace, Place, TierListState } from '../tier-list/tierListState'
import { dragPreview, dropTarget, landing } from '../tier-list/dropTarget'
import TierListSearch from '../tier-list/TierListSearch'
import TierListTray, { TrayCardFace } from '../tier-list/TierListTray'
import TierBoard, { TierCard } from '../tier-list/TierBoard'
import TierPicker from '../tier-list/TierPicker'
import StartOverDialog from '../tier-list/StartOverDialog'
import { useHistoryEntryState } from '../util/useHistoryEntry'
import Breadcrumb from '../header-footer/Breadcrumb'

// a few pixels of movement before a drag starts, so a click still picks the card. A touch holds first (tablets get the drag too), so a swipe still scrolls the page.
// dnd-kit won't start a drag from a button, but a card is a button - only the others (the tray's ×) keep their press
const SENSORS = [
	PointerSensor.configure({
		preventActivation: ({ target }) => target instanceof Element && target.closest('button:not([data-card-id])') !== null,
		activationConstraints: ({ pointerType }) =>
			pointerType === 'touch' ? [new PointerActivationConstraints.Delay({ value: 250, tolerance: 5 })] : [new PointerActivationConstraints.Distance({ value: 6 })],
	}),
]
// dnd-kit's defaults without Accessibility, which would make every card's li a tab stop with its own role (or take over the card button's aria-pressed) - keyboards rank with the picker
const PLUGINS = [AutoScroller, Cursor, Feedback, PreventSelection]

/*
 * A tier list of any cards the reader likes, S to F - search on the side adds cards to the tray, and a picked card
 * (click, Enter or Space) goes to a tier from the picker (a tooltip beside the card) - or, on desktop, cards are dragged between the tray and the tiers. The list is saved on the device until Start over
 */
const TierList: FunctionComponent = () => {
	const [list, dispatch] = useTierList()
	const [pickedID, setPickedID] = useHistoryEntryState<string | undefined>('tierListPicked', undefined)
	const [isStartingOver, setIsStartingOver] = useState(false)
	const [announcement, setAnnouncement] = useState('')
	const nameID = useId()
	// the card whose button gets focus back once the picker closes, wherever the card now sits
	const refocusID = useRef<string>(undefined)
	// the board on its own, without the side column (desktop) or the sheet (phones) - room to rank or to screenshot. Left in the history entry, so going back finds it the same
	const [isExpanded, setIsExpanded] = useHistoryEntryState('tierListExpanded', false)
	const isDraggable = !useMediaQuery(useTheme().breakpoints.down('md'), { noSsr: true })
	const [overPlace, setOverPlace] = useState<Place>()
	const [tooltipArrow, setTooltipArrow] = useState<HTMLSpanElement | null>(null)
	// the list as a drag shows it - a card dragged into another tier (or the tray) sits there, until the drop keeps it or a cancel puts it back
	const [preview, setPreview] = useState<TierListState>()
	const shown = preview ?? list

	const allCards = [...list.tray, ...Object.values(list.tiers).flat()]

	// a picked card that's since left the list (removed, started over) isn't picked anymore
	const pickedPlace = pickedID === undefined ? undefined : findPlace(list, pickedID)
	const picked = pickedPlace && allCards.find((card) => card.cardID === pickedID)
	const togglePick = (cardID: string) => setPickedID((current) => (current === cardID ? undefined : cardID))

	const heading = (
		<div className='tier-list__heading'>
			{/* a white field with its label and a pencil, so it reads as the list's name and as something to type in */}
			<div className='tier-list__name-field'>
				<Typography variant='body2' component='label' htmlFor={nameID} className='tier-list__name-label'>
					List name
				</Typography>
				<div className='tier-list__name-row'>
					<Typography variant='h4' component='div' className='tier-list__name-text'>
						<InputBase
							fullWidth
							id={nameID}
							className='tier-list__name'
							value={list.name}
							placeholder={DEFAULT_NAME}
							onChange={(event) => dispatch({ type: 'rename', name: event.target.value })}
							inputProps={{ maxLength: 80 }}
						/>
					</Typography>
					<EditOutlinedIcon aria-hidden='true' className='tier-list__name-icon' />
				</div>
			</div>
			{/* beside the name, where it's easy to find - red like apple's destructive buttons, and the dialog asks before anything is cleared */}
			<Button className='tier-list__start-over' startIcon={<RestartAltIcon aria-hidden='true' />} onClick={() => setIsStartingOver(true)}>
				Start over
			</Button>
		</div>
	)

	useEffect(() => {
		if (refocusID.current === undefined) return
		document.querySelector<HTMLElement>(`[data-card-id="${refocusID.current}"]`)?.focus()
		refocusID.current = undefined
	})

	const putDown = (cardID: string) => {
		refocusID.current = cardID
		setPickedID(undefined)
	}

	// a removed card takes focus with it, so focus moves to the card after it in its place, as shown (the tray's order and filter are only in the DOM), else the one before.
	// With neither, the search - or the expand button when that's out of sight, or on phones, where focusing the search would bring up the keyboard
	const removeCard = ({ cardID, cardName }: YGOCard.Deets) => {
		const cards = Array.from(document.querySelector(`[data-card-id="${cardID}"]`)?.closest('ul')?.querySelectorAll<HTMLElement>('[data-card-id]') ?? [])
		const index = cards.findIndex((card) => card.dataset.cardId === cardID)
		const search = isDraggable ? document.querySelector<HTMLElement>('.tier-list-search input') : null
		;(cards[index + 1] ?? cards[index - 1] ?? search ?? document.querySelector<HTMLElement>('.tier-list__expand'))?.focus()

		dispatch({ type: 'remove', cardID })
		setAnnouncement(`${cardName} removed`)
		setPickedID(undefined)
	}

	// keyed by card, so picking another card moves focus to the picker again
	const picker = picked && pickedPlace && (
		<TierPicker
			key={picked.cardID}
			cardName={picked.cardName}
			current={pickedPlace}
			onPick={(to) => {
				dispatch({ type: 'move', cardID: picked.cardID, to })
				setAnnouncement(`${picked.cardName} moved to ${to === 'tray' ? 'the tray' : to}`)
				putDown(picked.cardID)
			}}
			onRemove={() => removeCard(picked)}
			onClose={() => putDown(picked.cardID)}
		/>
	)

	// the picker as a tooltip pointing at the picked card. A click elsewhere puts the card down; a click on another card picks that one instead
	const pickerTooltip = picked && (
		<Popper
			open
			role='dialog'
			aria-label={`Rank ${picked.cardName}`}
			className='tier-picker-tooltip'
			anchorEl={() => document.querySelector<HTMLElement>(`[data-card-id="${picked.cardID}"]`) as HTMLElement}
			placement='top'
			modifiers={[
				{ name: 'offset', options: { offset: [0, 12] } },
				// the page's 16px gutter on phones
				{ name: 'preventOverflow', options: { padding: 16 } },
				{ name: 'arrow', enabled: true, options: { element: tooltipArrow, padding: 16 } },
			]}
		>
			<ClickAwayListener onClickAway={(event) => (event.target as Element).closest?.('[data-card-id]') || setPickedID(undefined)}>
				<div>
					<span className='tier-picker-tooltip__arrow' ref={setTooltipArrow} />
					{picker}
				</div>
			</ClickAwayListener>
		</Popper>
	)

	const announcer = (
		<Typography variant='body2' role='status' className='visually-hidden'>
			{announcement}
		</Typography>
	)

	const startOver = (
		<StartOverDialog
			open={isStartingOver}
			onClose={() => setIsStartingOver(false)}
			onConfirm={() => {
				dispatch({ type: 'reset' })
				setPickedID(undefined)
				setIsStartingOver(false)
			}}
		/>
	)

	// every view starts with these - the page's title and the path bar from Home
	const meta = (
		<>
			<title>{`SKC - Tier List`}</title>
			<meta name='description' content='Rank any Yu-Gi-Oh! cards from S to F and take a screenshot to share it.' />
			<Breadcrumb crumbs={['Home', 'Tier List']} />
			{/* the page's h1 - hidden, since the name field says what this is. Out here so the expanded board still has it */}
			<Typography variant='subtitle2' component='h1' className='visually-hidden'>
				Tier list
			</Typography>
		</>
	)

	const search = <TierListSearch list={list} dispatch={dispatch} onAdded={(card) => setAnnouncement(`${card.cardName} added to the tray`)} />

	// the board with its expand / collapse button in the top right corner
	const board = (boardProps: { compact?: boolean; isDraggable?: boolean; overPlace?: Place }) => (
		<div className='tier-list__board'>
			<TierBoard list={shown} picked={pickedID} onPick={togglePick} {...boardProps} />
			<IconButton
				className='tier-list__expand'
				aria-label={isExpanded ? 'Collapse tier list' : 'Expand tier list'}
				onClick={() => {
					// a picked tray card goes out of sight with the side column / sheet
					setPickedID(undefined)
					setIsExpanded(!isExpanded)
				}}
			>
				{isExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
			</IconButton>
		</div>
	)

	// phones - the name and Start over, the board as compact rows, then a sheet with the search and tray. Ranking is tap a card, then a tier
	if (!isDraggable) {
		return (
			<div className='generic-container'>
				{meta}
				{/* keyed per layout - in the same spot as the desktop one, React would keep one dnd-kit manager across a resize and only swap its sensors, which left desktop drags dead after a trip to phone width */}
				<DragDropProvider key='phone' plugins={PLUGINS}>
					<div className='tier-list tier-list--phone'>
						<div className='tier-list__phone-head'>{heading}</div>

						{board({ compact: true })}

						{announcer}
						{!isExpanded && (
							<section className='tier-list__sheet' aria-label='Find cards'>
								{search}
								<TierListTray
									list={list}
									hint='Tap a card, then choose its tier. Your list stays on this device until you start over.'
									onRemove={removeCard}
									picked={pickedID}
									onPick={togglePick}
									compact
								/>
							</section>
						)}
					</div>
				</DragDropProvider>
				{pickerTooltip}
				{startOver}
			</div>
		)
	}

	return (
		<div className='generic-container'>
			{meta}

			<DragDropProvider
				key='desktop'
				sensors={SENSORS}
				plugins={PLUGINS}
				onDragStart={() => setPickedID(undefined)}
				onDragOver={(event) => {
					const { source, target } = event.operation
					setOverPlace(target ? dropTarget(shown, String(target.id))?.to : undefined)
					// dnd-kit shuffles cards within a tier. Across places it would move the card's element behind React's back, so the preview moves it instead
					if (isSortable(source) && isSortable(target) && source.sortable.group === target.sortable.group) return
					event.preventDefault()
					if (source && target) setPreview((current) => dragPreview(current ?? list, String(source.id), String(target.id)))
				}}
				onDragEnd={({ canceled, operation: { source, target } }) => {
					setOverPlace(undefined)
					setPreview(undefined)
					if (canceled || !source) return
					const spot = isSortable(source) ? { to: source.sortable.group as Place, index: source.sortable.index } : undefined
					const drop = landing(shown, String(source.id), target ? String(target.id) : undefined, spot)
					if (drop) dispatch({ type: 'move', cardID: String(source.id), ...drop })
				}}
			>
				<div className='tier-list'>
					{announcer}
					{!isExpanded && (
						<aside className='tier-list__side' aria-label='Find cards'>
							{heading}
							{search}
							<TierListTray
								list={shown}
								hint='Drag a card onto a tier, or pick it and choose one. Your list stays on this device until you start over.'
								onRemove={removeCard}
								picked={pickedID}
								onPick={togglePick}
								isDraggable
								isOver={overPlace === 'tray'}
							/>
						</aside>
					)}

					{board({ isDraggable: true, overPlace })}
				</div>
				{pickerTooltip}

				<DragOverlay>
					{(source) => {
						const card = allCards.find(({ cardID }) => cardID === source.id)
						if (!card) return null
						// the look of where the drag started (the saved list doesn't change until the drop), so it doesn't switch as it crosses into a tier
						return !list.tray.includes(card) ? (
							<div className='tier-list__dragged'>
								<TierCard card={card} />
							</div>
						) : (
							<div className='tier-list-tray__card tier-list__dragged'>
								<TrayCardFace card={card} />
							</div>
						)
					}}
				</DragOverlay>
			</DragDropProvider>

			{startOver}
		</div>
	)
}

export default TierList
