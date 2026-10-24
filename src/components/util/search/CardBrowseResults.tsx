import { FC, KeyboardEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { YGOCardColorIndicator, YGOCardPreview, YGOCardWithImage } from 'skc-rcl'
import { decodeHTML } from 'entities'

import FetchHandler from '../../../helper/FetchHandler'
import * as DownstreamServices from '../../../helper/DownstreamServices'
import { CardDisplayGridState, CardDisplayGridStateReducerAction, CardDisplayGridStateReducerActionType } from '../../../reducers/CardDisplayGridReducer'

const PLACEHOLDER_ROWS = 8
const PLACEHOLDER_TILES = 12
const PLACEHOLDER_EFFECT = ['100%', '100%', '100%', '100%', '100%', '60%']

export type CardBrowseView = 'list' | 'grid'

// monster type already says normal/effect/etc, so spells and traps fall back to their colour
const cardSummary = (card: YGOCard.Deets) => {
	const association = card.monsterAssociation
	const tier = association?.level
		? `Level ${association.level}`
		: association?.rank
		? `Rank ${association.rank}`
		: association?.linkRating
		? `Link ${association.linkRating}`
		: undefined
	return [card.monsterType ?? card.cardColor, tier].filter(Boolean).join(' · ')
}

/*
 * browse results as a list of rows with a preview beside it - the picked row is a purple pill and the preview (rcl's YGOCardPreview)
 * sticks beside the list. below md the preview opens inline under the tapped row instead, like the search popup's peek.
 * browse results cut the effect short and carry no ATK / DEF, so the previewed card's full details are fetched (and kept) on demand.
 * the grid view is rcl's card (YGOCardWithImage, as on the ban list), each linking straight to its card page
 */
const CardBrowseResults: FC<{
	cardGridState: CardDisplayGridState
	dispatch: React.Dispatch<CardDisplayGridStateReducerAction>
	view: CardBrowseView
}> = ({ cardGridState, dispatch, view }) => {
	const isPhone = useMediaQuery(useTheme().breakpoints.down('md'), { noSsr: true })
	const { results, totalResults, totalDisplaying, isLoading } = cardGridState
	const shown = results.slice(0, totalDisplaying)

	const [selectedId, setSelectedId] = useState<string>()
	const [peekedId, setPeekedId] = useState<string>()
	const [details, setDetails] = useState<Record<string, YGOCard.Deets>>({})
	const listRef = useRef<HTMLUListElement>(null)
	// where the tapped row sat on screen, so it can be kept there when a peek above it closes
	const tappedRow = useRef<{ id: string; top: number }>(undefined)

	// a new set of results previews its first card (desktop) and closes any peek (phones)
	useEffect(() => {
		setSelectedId(results[0]?.cardID)
		setPeekedId(undefined)
	}, [results])

	const previewedId = view === 'grid' ? undefined : isPhone ? peekedId : selectedId
	useEffect(() => {
		if (previewedId === undefined || details[previewedId] !== undefined) return

		// a short wait so arrowing down the list doesn't fetch every card passed on the way
		const timer = setTimeout(() => {
			FetchHandler.handleFetch<YGOCard.Deets>(
				`${DownstreamServices.SKC_API_ENDPOINTS.cardInstanceUrl}/${previewedId}`,
				(card) => setDetails((cached) => ({ ...cached, [previewedId]: card })),
				false
			)?.catch(() => {
				// the preview keeps the browse result's own (shorter) details
			})
		}, 150)
		return () => clearTimeout(timer)
	}, [previewedId, details])

	// closing a peek above the tapped row would pull the row up by the peek's height (off screen on a phone) - scroll it back
	useLayoutEffect(() => {
		const tapped = tappedRow.current
		tappedRow.current = undefined
		const row = tapped && listRef.current?.querySelector<HTMLElement>(`[data-card-id='${tapped.id}']`)
		if (!tapped || !row) return
		const shift = row.getBoundingClientRect().top - tapped.top
		if (shift !== 0) window.scrollBy(0, shift)
	}, [peekedId])

	const handlePeek = (event: React.MouseEvent<HTMLButtonElement>, cardID: string) => {
		tappedRow.current = { id: cardID, top: event.currentTarget.getBoundingClientRect().top }
		setPeekedId((peeked) => (peeked === cardID ? undefined : cardID))
	}

	const previewCard = (card: YGOCard.Deets) => details[card.cardID] ?? card

	// up / down move through the rows, like a list box
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLUListElement>) => {
			if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
			const index = shown.findIndex((card) => card.cardID === selectedId)
			const next = shown[Math.min(shown.length - 1, Math.max(0, index + (event.key === 'ArrowDown' ? 1 : -1)))]
			if (next === undefined) return

			event.preventDefault()
			setSelectedId(next.cardID)
			listRef.current?.querySelector<HTMLButtonElement>(`[data-card-id='${next.cardID}']`)?.focus()
		},
		[shown, selectedId]
	)

	const showMore = totalDisplaying < totalResults && (
		<Button className='card-browse-results__more' onClick={() => dispatch({ type: CardDisplayGridStateReducerActionType.LOAD_MORE })}>
			Show more
		</Button>
	)

	if (isLoading && view === 'grid') {
		return (
			<ul className='card-browse-grid' data-testid='card-browse-results-skeleton' aria-hidden='true'>
				{Array.from({ length: PLACEHOLDER_TILES }, (_, index) => (
					<li key={index} className='card-browse-grid__skeleton'>
						<Skeleton variant='rounded' className='card-browse-grid__skeleton-art' />
						<Skeleton variant='rounded' className='card-browse-grid__skeleton-body' />
					</li>
				))}
			</ul>
		)
	}

	if (isLoading) {
		return (
			<div className='card-browse-results' data-testid='card-browse-results-skeleton' aria-hidden='true'>
				<div className='card-browse-results__list'>
					<ul>
						{Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
							<li key={index} className='card-browse-row card-browse-row--loading'>
								<Skeleton variant='circular' className='card-browse-row__thumb' />
								<span className='card-browse-row__text'>
									<Typography variant='subtitle2' component='span'>
										<Skeleton width='70%' />
									</Typography>
									<Typography variant='body2' component='span'>
										<Skeleton width='45%' />
									</Typography>
								</span>
								<Skeleton variant='circular' className='card-browse-row__frame-skeleton' />
							</li>
						))}
					</ul>
				</div>
				{!isPhone && (
					<div className='card-browse-preview'>
						<Typography variant='body2' component='span'>
							<Skeleton width={90} />
						</Typography>
						<div className='card-browse-preview__card-skeleton'>
							<Skeleton variant='rounded' className='card-browse-preview__art-skeleton' />
							<Typography variant='h6' component='span'>
								<Skeleton width='60%' />
							</Typography>
							<span className='card-browse-preview__details-skeleton'>
								<Skeleton variant='circular' width={24} height={24} />
								<Skeleton variant='rounded' className='card-browse-preview__chip-skeleton' />
							</span>
							<Typography variant='body2' component='span'>
								{PLACEHOLDER_EFFECT.map((width, index) => (
									<Skeleton key={index} width={width} />
								))}
							</Typography>
						</div>
						<Skeleton variant='rounded' className='card-browse-preview__open-skeleton' />
					</div>
				)}
			</div>
		)
	}

	if (shown.length === 0) return null

	if (view === 'grid') {
		return (
			<div className='card-browse-results card-browse-results--grid'>
				<ul className='card-browse-grid' aria-label='Cards'>
					{shown.map((card) => (
						<li key={card.cardID}>
							<Link to={`/card/${card.cardID}`} className='aggregate-anchor'>
								<YGOCardWithImage card={{ ...card, cardEffect: decodeHTML(card.cardEffect) }} imgLoadingType='lazy' />
							</Link>
						</li>
					))}
				</ul>
				{showMore}
			</div>
		)
	}

	const selectedCard = shown.find((card) => card.cardID === selectedId) ?? shown[0]

	return (
		<div className='card-browse-results'>
			<div className='card-browse-results__list'>
				<ul ref={listRef} aria-label='Cards' onKeyDown={isPhone ? undefined : handleKeyDown}>
					{shown.map((card) => {
						const isSelected = !isPhone && card.cardID === selectedCard.cardID
						const isPeeked = isPhone && card.cardID === peekedId

						return (
							<li key={card.cardID} className={isPeeked ? 'card-browse-results__item--peeked' : undefined}>
								<button
									type='button'
									data-card-id={card.cardID}
									className='card-browse-row'
									// on desktop only the picked row is a tab stop - arrows move through the rest, so tab reaches the preview
									{...(isPhone ? { 'aria-expanded': isPeeked } : { 'aria-pressed': isSelected, tabIndex: isSelected ? 0 : -1 })}
									onClick={(event) => (isPhone ? handlePeek(event, card.cardID) : setSelectedId(card.cardID))}
								>
									<img className='card-browse-row__thumb' src={`https://images.thesupremekingscastle.com/cards/tn/${card.cardID}.jpg`} alt='' loading='lazy' />
									<span className='card-browse-row__text'>
										<Typography variant='subtitle2' component='span' className='card-browse-row__name'>
											{card.cardName}
										</Typography>
										<Typography variant='body2' component='span' className='card-browse-row__sub'>
											{cardSummary(card)}
										</Typography>
									</span>
									<span className='card-browse-row__frame' aria-hidden='true'>
										<YGOCardColorIndicator cardColor={card.cardColor} />
									</span>
								</button>
								{isPeeked && (
									<div className='card-browse-results__peek'>
										<YGOCardPreview card={previewCard(card)} />
										<Button component={Link} to={`/card/${card.cardID}`} variant='contained' disableElevation className='card-browse-results__open'>
											Open card page
										</Button>
									</div>
								)}
							</li>
						)
					})}
				</ul>
				{showMore}
			</div>

			{!isPhone && (
				<aside className='card-browse-preview' aria-label='Preview'>
					<Typography variant='body2' component='p' className='card-browse-preview__position'>
						{shown.indexOf(selectedCard) + 1} of {totalResults.toLocaleString()}
					</Typography>
					<YGOCardPreview key={selectedCard.cardID} card={previewCard(selectedCard)} />
					<Button component={Link} to={`/card/${selectedCard.cardID}`} variant='contained' disableElevation className='card-browse-results__open'>
						Open card page
					</Button>
				</aside>
			)}
		</div>
	)
}

export default CardBrowseResults
