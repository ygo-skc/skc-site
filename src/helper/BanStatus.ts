type BanStatus = 'Forbidden' | 'Limited' | 'Semi-Limited' | 'Unlimited'

// strongest first - the order columns, filters and the default sort use
const banStatuses: BanStatus[] = ['Forbidden', 'Limited', 'Semi-Limited', 'Unlimited']

const banStatusRule: Record<BanStatus, string> = {
	Forbidden: "Can't be used in the Main, Extra or Side Deck",
	Limited: 'Max 1 copy across the Main, Extra and Side Deck',
	'Semi-Limited': 'Max 2 copies across the Main, Extra and Side Deck',
	Unlimited: 'No longer on the list',
}

// the API spells statuses a few ways ("Semi-Limited", "Semi Limited", "semiLimited") - match on letters only
function toBanStatus(status: string): BanStatus | undefined {
	const letters = status.toLowerCase().replace(/[^a-z]/g, '')
	return banStatuses.find((s) => s.toLowerCase().replace(/[^a-z]/g, '') === letters)
}

// css modifier for the status tints in ban-list.css
function banStatusClass(status: BanStatus): string {
	return `ban-status--${status.toLowerCase()}`
}

type CardKind = 'Monster' | 'Spell' | 'Trap'

function cardKind(card: YGOCard.Deets): CardKind {
	const color = card.cardColor?.toLowerCase()
	if (color === 'spell') return 'Spell'
	if (color === 'trap') return 'Trap'
	return 'Monster'
}

// "Spellcaster/Effect" for monsters, "Spell" / "Trap" otherwise
function cardTypeLabel(card: YGOCard.Deets): string {
	return card.monsterType ?? cardKind(card)
}

export { banStatuses, banStatusRule, toBanStatus, banStatusClass, cardKind, cardTypeLabel }
export type { BanStatus, CardKind }
