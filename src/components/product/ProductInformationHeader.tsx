import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Chip, Skeleton, Typography } from '@mui/material'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { ProductImage, YGOCardColorIndicator } from 'skc-rcl'

import FetchHandler from '../../helper/FetchHandler'
import { useHistoryEntryState } from '../util/useHistoryEntry'
import * as DownstreamServices from '../../helper/DownstreamServices'
import * as Dates from '../../helper/Dates'
import { byRarity, cardKind } from './productFilters'

// past this many the rest fold behind a "+N more" chip
const ARCHETYPES_SHOWN = 8

type Neighbours = { previous?: YGOProduct.Deets; next?: YGOProduct.Deets }

// the products released just before and after this one with the same type and sub type (e.g. the Core Sets either side) -
// kept for going back, so the pills are there on the first frame instead of growing the header after a refetch
const useNeighbours = (product?: YGOProduct.Deets): Neighbours => {
	const [neighbours, setNeighbours, isRestored] = useHistoryEntryState<Neighbours>('product-neighbours', {})

	useEffect(() => {
		if (!product || isRestored) return
		FetchHandler.handleFetch<YGOData.ProductBrowseResult>(
			DownstreamServices.SKC_API_ENDPOINTS.productBrowse,
			({ products }) => {
				const siblings = products
					.filter((other) => other.productType === product.productType && other.productSubType === product.productSubType)
					.sort((a, b) => a.productReleaseDate.localeCompare(b.productReleaseDate) || a.productId.localeCompare(b.productId))
				const index = siblings.findIndex((other) => other.productId === product.productId)
				if (index !== -1) setNeighbours({ previous: siblings[index - 1], next: siblings[index + 1] })
			},
			false
		)?.catch(() => {
			// no neighbours to step to - the pills stay hidden
		})
	}, [product?.productId, isRestored])

	return neighbours
}

// a pill-shaped placeholder sized by the real control it hides, so it takes that control's exact width and height
const PillSkeleton: FC<{ children: ReactNode }> = ({ children }) => (
	<Skeleton variant='rounded' className='product-info-header__pill-skeleton'>
		{children}
	</Skeleton>
)

// a typical set's worth of archetype chips, wrapping like the loaded list
const ArchetypeChipsSkeleton: FC = () => (
	<div className='product-info-header__archetype-list'>
		{['Blue-Eyes', 'Dark Magician', 'HERO', 'Sky Striker', 'Kuriboh', 'Utopia', 'Branded', '+12 more'].map((label) => (
			<PillSkeleton key={label}>
				<Chip label={label} />
			</PillSkeleton>
		))}
	</div>
)

const ArchetypesSkeleton: FC = () => (
	<div className='product-info-header__archetypes'>
		<Typography variant='body2' component='span' className='product-info-header__archetypes-label'>
			<Skeleton width='9ch' />
		</Typography>
		<ArchetypeChipsSkeleton />
	</div>
)

type ProductInformationHeaderProps = {
	product?: YGOProduct.Info
	archetypes: string[]
	isFetchingArchetypes: boolean
}

/*
 * white card: the cover beside the eyebrow (with the previous / next product of its kind), name, set code / release / card count
 * and the archetypes. under them one grey tile - counts split by hairlines, then a stacked bar each for the rarities and card types
 */
const ProductInformationHeader: FC<ProductInformationHeaderProps> = ({ product, archetypes, isFetchingArchetypes }) => {
	const { previous, next } = useNeighbours(product)
	const [showAllArchetypes, setShowAllArchetypes] = useState(false)

	const cards = useMemo(() => product?.productContent.map((item) => item.card) ?? [], [product])

	const kinds = useMemo(() => cards.reduce((totals, card) => ({ ...totals, [cardKind(card)]: totals[cardKind(card)] + 1 }), { Monster: 0, Spell: 0, Trap: 0 }), [cards])

	const rarities = useMemo(
		() =>
			Object.entries(product?.productRarityStats ?? {})
				.sort(([a], [b]) => byRarity(a, b))
				.map(([rarity, count], tier) => ({ rarity, count, tier: Math.min(tier, 5) })),
		[product]
	)

	const cardTypes = useMemo(() => {
		const byColor = cards.reduce((totals, card) => totals.set(card.cardColor as string, (totals.get(card.cardColor as string) ?? 0) + 1), new Map<string, number>())
		return Array.from(byColor.entries()).sort(([, a], [, b]) => b - a)
	}, [cards])

	if (!product) {
		return (
			<header className='product-info-header' aria-busy='true' data-testid='product-info-header-skeleton'>
				<div className='product-info-header__top'>
					<Skeleton variant='rounded' className='product-info-header__cover product-info-header__cover--skeleton' />
					<div className='product-info-header__text'>
						<div className='product-info-header__eyebrow-row'>
							<Typography variant='subtitle2' component='span' className='product-info-header__eyebrow'>
								<Skeleton width='14ch' />
							</Typography>
							<PillSkeleton>
								<Button className='product-info-header__neighbour' startIcon={<ChevronLeftRoundedIcon />}>
									RA05
								</Button>
							</PillSkeleton>
						</div>
						<Typography variant='h1' component='span' className='product-info-header__name'>
							<Skeleton width='12ch' />
						</Typography>
						<div className='product-info-header__chips'>
							<PillSkeleton>
								<Chip label='Set MAMO' />
							</PillSkeleton>
							<PillSkeleton>
								<Chip label='Released Sep 4, 2026' />
							</PillSkeleton>
						</div>
						<ArchetypesSkeleton />
					</div>
				</div>

				{/* the grey tile with its counts and both spreads, so it wraps like the loaded one at each width */}
				<div className='product-info-header__stats'>
					<ul className='product-info-header__totals'>
						{Array.from({ length: 5 }, (_, index) => (
							<li key={index}>
								<Typography variant='h4' component='span' className='product-info-header__total-count'>
									<Skeleton width='2ch' />
								</Typography>
								<Typography variant='body2' component='span'>
									<Skeleton width='7ch' />
								</Typography>
							</li>
						))}
					</ul>
					<div className='product-info-header__spreads'>
						{[5, 8].map((items) => (
							<div key={items} className='product-info-header__spread'>
								<Typography variant='subtitle1' component='span' className='product-info-header__spread-heading'>
									<Skeleton width='8ch' />
								</Typography>
								<Skeleton variant='rounded' className='product-info-header__bar product-info-header__bar--skeleton' />
								<ul className='product-info-header__legend'>
									{Array.from({ length: items }, (_, index) => (
										<li key={index}>
											<Typography variant='body2' component='span'>
												<Skeleton width='14ch' />
											</Typography>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</header>
		)
	}

	const releaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)
	const shownArchetypes = showAllArchetypes ? archetypes : archetypes.slice(0, ARCHETYPES_SHOWN)
	const totalRarities = rarities.reduce((sum, { count }) => sum + count, 0)

	const totals = [
		{ label: 'cards', count: cards.length },
		{ label: 'monsters', count: kinds.Monster },
		{ label: 'spells', count: kinds.Spell },
		{ label: 'traps', count: kinds.Trap },
	]

	return (
		<header className='product-info-header'>
			<div className='product-info-header__top'>
				<ProductImage className='product-info-header__cover' productID={product.productId} size='md' loading='eager' />

				<div className='product-info-header__text'>
					<div className='product-info-header__eyebrow-row'>
						<Typography variant='subtitle2' component='p' className='product-info-header__eyebrow'>
							{product.productSubType} · {product.productType}
						</Typography>
						{(previous || next) && (
							<nav className='product-info-header__neighbours' aria-label={`Other ${product.productSubType} releases`}>
								{previous && (
									<Button
										component={Link}
										to={`/product/${previous.productId}`}
										className='product-info-header__neighbour'
										startIcon={<ChevronLeftRoundedIcon />}
										aria-label={`Previous: ${previous.productName}`}
									>
										{previous.productId}
									</Button>
								)}
								{next && (
									<Button
										component={Link}
										to={`/product/${next.productId}`}
										className='product-info-header__neighbour'
										endIcon={<ChevronRightRoundedIcon />}
										aria-label={`Next: ${next.productName}`}
									>
										{next.productId}
									</Button>
								)}
							</nav>
						)}
					</div>

					<Typography variant='h1' className='product-info-header__name'>
						{product.productName}
					</Typography>

					<div className='product-info-header__chips'>
						<Chip
							label={
								<>
									<Typography variant='inherit' component='span' className='product-info-header__chip-label'>
										Set
									</Typography>{' '}
									{product.productId}
								</>
							}
						/>
						<Chip
							label={
								<>
									<Typography variant='inherit' component='span' className='product-info-header__chip-label'>
										Released
									</Typography>{' '}
									<time dateTime={product.productReleaseDate}>{Dates.getDateString(releaseDate)}</time>
								</>
							}
						/>
					</div>

					{(isFetchingArchetypes || archetypes.length > 0) && (
						<div className='product-info-header__archetypes'>
							<Typography variant='body2' component='h2' className='product-info-header__archetypes-label'>
								Archetypes
							</Typography>
							{isFetchingArchetypes ? (
								<ArchetypeChipsSkeleton />
							) : (
								<ul className='product-info-header__archetype-list'>
									{shownArchetypes.map((archetype) => (
										<li key={archetype}>
											<Chip label={archetype} />
										</li>
									))}
									{archetypes.length > ARCHETYPES_SHOWN && (
										<li>
											<Chip
												className='product-info-header__more'
												label={showAllArchetypes ? 'Show fewer' : `+${archetypes.length - ARCHETYPES_SHOWN} more`}
												aria-expanded={showAllArchetypes}
												onClick={() => setShowAllArchetypes((shown) => !shown)}
											/>
										</li>
									)}
								</ul>
							)}
						</div>
					)}
				</div>
			</div>

			<div className='product-info-header__stats'>
				<ul className='product-info-header__totals' aria-label='Totals'>
					{totals.map(({ label, count }) => (
						<li key={label}>
							<Typography variant='h4' component='span' className='product-info-header__total-count'>
								{count}
							</Typography>
							<Typography variant='body2' component='span' className='product-info-header__total-label'>
								{label}
							</Typography>
						</li>
					))}
					{!isFetchingArchetypes && archetypes.length > 0 && (
						<li>
							<Typography variant='h4' component='span' className='product-info-header__total-count'>
								{archetypes.length}
							</Typography>
							<Typography variant='body2' component='span' className='product-info-header__total-label'>
								archetypes
							</Typography>
						</li>
					)}
				</ul>

				<div className='product-info-header__spreads'>
					{rarities.length > 0 && (
						<section className='product-info-header__spread' aria-labelledby='product-info-rarities'>
							<Typography variant='subtitle1' component='h2' id='product-info-rarities' className='product-info-header__spread-heading'>
								Rarities
							</Typography>
							<div className='product-info-header__bar' aria-hidden='true'>
								{rarities.map(({ rarity, count, tier }) => (
									<span key={rarity} className={`product-info-header__segment product-rarity--tier-${tier}`} style={{ flexGrow: count / totalRarities }} />
								))}
							</div>
							<ul className='product-info-header__legend'>
								{rarities.map(({ rarity, count, tier }) => (
									<li key={rarity}>
										<span className={`product-info-header__dot product-rarity--tier-${tier}`} aria-hidden='true' />
										<Typography variant='body2' component='span'>
											{rarity}{' '}
											<Typography variant='inherit' component='span' className='product-info-header__legend-count'>
												{count}
											</Typography>
										</Typography>
									</li>
								))}
							</ul>
						</section>
					)}

					<section className='product-info-header__spread' aria-labelledby='product-info-card-types'>
						<Typography variant='subtitle1' component='h2' id='product-info-card-types' className='product-info-header__spread-heading'>
							Card types
						</Typography>
						{/* rcl's own frame colour classes, so the colours stay exactly rcl's */}
						<div className='product-info-header__bar' aria-hidden='true'>
							{cardTypes.map(([color, count]) => (
								<span key={color} className={`product-info-header__segment ${color.toLowerCase()}-ygo-card-style`} style={{ flexGrow: count / cards.length }} />
							))}
						</div>
						<ul className='product-info-header__legend'>
							{cardTypes.map(([color, count]) => (
								<li key={color}>
									<span className='product-info-header__frame' aria-hidden='true'>
										<YGOCardColorIndicator cardColor={color.toLowerCase() as YGOCard.Color} />
									</span>
									<Typography variant='body2' component='span'>
										{color.replace('-', ' ')}{' '}
										<Typography variant='inherit' component='span' className='product-info-header__legend-count'>
											{count}
										</Typography>
									</Typography>
								</li>
							))}
						</ul>
					</section>
				</div>
			</div>
		</header>
	)
}

export default ProductInformationHeader
