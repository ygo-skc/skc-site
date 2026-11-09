import '../../../css/card/card-releases.css'

import { CSSProperties, FC, KeyboardEvent, useCallback, useId, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonBase, Chip, Skeleton, Typography } from '@mui/material'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { ProductImage } from 'skc-rcl'

import * as Dates from '../../../helper/Dates'
import { useHistoryEntryState } from '../../util/useHistoryEntry'
import { cardReleases, plural } from './cardGlance'

// rows shown before "Show all"
const SHOWN = 8

// a tick every 1, 2, 5 or 10 years, whichever keeps the rail to about six
const yearStep = (years: number) => [1, 2, 5, 10].find((step) => years / step <= 6) ?? 20

// left, centred or right on its dot, so the labels at either end stay on the rail
const labelShift = (at: number) => (at < 8 ? '0%' : at > 92 ? '-100%' : '-50%')

const at = (percent: number, extra: Record<string, string> = {}) => ({ '--at': `${percent}%`, ...extra } as CSSProperties)

// the empty rail and seven rows - between a card in a few products and one in eight or more (with Show all) - held while the card
// loads so the page below moves little when it arrives
const ReleasesSkeleton: FC = () => (
	<div aria-hidden='true' data-testid='card-releases-skeleton'>
		<div className='card-releases__rail'>
			<span className='card-releases__line' />
		</div>
		<ul className='card-releases__list'>
			{Array.from({ length: 7 }, (_, index) => (
				<li key={index}>
					<span className='card-releases__row'>
						<Skeleton variant='rounded' className='card-releases__thumb' />
						<span className='card-releases__text'>
							<Typography variant='subtitle1' component='span'>
								<Skeleton width='14ch' />
							</Typography>
							<Typography variant='body2' component='span'>
								<Skeleton width='20ch' />
							</Typography>
						</span>
						{/* a rarity chip, which drops under the name on phones like the loaded rows' */}
						<span className='card-releases__end'>
							<Skeleton variant='rounded' className='card-releases__chip-skeleton'>
								<Chip label='Ultra Rare' />
							</Skeleton>
						</span>
					</span>
				</li>
			))}
		</ul>
	</div>
)

type CardReleasesProps = {
	productInfo: YGOProduct.Info[]
	isFetchingCardData: boolean
}

/*
 * white sheet: the products the card is in on a to-scale rail from its first year to today (a dot each, like the home page's
 * upcoming products), then a row each - cover, name, set numbers, rarities, date - linking to the product. a dot picks its row
 */
const CardReleases: FC<CardReleasesProps> = ({ productInfo, isFetchingCardData }) => {
	const releases = useMemo(() => cardReleases(productInfo), [productInfo])
	// kept for coming back from a product page
	const [pickedId, setPickedId] = useHistoryEntryState<string | undefined>('card-releases-picked', undefined)
	const [showAll, setShowAll] = useHistoryEntryState('card-releases-show-all', false)
	const rowIdPrefix = useId()

	const picked = releases.find((release) => release.productId === pickedId) ?? releases[0]
	const shown = showAll ? releases : releases.slice(0, SHOWN)
	const printings = releases.reduce((total, release) => total + release.setNumbers.length, 0)

	const rail = useMemo(() => {
		if (releases.length === 0) return undefined
		const today = new Date()
		const firstYear = Dates.fromYYYYMMDDToDate(releases[releases.length - 1].date).getFullYear()
		const start = new Date(firstYear, 0, 1).getTime()
		const latest = Math.max(today.getTime(), Dates.fromYYYYMMDDToDate(releases[0].date).getTime())
		// a little room past the last dot so it isn't cut in half by the sheet's edge
		const end = latest + (latest - start) * 0.02
		const percent = (time: number) => ((time - start) / (end - start)) * 100

		const lastYear = new Date(latest).getFullYear()
		const step = yearStep(lastYear - firstYear)
		const years = Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index).filter((year) => (year - firstYear) % step === 0)

		return {
			years: years.map((year) => ({ year, at: percent(new Date(year, 0, 1).getTime()) })),
			today: percent(today.getTime()),
			dots: releases.map((release) => ({ release, at: percent(Dates.fromYYYYMMDDToDate(release.date).getTime()) })),
			yearsInPrint: today.getFullYear() - firstYear,
		}
	}, [releases])

	const pick = useCallback(
		(productId: string) => {
			setPickedId(productId)
			if (releases.findIndex((release) => release.productId === productId) >= SHOWN) setShowAll(true)
		},
		[releases, setPickedId, setShowAll]
	)

	// a click brings the picked row into view once it's drawn (it may have just been shown) - arrowing along the rail doesn't, so the rail stays put
	const pickAndShow = useCallback(
		(productId: string) => {
			pick(productId)
			const behavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
			requestAnimationFrame(() => document.getElementById(`${rowIdPrefix}${productId}`)?.scrollIntoView({ block: 'nearest', behavior }))
		},
		[pick, rowIdPrefix]
	)

	// the rail is one tab stop (the picked dot) - arrows step to older / newer releases, Home / End to the oldest / newest
	const handleRailKeys = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const index = releases.findIndex((release) => release === picked)
			// releases are newest first, the rail runs oldest to newest
			const next = { ArrowLeft: index + 1, ArrowDown: index + 1, ArrowRight: index - 1, ArrowUp: index - 1, Home: releases.length - 1, End: 0 }[event.key]
			if (next === undefined) return
			event.preventDefault()
			const target = releases[Math.min(Math.max(next, 0), releases.length - 1)]
			pick(target.productId)
			document.getElementById(`${rowIdPrefix}dot-${target.productId}`)?.focus()
		},
		[releases, picked, pick, rowIdPrefix]
	)

	// the oldest, the newest and the picked release get their set code over the rail - the picked one on the lower row
	const labelled = rail && [...new Set([rail.dots[rail.dots.length - 1], rail.dots[0], rail.dots.find(({ release }) => release === picked)])]

	return (
		<section className='card-releases' aria-labelledby='card-releases-title'>
			<div className='card-releases__head'>
				<Typography variant='h4' component='h2' id='card-releases-title'>
					Releases
				</Typography>
				{isFetchingCardData && (
					<Typography variant='body2' component='p' aria-hidden='true'>
						<Skeleton width='26ch' />
					</Typography>
				)}
				{!isFetchingCardData && releases.length !== 0 && rail && (
					<Typography variant='body2' component='p' className='card-releases__muted'>
						{rail.yearsInPrint > 0 && `${plural(rail.yearsInPrint, 'year')} in print · `}
						{plural(printings, 'printing')} in {plural(releases.length, 'product')}
					</Typography>
				)}
			</div>

			{isFetchingCardData && <ReleasesSkeleton />}

			{!isFetchingCardData && releases.length === 0 && (
				<Typography variant='body2' component='p' className='card-releases__empty'>
					Not in any product yet
				</Typography>
			)}

			{!isFetchingCardData && rail && labelled && (
				<>
					<div className='card-releases__rail'>
						<span className='card-releases__line' aria-hidden='true' />
						<span className='card-releases__today' style={at(rail.today)} aria-hidden='true' />
						{rail.years.map(({ year, at: yearAt }) => (
							<Typography key={year} variant='body2' component='span' className='card-releases__year' style={at(yearAt)} aria-hidden='true'>
								{year}
							</Typography>
						))}
						{labelled.map(
							(dot) =>
								dot && (
									<Typography
										key={dot.release.productId}
										variant='body2'
										component='span'
										className={`card-releases__label${dot.release === picked ? ' card-releases__label--picked' : ''}`}
										style={at(dot.at, { '--shift': labelShift(dot.at) })}
										aria-hidden='true'
									>
										{dot.release.productId}
									</Typography>
								)
						)}
						<div role='group' aria-label='Releases by date' onKeyDown={handleRailKeys}>
							{rail.dots.map(({ release, at: dotAt }) => (
								<ButtonBase
									key={release.productId}
									id={`${rowIdPrefix}dot-${release.productId}`}
									tabIndex={release === picked ? 0 : -1}
									className='card-releases__dot'
									style={at(dotAt)}
									aria-label={`${release.productName}, ${Dates.fromYYYYMMDDToDateStr(release.date)}`}
									aria-pressed={release === picked}
									onClick={() => pickAndShow(release.productId)}
								/>
							))}
						</div>
					</div>

					<ol className='card-releases__list'>
						{shown.map((release) => (
							<li key={release.productId} id={`${rowIdPrefix}${release.productId}`}>
								<Link to={`/product/${release.productId}`} className={`card-releases__row${release === picked ? ' card-releases__row--picked' : ''}`}>
									<span className='card-releases__thumb'>
										<ProductImage productID={release.productId} size='tn' loading='lazy' />
									</span>
									<span className='card-releases__text'>
										<Typography variant='subtitle1' component='span' className='card-releases__name'>
											{release.productName}
										</Typography>
										<Typography variant='body2' component='span' className='card-releases__muted'>
											{release.setNumbers.join(', ')} · {release.productType} · {release.productSubType}
										</Typography>
									</span>
									<span className='card-releases__end'>
										<span className='card-releases__rarities'>
											{release.rarities.map((rarity) => (
												<Chip key={rarity} label={rarity} />
											))}
										</span>
										<Typography variant='body2' component='time' dateTime={release.date} className='card-releases__muted'>
											{Dates.fromYYYYMMDDToDateStr(release.date)}
										</Typography>
									</span>
									<ChevronRightRoundedIcon className='card-releases__chevron' aria-hidden='true' />
								</Link>
							</li>
						))}
					</ol>

					{releases.length > SHOWN && !showAll && (
						<div className='card-releases__foot'>
							<Button className='capsule-button card-releases__more' onClick={() => setShowAll(true)}>
								Show all {releases.length}
							</Button>
						</div>
					)}
				</>
			)}
		</section>
	)
}

export default CardReleases
