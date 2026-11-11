import '../../css/main-pages/ban-list.css'
import '../../css/util/suggestions-sheet.css'

import { FC, useId } from 'react'
import { Typography } from '@mui/material'

import { ColumnHead, SuggestionRows } from '../util/SuggestionsSheet'

/*
 * where a card's name and its archetype disagree, kept apart from the members list: cards that count without the name (qualified)
 * and cards with the name that don't count (excluded). the suggestions sheet's purple columns, an empty one left out - and the
 * whole sheet when both are
 */
const ArchetypeMembership: FC<{ archetype: string; qualified: YGOCard.Deets[]; excluded: YGOCard.Deets[] }> = ({ archetype, qualified, excluded }) => {
	const headingId = useId()
	const columns = [
		{ name: 'Also members', rule: `Not named ${archetype}, but count as ${archetype} cards`, cards: qualified },
		{ name: 'Not members', rule: `Named like ${archetype}, but don't count as ${archetype} cards`, cards: excluded },
	].filter((column) => column.cards.length > 0)

	if (columns.length === 0) return null

	return (
		<section className='suggestions-sheet' aria-labelledby={headingId}>
			<div className='suggestions-sheet__tools'>
				<Typography variant='h4' component='h2' id={headingId} className='suggestions-sheet__title'>
					Not by name
				</Typography>
				<Typography variant='body2' className='suggestions-sheet__intro'>
					Cards whose name doesn&rsquo;t say whether they&rsquo;re {archetype}
				</Typography>
			</div>

			<div className='suggestions-sheet__body'>
				<div className='ban-list-changes'>
					{columns.map((column) => (
						<section key={column.name} className='ban-list-changes__column suggestions-sheet__column' aria-label={column.name}>
							<ColumnHead name={column.name} count={column.cards.length} rule={column.rule} />
							<SuggestionRows references={column.cards.map((card) => ({ card, occurrences: 1 }))} />
						</section>
					))}
				</div>
			</div>
		</section>
	)
}

export default ArchetypeMembership
