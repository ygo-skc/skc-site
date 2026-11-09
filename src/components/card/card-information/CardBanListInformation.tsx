import '../../../css/main-pages/ban-list.css'
import '../../../css/util/suggestions-sheet.css'
import '../../../css/card/card-ban-lists.css'

import { FC, ReactNode, useId, useState } from 'react'
import { Button, Chip, Dialog, Typography, useMediaQuery, useTheme } from '@mui/material'

import * as Dates from '../../../helper/Dates'
import { BanStatus, banStatusClass, toBanStatus } from '../../../helper/BanStatus'
import { ColumnHead } from '../../util/SuggestionsSheet'
import { FormatStanding, formatStanding, monthYear, statusLabel } from './cardGlance'

type CardBanListInformationProps = {
	restrictedIn: YGOCard.Restrictions
	// each format's list dates, newest first - undefined while loading, empty if they couldn't be fetched
	banListDates: { TCG?: string[]; MD?: string[] }
	cardName: string
}

type Format = 'TCG' | 'MD'

// Duel Links isn't shown on the card page
const FORMATS: { format: Format; name: string }[] = [
	{ format: 'TCG', name: 'TCG' },
	{ format: 'MD', name: 'Master Duel' },
]

// a column shows this many lists; the rest open in a popup, like the suggestions
const ROWS_SHOWN = 8

type FormatColumn = FormatStanding & { format: Format; name: string }

// a row's label and its status chip, in ban-list.css's tint for that status
const StatusRow: FC<{ label: ReactNode; status: BanStatus | string }> = ({ label, status }) => {
	const known = toBanStatus(status)
	return (
		<li>
			<div className='ban-list-changes__row'>
				<span className='ban-list-changes__name'>
					<Typography variant='subtitle2' component='span'>
						{label}
					</Typography>
				</span>
				<Chip className={`ban-status-chip ${known ? banStatusClass(known) : ''}`} label={known ?? status} />
			</div>
		</li>
	)
}

const dateLabel = (date: string) => <time dateTime={date}>{Dates.fromYYYYMMDDToDateStr(date)}</time>

// where the card stands now, when the format's dates say it's off the list again or was never on one, then its lists newest first
const ColumnRows: FC<{ column: FormatColumn; lists: YGOCard.RestrictionStatus[] }> = ({ column, lists }) => (
	<ul className='ban-list-changes__rows'>
		{column.latest === undefined && <StatusRow label={column.since ? `Not on a list since ${monthYear(column.since)}` : 'Not on a list'} status='Unlimited' />}
		{column.offSince && <StatusRow label={<>Since {dateLabel(column.offSince)}</>} status='Unlimited' />}
		{lists.map((list) => (
			<StatusRow key={list.banListDate} label={dateLabel(list.banListDate)} status={statusLabel(list)} />
		))}
	</ul>
)

/*
 * a white sheet like the suggestions: a column per format (TCG, Master Duel) - where the card stands now when it's off the list or
 * was never on one, then each list it was on newest first with its status, 8 then "Show all N" in a popup. a format it was never
 * listed in keeps its column, so the sheet has the same shape either way
 */
const CardBanListInformation: FC<CardBanListInformationProps> = ({ restrictedIn, banListDates, cardName }) => {
	const headingId = useId()
	const dialogTitleId = useId()
	const name = cardName || 'this card'

	const columns: FormatColumn[] = FORMATS.map(({ format, name: formatName }) => ({ format, name: formatName, ...formatStanding(restrictedIn[format], banListDates[format]) }))
	const isNeverListed = columns.every((column) => column.lists.length === 0)
	const head = (column: FormatColumn) => ({
		name: column.name,
		count: column.lists.length,
		rule: column.lists.length === 0 ? 'Up to 3 copies a deck' : `Lists ${name} was on, newest first`,
	})

	// the popup's column stays set while it fades out, so only the open flag changes on close
	const [popup, setPopup] = useState<{ format?: Format; open: boolean }>({ open: false })
	const popupColumn = columns.find((column) => column.format === popup.format)
	const closePopup = () => setPopup((current) => ({ ...current, open: false }))
	const isPhone = useMediaQuery(useTheme().breakpoints.down('sm'))

	return (
		<section className='suggestions-sheet' aria-labelledby={headingId}>
			<div className='suggestions-sheet__tools'>
				<Typography variant='h4' component='h2' id={headingId} className='suggestions-sheet__title'>
					Ban lists
				</Typography>
				<Typography variant='body2' className='suggestions-sheet__intro'>
					{isNeverListed ? 'Not on a TCG or Master Duel list' : `The TCG and Master Duel lists ${name} was on`}
				</Typography>
			</div>

			<div className='suggestions-sheet__body'>
				<div className='ban-list-changes'>
					{columns.map((column) => (
						<section key={column.format} className='ban-list-changes__column suggestions-sheet__column card-ban-lists__column' aria-label={column.name}>
							<ColumnHead {...head(column)} />
							<ColumnRows column={column} lists={column.lists.slice(0, ROWS_SHOWN)} />

							{column.lists.length > ROWS_SHOWN && (
								<Button className='ban-list-changes__more' fullWidth aria-haspopup='dialog' onClick={() => setPopup({ format: column.format, open: true })}>
									Show all {column.lists.length}
								</Button>
							)}
						</section>
					))}
				</div>
			</div>

			<Dialog
				open={popup.open && popupColumn !== undefined}
				onClose={closePopup}
				fullScreen={isPhone}
				aria-labelledby={dialogTitleId}
				slotProps={{ paper: { className: 'ban-list-changes-dialog suggestions-sheet__column card-ban-lists__column' } }}
			>
				{popupColumn && (
					<>
						<ColumnHead {...head(popupColumn)} titleId={dialogTitleId} onClose={closePopup} />
						<div className='ban-list-changes-dialog__body'>
							<ColumnRows column={popupColumn} lists={popupColumn.lists} />
						</div>
					</>
				)}
			</Dialog>
		</section>
	)
}

export default CardBanListInformation
