import { CSSProperties, FC, ReactNode, useId } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton, Typography } from '@mui/material'
import { YGOCardColorIndicator } from 'skc-rcl'

import CardFrameRing from '../util/CardFrameRing'
import { ArchetypeStats, Tally, archetypeStats, attackOf, defenseOf } from './archetypeStats'

const share = (count: number, of: number) => ({ '--share': `${of === 0 ? 0 : (count / of) * 100}%` } as CSSProperties)

const frameLabel = (color: string) => color.replace('-', ' ')

// a white sheet with its title, and a note (e.g. how many monsters it counts) at the end of the title's row
const StatSheet: FC<{ title: string; note?: ReactNode; className?: string; children: ReactNode }> = ({ title, note, className, children }) => {
	const headingId = useId()

	return (
		<section className={`archetype-sheet${className ? ` ${className}` : ''}`} aria-labelledby={headingId}>
			<div className='archetype-sheet__head'>
				<Typography variant='h5' component='h2' id={headingId} className='archetype-sheet__title'>
					{title}
				</Typography>
				{note && (
					<Typography variant='body2' component='span' className='archetype-sheet__note'>
						{note}
					</Typography>
				)}
			</div>
			{children}
		</section>
	)
}

// one stacked bar in rcl's frame colours (its own classes, so the colours stay rcl's), then the types with their counts and share
const CardTypes: FC<{ stats: ArchetypeStats }> = ({ stats }) => (
	<StatSheet title='Card type'>
		<div className='archetype-frame-bar' aria-hidden='true'>
			{stats.cardTypes.map(({ name, count }) => (
				<span key={name} className={`archetype-frame-bar__segment ${name.toLowerCase()}-ygo-card-style`} style={{ flexGrow: count }} />
			))}
		</div>
		<ul className='archetype-frame-legend'>
			{stats.cardTypes.map(({ name, count }) => (
				<li key={name}>
					<span className='archetype-frame-legend__dot' aria-hidden='true'>
						<YGOCardColorIndicator cardColor={name.toLowerCase() as YGOCard.Color} />
					</span>
					<Typography variant='body2' component='span' className='archetype-frame-legend__name'>
						{frameLabel(name)}
					</Typography>
					<Typography variant='subtitle2' component='span'>
						{count}
					</Typography>
					<Typography variant='body2' component='span' className='archetype-frame-legend__share'>
						{Math.round((count / stats.cards) * 100)}%
					</Typography>
				</li>
			))}
		</ul>
	</StatSheet>
)

// main deck, extra deck and spells / traps as grey tiles, each with its frames under the count
const Decks: FC<{ stats: ArchetypeStats }> = ({ stats }) => (
	<StatSheet title='Where they sit'>
		<ul className='archetype-decks'>
			{stats.decks.map(({ deck, count, frames }) => (
				<li key={deck} className='archetype-decks__tile'>
					<Typography variant='h3' component='span' className='archetype-decks__count'>
						{count}
					</Typography>
					<Typography variant='subtitle2' component='span' className='archetype-decks__deck'>
						{deck}
					</Typography>
					<Typography variant='body2' component='span' className='archetype-decks__frames'>
						{frames.length > 0 ? frames.map(({ name, count }) => `${count} ${frameLabel(name)}`).join(' · ') : 'None'}
					</Typography>
				</li>
			))}
		</ul>
	</StatSheet>
)

// a bar per value, as long as its share of the most common one - which is the purple one
const Bars: FC<{ title: string; note: string; tallies: Tally[] }> = ({ title, note, tallies }) => (
	<StatSheet title={title} note={note}>
		<ul className='archetype-bars'>
			{tallies.map(({ name, count }, index) => (
				<li key={name} className={index === 0 ? 'archetype-bars__row archetype-bars__row--top' : 'archetype-bars__row'}>
					<Typography variant='body2' component='span' className='archetype-bars__name'>
						{name}
					</Typography>
					<span className='archetype-bars__track' aria-hidden='true'>
						<span className='archetype-bars__fill' style={share(count, tallies[0].count)} />
					</span>
					<Typography variant='subtitle2' component='span' className='archetype-bars__count'>
						{count}
					</Typography>
				</li>
			))}
		</ul>
	</StatSheet>
)

// how many monsters fall in each ATK range - a column per range, the fullest one purple. a narrow sheet lays them out as rows (container query)
const AttackSpread: FC<{ stats: ArchetypeStats }> = ({ stats }) => {
	const most = Math.max(...stats.attackSpread.map((bucket) => bucket.count))

	return (
		<StatSheet title='Monsters by ATK' note={`Monsters in each ATK range · ${stats.withAttack} with a set ATK`} className='archetype-spread'>
			<ol className='archetype-spread__columns'>
				{stats.attackSpread.map(({ label, count }) => (
					<li key={label} className={count === most && most > 0 ? 'archetype-spread__column archetype-spread__column--top' : 'archetype-spread__column'}>
						<Typography variant='body2' component='span' className='archetype-spread__label'>
							<span className='visually-hidden'>ATK </span>
							{label}
						</Typography>
						<span className='archetype-spread__bar' aria-hidden='true' style={share(count, most)} />
						<Typography variant='subtitle2' component='span' className='archetype-spread__count'>
							{count}
							<span className='visually-hidden'> {count === 1 ? 'monster' : 'monsters'}</span>
						</Typography>
					</li>
				))}
			</ol>
		</StatSheet>
	)
}

// five rows linking to their card pages - round art in its frame ring, name, frame · attribute, then the stat
const Top: FC<{ title: string; cards: YGOCard.Deets[]; value: (card: YGOCard.Deets) => number | undefined; unit: string }> = ({ title, cards, value, unit }) => (
	<StatSheet title={title} className='archetype-top'>
		<ol className='archetype-top__rows'>
			{cards.map((card) => (
				<li key={card.cardID}>
					<Link to={`/card/${card.cardID}`} className='archetype-top__row'>
						<CardFrameRing cardColor={card.cardColor}>
							<img className='archetype-top__thumb' src={`https://images.thesupremekingscastle.com/cards/tn/${card.cardID}.jpg`} alt='' loading='lazy' />
						</CardFrameRing>
						<span className='archetype-top__text'>
							<Typography variant='subtitle2' component='span' className='archetype-top__name'>
								{card.cardName}
							</Typography>
							<Typography variant='body2' component='span' className='archetype-top__meta'>
								{[frameLabel(card.cardColor as string), card.cardAttribute].filter(Boolean).join(' · ')}
							</Typography>
						</span>
						<Typography variant='h6' component='span' className='archetype-top__value'>
							{value(card)?.toLocaleString()}
							<span className='visually-hidden'> {unit}</span>
						</Typography>
					</Link>
				</li>
			))}
		</ol>
	</StatSheet>
)

// the loading sheets are the loaded ones' markup with skeletons in place of the numbers and names, so they hold the same height.
// a typical archetype's six attributes / monster types, and the fixed ATK ranges
const SKELETON_BARS = 6
const SKELETON_TOP = 5
const ATTACK_RANGES = archetypeStats([]).attackSpread.map(({ label }) => label)
// a made-up spread, so the skeleton columns read as a chart
const SKELETON_SPREAD = [2, 4, 6, 8, 7, 10, 3, 1]

const BarsSkeleton: FC<{ title: string }> = ({ title }) => (
	<StatSheet title={title} note={<Skeleton width='10ch' />}>
		<ul className='archetype-bars'>
			{Array.from({ length: SKELETON_BARS }, (_, index) => (
				<li key={index} className='archetype-bars__row'>
					<Typography variant='body2' component='span'>
						<Skeleton width='6ch' />
					</Typography>
					<span className='archetype-bars__track' />
					<Typography variant='subtitle2' component='span'>
						<Skeleton width='2ch' />
					</Typography>
				</li>
			))}
		</ul>
	</StatSheet>
)

const TopSkeleton: FC<{ title: string }> = ({ title }) => (
	<StatSheet title={title} className='archetype-top'>
		<ol className='archetype-top__rows'>
			{Array.from({ length: SKELETON_TOP }, (_, index) => (
				<li key={index}>
					<div className='archetype-top__row'>
						{/* the thumb in its frame ring */}
						<Skeleton variant='circular' width='calc(var(--card-thumb) + 10px)' height='calc(var(--card-thumb) + 10px)' className='archetype-top__thumb-skeleton' />
						<span className='archetype-top__text'>
							<Typography variant='subtitle2' component='span'>
								<Skeleton width='60%' />
							</Typography>
							<Typography variant='body2' component='span'>
								<Skeleton width='35%' />
							</Typography>
						</span>
						<Typography variant='h6' component='span'>
							<Skeleton width='5ch' />
						</Typography>
					</div>
				</li>
			))}
		</ol>
	</StatSheet>
)

const StatSheetsSkeleton: FC = () => (
	<div className='archetype-stats' aria-hidden='true' data-testid='archetype-stats-skeleton'>
		<div className='archetype-stats__grid'>
			<StatSheet title='Card type'>
				<Skeleton variant='rounded' className='archetype-frame-bar archetype-frame-bar--skeleton' />
				<ul className='archetype-frame-legend'>
					{Array.from({ length: SKELETON_BARS }, (_, index) => (
						<li key={index}>
							<Typography variant='body2' component='span' className='archetype-frame-legend__name'>
								<Skeleton width='70%' />
							</Typography>
						</li>
					))}
				</ul>
			</StatSheet>
			<StatSheet title='Where they sit'>
				<ul className='archetype-decks'>
					{['Main Deck', 'Extra Deck', 'Spells & Traps'].map((deck) => (
						<li key={deck} className='archetype-decks__tile'>
							<Typography variant='h3' component='span' className='archetype-decks__count'>
								<Skeleton width='2ch' />
							</Typography>
							<Typography variant='subtitle2' component='span' className='archetype-decks__deck'>
								{deck}
							</Typography>
							<Typography variant='body2' component='span' className='archetype-decks__frames'>
								<Skeleton width='12ch' />
							</Typography>
						</li>
					))}
				</ul>
			</StatSheet>
			<BarsSkeleton title='Attribute' />
			<BarsSkeleton title='Monster type' />
		</div>

		<StatSheet
			title='Monsters by ATK'
			note={
				// the real wording around the number, so it wraps like the loaded note on phones
				<>
					Monsters in each ATK range · <Skeleton variant='text' width='3ch' className='archetype-sheet__note-skeleton' /> with a set ATK
				</>
			}
			className='archetype-spread'
		>
			<ol className='archetype-spread__columns'>
				{ATTACK_RANGES.map((label, index) => (
					<li key={label} className='archetype-spread__column'>
						<Typography variant='body2' component='span' className='archetype-spread__label'>
							{label}
						</Typography>
						<span className='archetype-spread__bar archetype-spread__bar--skeleton' style={share(SKELETON_SPREAD[index], 10)} />
						<Typography variant='subtitle2' component='span' className='archetype-spread__count'>
							<Skeleton width='2ch' />
						</Typography>
					</li>
				))}
			</ol>
		</StatSheet>

		<div className='archetype-stats__grid'>
			<TopSkeleton title='Highest ATK' />
			<TopSkeleton title='Highest DEF' />
		</div>
	</div>
)

/*
 * the archetype at a glance (H on the "Archetype page mockups" canvas): card types, where the cards sit in a deck, attributes and
 * monster types, monsters by ATK range, and the five highest ATK / DEF. sheets with nothing to count (no monsters) are left out
 */
const ArchetypeStatSheets: FC<{ stats?: ArchetypeStats }> = ({ stats }) => {
	if (!stats) return <StatSheetsSkeleton />

	const monsterNote = `${stats.monsters} ${stats.monsters === 1 ? 'monster' : 'monsters'}`

	return (
		<div className='archetype-stats'>
			<div className='archetype-stats__grid'>
				<CardTypes stats={stats} />
				<Decks stats={stats} />
				{stats.attributes.length > 0 && <Bars title='Attribute' note={monsterNote} tallies={stats.attributes} />}
				{stats.monsterTypes.length > 0 && <Bars title='Monster type' note={monsterNote} tallies={stats.monsterTypes} />}
			</div>

			{stats.withAttack > 0 && <AttackSpread stats={stats} />}

			{stats.highestAttack.length > 0 && (
				<div className='archetype-stats__grid'>
					<Top title='Highest ATK' cards={stats.highestAttack} value={attackOf} unit='ATK' />
					{stats.highestDefense.length > 0 && <Top title='Highest DEF' cards={stats.highestDefense} value={defenseOf} unit='DEF' />}
				</div>
			)}
		</div>
	)
}

export default ArchetypeStatSheets
