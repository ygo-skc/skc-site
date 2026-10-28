import '../../css/main-pages/ban-list.css'

import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Dialog, IconButton, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { CardImageRounded } from 'skc-rcl'

import CardFrameRing from '../util/CardFrameRing'
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

// What changed's rows, with how many of the set's cards make the link where it's more than one
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

type ProductSuggestionsProps = {
	suggestions: Pick<YGOCard.Suggestion, 'namedMaterials' | 'namedReferences'>
	support: Pick<YGOCard.Support, 'materialFor' | 'referencedBy'>
	isLoading: boolean
	hasError: boolean
}

/*
 * cards outside the set that its cards name (as material or in their text) or that name its cards - a white sheet like
 * "In this set", holding What changed's columns (in a purple tint): one per kind of link, sorted by how many of the set's cards make it
 */
const ProductSuggestions: FC<ProductSuggestionsProps> = ({ suggestions, support, isLoading, hasError }) => {
	const groups: SuggestionGroup[] = [
		{ name: 'Named Materials', rule: "Named as summoning material by this set's cards", references: suggestions.namedMaterials },
		{ name: 'Material For', rule: "Can use this set's cards as material", references: support.materialFor },
		{ name: 'References', rule: "Mentioned in this set's card text", references: suggestions.namedReferences },
		{ name: 'Referenced By', rule: "Mention this set's cards in their text", references: support.referencedBy },
	].filter((group) => (group.references?.length ?? 0) > 0)

	// the popup's group stays set while it fades out, so only the open flag changes on close
	const [popup, setPopup] = useState<{ name?: string; open: boolean }>({ open: false })
	const popupGroup = groups.find((group) => group.name === popup.name)
	const closePopup = () => setPopup((current) => ({ ...current, open: false }))
	const isPhone = useMediaQuery(useTheme().breakpoints.down('sm'))

	return (
		<section className='product-suggestions' aria-labelledby='product-suggestions-heading' aria-busy={isLoading}>
			<div className='product-suggestions__tools'>
				<Typography variant='h4' component='h2' id='product-suggestions-heading' className='product-suggestions__title'>
					Suggestions
				</Typography>
				<Typography variant='body2' className='product-suggestions__intro'>
					Cards outside this set that its cards name, or that name them
				</Typography>
			</div>

			<div className='product-suggestions__body'>
				{isLoading ? (
					// full columns built from the loaded pieces - head, 8 rows, then where "Show all N" sits
					<div className='ban-list-changes' data-testid='product-suggestions-skeleton' aria-hidden='true'>
						{Array.from({ length: 4 }, (_, column) => (
							<div key={column} className='ban-list-changes__column product-suggestions__column'>
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
												<Skeleton
													variant='circular'
													width='calc(var(--card-thumb) + 10px)'
													height='calc(var(--card-thumb) + 10px)'
													className='product-suggestions__thumb-skeleton'
												/>
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
					<Typography variant='body1' className='product-suggestions__empty'>
						Couldn&rsquo;t load suggestions - the suggestion engine may be offline.
					</Typography>
				) : groups.length === 0 ? (
					<Typography variant='body1' className='product-suggestions__empty'>
						No suggestions for this set.
					</Typography>
				) : (
					<div className='ban-list-changes'>
						{groups.map((group) => {
							const sorted = sortedReferences(group.references)

							return (
								<section key={group.name} className='ban-list-changes__column product-suggestions__column' aria-label={group.name}>
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
				aria-labelledby='product-suggestions-dialog-title'
				slotProps={{ paper: { className: 'ban-list-changes-dialog product-suggestions__column' } }}
			>
				{popupGroup && (
					<>
						<SuggestionHead group={popupGroup} titleId='product-suggestions-dialog-title' onClose={closePopup} />
						<div className='ban-list-changes-dialog__body'>
							<SuggestionRows references={sortedReferences(popupGroup.references)} />
						</div>
					</>
				)}
			</Dialog>
		</section>
	)
}

export default ProductSuggestions
