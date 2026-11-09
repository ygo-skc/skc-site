import '../../../css/card/card-information-header.css'

import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Chip, Skeleton, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { CardImageRounded, YGOCard } from 'skc-rcl'
import { decodeHTML } from 'entities'

import * as Dates from '../../../helper/Dates'
import { cardEyebrow, cardGlance, FormatHistory, monthYear, plural, Printing, relativeDays, statusLabel } from './cardGlance'
import RarityChip from './RarityChip'

const COPIED_FEEDBACK_MS = 2000

const FORMAT_NAMES: Record<FormatHistory['format'], string> = { TCG: 'TCG', MD: 'Master Duel' }

type GlanceRowProps = { label: string; value: ReactNode; aside?: ReactNode }

// one row of a white grouped list - a muted label, the value, and an optional muted note at the end
const GlanceRow: FC<GlanceRowProps> = ({ label, value, aside }) => (
	<li className='card-info-header__row'>
		<Typography variant='body2' component='span' className='card-info-header__label'>
			{label}
		</Typography>
		<Typography variant='body2' component='span' className='card-info-header__value'>
			{value}
		</Typography>
		{aside !== undefined && (
			<Typography variant='body2' component='span' className='card-info-header__aside'>
				{aside}
			</Typography>
		)}
	</li>
)

// a format's row: where the card stands now when the format's list dates are in, else just its newest list
const banListRow = ({ lists, latest, current, offSince, since }: FormatHistory): Pick<GlanceRowProps, 'value' | 'aside'> => {
	const date = (day: string) => <time dateTime={day}>{Dates.fromYYYYMMDDToDateStr(day)}</time>
	if (latest === undefined) return { value: 'Unlimited', aside: since ? `not on a list since ${monthYear(since)}` : 'not on a list' }
	if (current) return { value: statusLabel(current), aside: `on the current list · ${plural(lists.length, 'list')}` }
	if (offSince)
		return {
			value: 'Unlimited',
			aside: (
				<>
					off the list since {date(offSince)} · {plural(lists.length, 'list')}
				</>
			),
		}
	return {
		value: (
			<>
				{statusLabel(latest)} on the {date(latest.banListDate)} list
			</>
		),
		aside: plural(lists.length, 'list'),
	}
}

const printingValue = ({ date, productName }: Printing) => (
	<>
		<time dateTime={date}>{Dates.fromYYYYMMDDToDateStr(date)}</time> · {productName}
	</>
)

const CopyPasscode: FC<{ cardID: string }> = ({ cardID }) => {
	const [isCopied, setIsCopied] = useState(false)

	useEffect(() => {
		if (!isCopied) return
		const timeout = setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
		return () => clearTimeout(timeout)
	}, [isCopied])

	const handleCopy = useCallback(() => {
		// no clipboard on plain http, and the browser can refuse the write - either way the button just does nothing
		navigator.clipboard
			?.writeText(cardID)
			.then(() => setIsCopied(true))
			.catch(() => {})
	}, [cardID])

	return (
		<>
			<Button className='capsule-button' startIcon={isCopied ? <CheckIcon /> : <ContentCopyIcon />} onClick={handleCopy}>
				Copy passcode
			</Button>
			<Typography variant='body2' component='span' role='status' className='visually-hidden'>
				{isCopied ? 'Passcode copied' : ''}
			</Typography>
		</>
	)
}

type CardInformationHeaderProps = {
	card: YGOCard.Deets
	isFetchingCardData: boolean
	productInfo: YGOProduct.Info[]
	restrictionInfo: YGOCard.Restrictions
	archetypes: Set<string>
	isFetchingArchetypes: boolean
	banListDates: { TCG?: string[]; MD?: string[] }
}

/*
 * white sheet: the card (rcl's art and YGOCard, unchanged) beside the eyebrow, name and archetypes,
 * then "At a glance" - the printing history and each format's ban lists as white grouped lists on a grey tile
 */
const CardInformationHeader: FC<CardInformationHeaderProps> = ({ card, isFetchingCardData, productInfo, restrictionInfo, archetypes, isFetchingArchetypes, banListDates }) => {
	const glance = useMemo(() => cardGlance(productInfo, restrictionInfo, banListDates), [productInfo, restrictionInfo, banListDates])

	return (
		<header className='card-info-header'>
			<div className='card-info-header__card'>
				<CardImageRounded size='lg' cardID={card.cardID} loading='eager' />
				{isFetchingCardData ? (
					// about a monster's YGOCard with a few lines of effect, so the header grows little when the card arrives
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />
				) : (
					<YGOCard
						cardName={card.cardName}
						cardColor={card.cardColor}
						cardEffect={decodeHTML(card.cardEffect)}
						cardAttribute={card.cardAttribute}
						monsterType={card.monsterType}
						monsterAttack={card.monsterAttack}
						monsterDefense={card.monsterDefense}
						monsterAssociation={card.monsterAssociation}
						cardID={card.cardID}
						fullDetails={true}
						isLoading={false}
					/>
				)}
			</div>

			<div className='card-info-header__text'>
				<div className='card-info-header__eyebrow-row'>
					<Typography variant='subtitle2' component='p' className='card-info-header__eyebrow'>
						{isFetchingCardData ? <Skeleton width='22ch' /> : cardEyebrow(card)}
					</Typography>
					<CopyPasscode cardID={card.cardID} />
				</div>

				<Typography variant='h1' className='card-info-header__name'>
					{isFetchingCardData ? <Skeleton width='12ch' /> : card.cardName}
				</Typography>

				<div className='card-info-header__archetypes'>
					<Typography variant='body2' component='h2' className='card-info-header__muted'>
						Archetypes
					</Typography>
					{isFetchingArchetypes && (
						<Skeleton variant='rounded' className='card-info-header__chip-skeleton'>
							<Chip label='Blue-Eyes White Dragon' />
						</Skeleton>
					)}
					{!isFetchingArchetypes && archetypes.size !== 0 && (
						<ul className='card-info-header__archetype-list'>
							{[...archetypes].map((archetype) => (
								<li key={archetype}>
									<Chip label={archetype} />
								</li>
							))}
						</ul>
					)}
					{!isFetchingArchetypes && archetypes.size === 0 && (
						<Typography variant='body2' component='p' className='card-info-header__muted'>
							Not tied to any archetype
						</Typography>
					)}
				</div>

				<div className='card-info-header__glance'>
					<Typography variant='subtitle1' component='h2' className='card-info-header__group-heading'>
						At a glance
					</Typography>
					{isFetchingCardData ? (
						// the rows the loaded card shows, so the header keeps its height when the card arrives
						<ul className='card-info-header__group' aria-hidden='true' data-testid='card-glance-skeleton'>
							{['Passcode', 'Printings', 'First printed', 'Last printed', 'Rarities'].map((label) => (
								<GlanceRow key={label} label={label} value={<Skeleton width='14ch' />} />
							))}
						</ul>
					) : (
						<ul className='card-info-header__group'>
							<GlanceRow label='Passcode' value={card.cardID} />
							<GlanceRow label='Printings' value={glance.printings === 0 ? 'Not printed yet' : `${glance.printings} in ${plural(glance.products, 'product')}`} />
							{glance.first && <GlanceRow label='First printed' value={printingValue(glance.first)} aside={relativeDays(glance.first.date)} />}
							{/* only when there's another product to compare with - two set numbers in one product would repeat the first row */}
							{glance.last && glance.products > 1 && (
								<GlanceRow
									label={Dates.isFutureDate(Dates.fromYYYYMMDDToDate(glance.last.date)) ? 'Upcoming printing' : 'Last printed'}
									value={printingValue(glance.last)}
									aside={relativeDays(glance.last.date)}
								/>
							)}
							{glance.rarities.length !== 0 && (
								<GlanceRow
									label={glance.rarities.length === 1 ? 'Rarity' : 'Rarities'}
									value={
										<span className='card-info-header__rarities'>
											{glance.rarities.map((rarity) => (
												<RarityChip key={rarity.rarity} {...rarity} />
											))}
										</span>
									}
								/>
							)}
						</ul>
					)}

					<Typography variant='subtitle1' component='h2' className='card-info-header__group-heading'>
						Ban lists
					</Typography>
					{isFetchingCardData ? (
						<ul className='card-info-header__group' aria-hidden='true'>
							{Object.values(FORMAT_NAMES).map((name) => (
								<GlanceRow key={name} label={name} value={<Skeleton width='10ch' />} />
							))}
						</ul>
					) : (
						<ul className='card-info-header__group'>
							{glance.banLists.map((history) => (
								<GlanceRow key={history.format} label={FORMAT_NAMES[history.format]} {...banListRow(history)} />
							))}
						</ul>
					)}
				</div>
			</div>
		</header>
	)
}

export default CardInformationHeader
