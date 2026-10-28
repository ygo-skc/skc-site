import { FC, useState } from 'react'
import { Button, Chip, Dialog, IconButton, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Link } from 'react-router-dom'
import { CardImageRounded } from 'skc-rcl'
import CardFrameRing from '../util/CardFrameRing'
import { BanStatus, banStatusClass, banStatusRule, cardTypeLabel, toBanStatus } from '../../helper/BanStatus'

export type BanListChangeColumn = {
	status: BanStatus
	cards: YGOBanList.PreviousBanListStatus[]
}

type BanListChangesProps = {
	isLoading: boolean
	columns: BanListChangeColumn[]
	previousDate?: string
}

const columnTitle: Record<BanStatus, string> = {
	Forbidden: 'Now Forbidden',
	Limited: 'Now Limited',
	'Semi-Limited': 'Now Semi-Limited',
	Unlimited: 'Back to Unlimited',
}

// a column shows this many rows; the rest open in a popup so one big change doesn't push the full list far down
const NUM_ROWS_COLLAPSED = 8

// tinted head with the column's title, count and rule - shared by the column and its popup
const ChangeHead: FC<{ column: BanListChangeColumn; titleId?: string; onClose?: () => void }> = ({ column, titleId, onClose }) => (
	<div className={`ban-list-changes__head ${banStatusClass(column.status)}`}>
		<div className='ban-list-changes__title'>
			<Typography variant='h6' component={onClose ? 'h2' : 'h3'} id={titleId}>
				{columnTitle[column.status]}
			</Typography>
			<Typography variant='h4' component='span'>
				{column.cards.length}
			</Typography>
			{onClose && (
				<IconButton className='ban-list-changes__close' aria-label='Close' onClick={onClose}>
					<CloseRoundedIcon />
				</IconButton>
			)}
		</div>
		<Typography variant='body2'>{banStatusRule[column.status]}</Typography>
	</div>
)

const ChangeRows: FC<{ cards: YGOBanList.PreviousBanListStatus[] }> = ({ cards }) => (
	<ul className='ban-list-changes__rows'>
		{cards.map(({ card, previousBanStatus }) => {
			const previous = toBanStatus(previousBanStatus)

			return (
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
						<span className='ban-list-changes__was'>
							<Typography variant='caption' component='span'>
								was
							</Typography>{' '}
							<Chip size='small' className={`ban-status-chip ${previous ? banStatusClass(previous) : ''}`} label={previous ?? previousBanStatus} />
						</span>
					</Link>
				</li>
			)
		})}
	</ul>
)

// three columns built from the same pieces as the loaded ones, so the page doesn't jump when they arrive
const ChangesSkeleton: FC = () => (
	<div className='ban-list-changes' data-testid='ban-list-changes-skeleton'>
		{[0, 1, 2].map((column) => (
			<div key={column} className='ban-list-changes__column'>
				<div className='ban-list-changes__head ban-list-changes__head--skeleton'>
					<div className='ban-list-changes__title'>
						<Typography variant='h6' component='span'>
							<Skeleton width='9ch' />
						</Typography>
						<Typography variant='h4' component='span'>
							<Skeleton width='2ch' />
						</Typography>
					</div>
					{/* phones wrap the rule onto a second line */}
					<Typography variant='body2'>
						<Skeleton width='90%' />
						<Skeleton width='40%' className='ban-list-phone-line' />
					</Typography>
				</div>
				<ul className='ban-list-changes__rows'>
					{Array.from({ length: NUM_ROWS_COLLAPSED }, (_, row) => (
						<li key={row}>
							<div className='ban-list-changes__row'>
								{/* the thumb in its frame ring */}
								<Skeleton className='ban-list-thumb' variant='circular' width='calc(var(--card-thumb) + 10px)' height='calc(var(--card-thumb) + 10px)' />
								<span className='ban-list-changes__name'>
									<Typography variant='subtitle2' component='span'>
										<Skeleton width='60%' />
									</Typography>
									<Typography variant='body2' component='span'>
										<Skeleton width='40%' />
									</Typography>
								</span>
								<span className='ban-list-changes__was'>
									<Typography variant='caption' component='span'>
										<Skeleton width='3ch' />
									</Typography>
									<Skeleton variant='rounded' width='5.5rem' height='1.5rem' className='ban-list-changes__chip-skeleton' />
								</span>
							</div>
						</li>
					))}
				</ul>
				{/* where "Show all N" sits under a full column */}
				<div className='ban-list-changes__more-skeleton'>
					<Skeleton width='6rem' />
				</div>
			</div>
		))}
	</div>
)

// cards that moved to another status since the previous list, one column per new status
const BanListChanges: FC<BanListChangesProps> = ({ isLoading, columns, previousDate }) => {
	const filled = columns.filter((column) => column.cards.length !== 0)
	const numChanged = filled.reduce((total, column) => total + column.cards.length, 0)
	// the popup's column stays set while it fades out, so only the open flag changes on close
	const [popup, setPopup] = useState<{ status?: BanStatus; open: boolean }>({ open: false })
	const popupColumn = filled.find((column) => column.status === popup.status)
	const closePopup = () => setPopup((current) => ({ ...current, open: false }))
	const isPhone = useMediaQuery(useTheme().breakpoints.down('sm'))

	return (
		<section className='ban-list-block ban-list-block--sheet' aria-labelledby='ban-list-changes-heading'>
			<div className='ban-list-block__head'>
				<Typography variant='h2' id='ban-list-changes-heading'>
					What changed
				</Typography>
				{/* the count's line is held while loading - phones wrap it under the heading, so it would push the columns down on arrival */}
				{isLoading ? (
					<Typography variant='body2' className='ban-list-block__hint' data-testid='ban-list-changes-hint-skeleton'>
						<Skeleton width='16em' />
					</Typography>
				) : (
					previousDate && (
						<Typography variant='body2' className='ban-list-block__hint'>
							{numChanged} {numChanged === 1 ? 'card' : 'cards'} · compared to {previousDate}
						</Typography>
					)
				)}
			</div>

			{isLoading ? (
				<ChangesSkeleton />
			) : filled.length === 0 ? (
				<Typography variant='body1' className='ban-list-block__hint'>
					{previousDate ? 'No cards changed status on this list.' : 'This is the first list in the database - nothing to compare it to.'}
				</Typography>
			) : (
				<div className='ban-list-changes'>
					{filled.map((column) => (
						<section key={column.status} className={`ban-list-changes__column ${banStatusClass(column.status)}`} aria-label={columnTitle[column.status]}>
							<ChangeHead column={column} />
							<ChangeRows cards={column.cards.slice(0, NUM_ROWS_COLLAPSED)} />

							{column.cards.length > NUM_ROWS_COLLAPSED && (
								<Button className='ban-list-changes__more' fullWidth aria-haspopup='dialog' onClick={() => setPopup({ status: column.status, open: true })}>
									Show all {column.cards.length}
								</Button>
							)}
						</section>
					))}
				</div>
			)}

			<Dialog
				open={popup.open && popupColumn !== undefined}
				onClose={closePopup}
				fullScreen={isPhone}
				aria-labelledby='ban-list-changes-dialog-title'
				slotProps={{ paper: { className: 'ban-list-changes-dialog' } }}
			>
				{popupColumn && (
					<>
						<ChangeHead column={popupColumn} titleId='ban-list-changes-dialog-title' onClose={closePopup} />
						<div className='ban-list-changes-dialog__body'>
							<ChangeRows cards={popupColumn.cards} />
						</div>
					</>
				)}
			</Dialog>
		</section>
	)
}

export default BanListChanges
