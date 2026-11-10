import '../../../css/card/card-releases.css'

import { CSSProperties, FC, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Chip, Skeleton, Typography } from '@mui/material'
import { ProductImage } from 'skc-rcl'

import * as Dates from '../../../helper/Dates'
import { useHistoryEntryState } from '../../util/useHistoryEntry'
import { cardReleases, CardRelease, plural, releaseYears } from './cardGlance'

// rows shown before "Show all"
const SHOWN = 8

// "Feb 20" - the year is in the gutter
const monthDay = (date: string) => {
	const day = Dates.fromYYYYMMDDToDate(date)
	return `${Dates.getMonth(day)} ${Dates.getDay(day)}`
}

// three years and seven rows - between a card in a few products and one in eight or more (with Show all) - held while the card
// loads so the page below moves little when it arrives
const ReleasesSkeleton: FC = () => (
	<div className='card-releases__years' aria-hidden='true' data-testid='card-releases-skeleton'>
		{[2, 2, 3].map((rows, group) => (
			<div key={group} className='card-releases__year'>
				<div className='card-releases__gutter'>
					<Typography variant='h4' component='span'>
						<Skeleton width='4ch' />
					</Typography>
					<Typography variant='body2' component='span'>
						<Skeleton width='8ch' />
					</Typography>
				</div>
				<ul className='card-releases__list'>
					{Array.from({ length: rows }, (_, index) => (
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
								{/* a rarity chip, which drops under the name on narrow sheets like the loaded rows' */}
								<span className='card-releases__rarities'>
									<Skeleton variant='rounded' className='card-releases__chip-skeleton'>
										<Chip label='Ultra Rare' />
									</Skeleton>
								</span>
							</span>
						</li>
					))}
				</ul>
			</div>
		))}
	</div>
)

const ReleaseRow: FC<{ release: CardRelease }> = ({ release }) => (
	<li>
		<Link to={`/product/${release.productId}`} className='card-releases__row'>
			<span className='card-releases__thumb'>
				<ProductImage productID={release.productId} size='tn' loading='lazy' />
			</span>
			<span className='card-releases__text'>
				<Typography variant='subtitle1' component='span' className='card-releases__name'>
					{release.productName}
				</Typography>
				<Typography variant='body2' component='span' className='card-releases__muted'>
					{release.setNumbers.join(', ')} · <time dateTime={release.date}>{monthDay(release.date)}</time> · {release.productType} · {release.productSubType}
				</Typography>
			</span>
			<span className='card-releases__rarities'>
				{release.rarities.map((rarity) => (
					<Chip key={rarity} label={rarity} />
				))}
			</span>
		</Link>
	</li>
)

type CardReleasesProps = {
	productInfo: YGOProduct.Info[]
	isFetchingCardData: boolean
}

/*
 * white sheet: the products the card is in, newest first, under their year in a gutter - a long wait between printings opens a gap
 * (taller the longer it was) labelled with its years. each row - cover, name, set numbers · date · type, rarities - links to the product
 */
const CardReleases: FC<CardReleasesProps> = ({ productInfo, isFetchingCardData }) => {
	const releases = useMemo(() => cardReleases(productInfo), [productInfo])
	// kept for coming back from a product page
	const [showAll, setShowAll] = useHistoryEntryState('card-releases-show-all', false)

	const years = useMemo(() => releaseYears(showAll ? releases : releases.slice(0, SHOWN)), [releases, showAll])
	const printings = releases.reduce((total, release) => total + release.setNumbers.length, 0)
	const yearsInPrint = releases.length === 0 ? 0 : new Date().getFullYear() - Number(releases[releases.length - 1].date.slice(0, 4))

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
				{!isFetchingCardData && releases.length !== 0 && (
					<Typography variant='body2' component='p' className='card-releases__muted'>
						{yearsInPrint > 0 && `${plural(yearsInPrint, 'year')} in print · `}
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

			{!isFetchingCardData && releases.length !== 0 && (
				<>
					<div className='card-releases__years'>
						{years.map(({ year, releases: inYear, printings: yearPrintings, quietYears }) => (
							<div key={year} className='card-releases__year'>
								{quietYears !== undefined && (
									<div className='card-releases__gap' style={{ '--quiet-years': quietYears } as CSSProperties}>
										<Typography variant='body2' component='p' className='card-releases__muted card-releases__gutter'>
											{plural(quietYears, 'year')}
											<span className='visually-hidden'> without a printing</span>
										</Typography>
										<span className='card-releases__gap-line' aria-hidden='true' />
									</div>
								)}
								<div className='card-releases__gutter'>
									<Typography variant='h4' component='h3'>
										{year}
									</Typography>
									<Typography variant='body2' component='p' className='card-releases__muted'>
										{plural(yearPrintings, 'printing')}
									</Typography>
								</div>
								<ol className='card-releases__list'>
									{inYear.map((release) => (
										<ReleaseRow key={release.productId} release={release} />
									))}
								</ol>
							</div>
						))}
					</div>

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
