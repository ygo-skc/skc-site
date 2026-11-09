import '../../css/main-pages/ban-list.css'
import '../../css/util/suggestions-sheet.css'

import { FC, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Dialog, IconButton, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { CardImageRounded } from 'skc-rcl'

import CardFrameRing from './CardFrameRing'
import { cardTypeLabel } from '../../helper/BanStatus'

// a column shows this many rows; the rest open in a popup, like the ban list's What changed
const ROWS_SHOWN = 8

type SuggestionGroup = { name: string; rule: string; references: YGOCard.Reference[] | null }

const sortedReferences = (references: YGOCard.Reference[] | null) =>
	[...(references ?? [])].sort((a, b) => b.occurrences - a.occurrences || a.card.cardName.localeCompare(b.card.cardName))

// What changed's head - title, count and the one-line rule - shared by the column and its popup, which adds a close button
const SuggestionHead: FC<{ group: SuggestionGroup; titleId?: string; onClose?: () => void }> = ({ group, titleId, onClose }) => (
	<div className='ban-list-changes__head'>
		<div className='ban-list-changes__title'>
			<Typography variant='h6' component={onClose ? 'h2' : 'h3'} id={titleId}>
				{group.name}
			</Typography>
			<Typography variant='h4' component='span'>
				{group.references?.length ?? 0}
			</Typography>
			{onClose && (
				<IconButton className='ban-list-changes__close' aria-label='Close' onClick={onClose}>
					<CloseRoundedIcon />
				</IconButton>
			)}
		</div>
		<Typography variant='body2'>{group.rule}</Typography>
	</div>
)

// What changed's rows, with how many times the link is made where it's more than one
const SuggestionRows: FC<{ references: YGOCard.Reference[] }> = ({ references }) => (
	<ul className='ban-list-changes__rows'>
		{references.map(({ card, occurrences }) => (
			<li key={card.cardID}>
				<Link to={`/card/${card.cardID}`} className='ban-list-changes__row'>
					<CardFrameRing cardColor={card.cardColor}>
						<span className='ban-list-thumb'>
							<CardImageRounded cardID={card.cardID} size='tn' variant='circle' loading='lazy' />
						</span>
					</CardFrameRing>
					<span className='ban-list-changes__name'>
						<Typography variant='subtitle2' component='span'>
							{card.cardName}
						</Typography>{' '}
						<Typography variant='body2' component='span'>
							{cardTypeLabel(card)}
						</Typography>
					</span>{' '}
					{occurrences > 1 && (
						<span className='ban-list-changes__was'>
							<Typography variant='body2' component='span'>
								{occurrences} links
							</Typography>
						</span>
					)}
				</Link>
			</li>
		))}
	</ul>
)

// each column's one-line rule, and the sheet's intro and empty note - in the words of the page (a set's cards, or one card)
export type SuggestionWording = {
	intro: string
	empty: string
	namedMaterials: string
	materialFor: string
	namedReferences: string
	referencedBy: string
}

type SuggestionsSheetProps = {
	suggestions: Pick<YGOCard.Suggestion, 'namedMaterials' | 'namedReferences'>
	support: Pick<YGOCard.Support, 'materialFor' | 'referencedBy'>
	isLoading: boolean
	hasError: boolean
	wording: SuggestionWording
	// columns the loading skeleton holds - a set usually fills all four, a card fewer
	skeletonColumns?: number
}

/*
 * cards that the page's cards name (as material or in their text) or that name them - a white sheet holding What changed's
 * columns (in a purple tint): one per kind of link, sorted by how many times it's made. the product and card pages share it
 */
const SuggestionsSheet: FC<SuggestionsSheetProps> = ({ suggestions, support, isLoading, hasError, wording, skeletonColumns = 4 }) => {
	const headingId = useId()
	const dialogTitleId = useId()
	const groups: SuggestionGroup[] = [
		{ name: 'Named Materials', rule: wording.namedMaterials, references: suggestions.namedMaterials },
		{ name: 'Material For', rule: wording.materialFor, references: support.materialFor },
		{ name: 'References', rule: wording.namedReferences, references: suggestions.namedReferences },
		{ name: 'Referenced By', rule: wording.referencedBy, references: support.referencedBy },
	].filter((group) => (group.references?.length ?? 0) > 0)

	// the popup's group stays set while it fades out, so only the open flag changes on close
	const [popup, setPopup] = useState<{ name?: string; open: boolean }>({ open: false })
	const popupGroup = groups.find((group) => group.name === popup.name)
	const closePopup = () => setPopup((current) => ({ ...current, open: false }))
	const isPhone = useMediaQuery(useTheme().breakpoints.down('sm'))

	return (
		<section className='suggestions-sheet' aria-labelledby={headingId} aria-busy={isLoading}>
			<div className='suggestions-sheet__tools'>
				<Typography variant='h4' component='h2' id={headingId} className='suggestions-sheet__title'>
					Suggestions
				</Typography>
				<Typography variant='body2' className='suggestions-sheet__intro'>
					{wording.intro}
				</Typography>
			</div>

			<div className='suggestions-sheet__body'>
				{isLoading ? (
					// full columns built from the loaded pieces - head, 8 rows, then where "Show all N" sits
					<div className='ban-list-changes' data-testid='suggestions-sheet-skeleton' aria-hidden='true'>
						{Array.from({ length: skeletonColumns }, (_, column) => (
							<div key={column} className='ban-list-changes__column suggestions-sheet__column'>
								<div className='ban-list-changes__head'>
									<div className='ban-list-changes__title'>
										<Typography variant='h6' component='span'>
											<Skeleton width='9ch' />
										</Typography>
										<Typography variant='h4' component='span'>
											<Skeleton width='2ch' />
										</Typography>
									</div>
									{/* phones wrap the rule onto a second line */}
									<Typography variant='body2' component='span'>
										<Skeleton width='90%' />
										<Skeleton width='40%' className='ban-list-phone-line' />
									</Typography>
								</div>
								<ul className='ban-list-changes__rows'>
									{Array.from({ length: ROWS_SHOWN }, (_, row) => (
										<li key={row}>
											<div className='ban-list-changes__row'>
												{/* the thumb in its frame ring */}
												<Skeleton variant='circular' width='calc(var(--card-thumb) + 10px)' height='calc(var(--card-thumb) + 10px)' className='suggestions-sheet__thumb-skeleton' />
												<span className='ban-list-changes__name'>
													<Typography variant='subtitle2' component='span'>
														<Skeleton width='60%' />
													</Typography>
													<Typography variant='body2' component='span'>
														<Skeleton width='40%' />
													</Typography>
												</span>
											</div>
										</li>
									))}
								</ul>
								<div className='ban-list-changes__more-skeleton'>
									<Skeleton width='6rem' />
								</div>
							</div>
						))}
					</div>
				) : hasError ? (
					<Typography variant='body1' className='suggestions-sheet__empty'>
						Couldn&rsquo;t load suggestions - the suggestion engine may be offline.
					</Typography>
				) : groups.length === 0 ? (
					<Typography variant='body1' className='suggestions-sheet__empty'>
						{wording.empty}
					</Typography>
				) : (
					<div className='ban-list-changes'>
						{groups.map((group) => {
							const sorted = sortedReferences(group.references)

							return (
								<section key={group.name} className='ban-list-changes__column suggestions-sheet__column' aria-label={group.name}>
									<SuggestionHead group={group} />
									<SuggestionRows references={sorted.slice(0, ROWS_SHOWN)} />

									{sorted.length > ROWS_SHOWN && (
										<Button className='ban-list-changes__more' fullWidth aria-haspopup='dialog' onClick={() => setPopup({ name: group.name, open: true })}>
											Show all {sorted.length}
										</Button>
									)}
								</section>
							)
						})}
					</div>
				)}
			</div>

			<Dialog
				open={popup.open && popupGroup !== undefined}
				onClose={closePopup}
				fullScreen={isPhone}
				aria-labelledby={dialogTitleId}
				slotProps={{ paper: { className: 'ban-list-changes-dialog suggestions-sheet__column' } }}
			>
				{popupGroup && (
					<>
						<SuggestionHead group={popupGroup} titleId={dialogTitleId} onClose={closePopup} />
						<div className='ban-list-changes-dialog__body'>
							<SuggestionRows references={sortedReferences(popupGroup.references)} />
						</div>
					</>
				)}
			</Dialog>
		</section>
	)
}

export default SuggestionsSheet
