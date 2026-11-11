// the frames that live in the extra deck - pendulum fusion / synchro / xyz too, since they start there
const EXTRA_DECK = ['fusion', 'synchro', 'xyz', 'link']

export type Deck = 'Main Deck' | 'Extra Deck' | 'Spells & Traps'

const color = (card: YGOCard.Deets) => (card.cardColor as string).toLowerCase()

export const isMonster = (card: YGOCard.Deets) => card.monsterType !== undefined

export const deckOf = (card: YGOCard.Deets): Deck => {
	if (!isMonster(card)) return 'Spells & Traps'
	return EXTRA_DECK.some((frame) => color(card).includes(frame)) ? 'Extra Deck' : 'Main Deck'
}

// the API sends ATK / DEF as numbers, and leaves them out for "?" (and DEF for links)
const stat = (value: string | number | undefined) => (value === undefined || value === null || value === '' ? undefined : Number(value))
export const attackOf = (card: YGOCard.Deets) => stat(card.monsterAttack)
export const defenseOf = (card: YGOCard.Deets) => stat(card.monsterDefense)

export type Tally = { name: string; count: number }

// most first, then by name
const tally = (names: string[]): Tally[] =>
	Array.from(names.reduce((totals, name) => totals.set(name, (totals.get(name) ?? 0) + 1), new Map<string, number>()).entries())
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

export type DeckTally = { deck: Deck; count: number; frames: Tally[] }

export type Bucket = { label: string; count: number }

// ATK in ranges of 500 (0–499, 500–999...), the last range open ended
const BUCKET_STEP = 500
const LAST_BUCKET = 3500

export type ArchetypeStats = {
	cards: number
	monsters: number
	spellsAndTraps: number
	cardTypes: Tally[]
	decks: DeckTally[]
	attributes: Tally[]
	monsterTypes: Tally[]
	attackSpread: Bucket[]
	withAttack: number
	highestAttack: YGOCard.Deets[]
	highestDefense: YGOCard.Deets[]
}

const TOP = 5

const highest = (monsters: YGOCard.Deets[], value: (card: YGOCard.Deets) => number | undefined) =>
	monsters
		.filter((card) => value(card) !== undefined)
		.sort((a, b) => (value(b) as number) - (value(a) as number) || a.cardName.localeCompare(b.cardName))
		.slice(0, TOP)

/*
 * everything the archetype page's sheets show, worked out from its members alone: totals, card types, where the cards sit in a deck,
 * attributes and monster types (most first), the ATK spread and the five highest ATK / DEF
 */
export const archetypeStats = (cards: YGOCard.Deets[]): ArchetypeStats => {
	const monsters = cards.filter(isMonster)
	const attacks = monsters.map(attackOf).filter((value): value is number => value !== undefined)

	const decks: DeckTally[] = (['Main Deck', 'Extra Deck', 'Spells & Traps'] as Deck[]).map((deck) => {
		const inDeck = cards.filter((card) => deckOf(card) === deck)
		return { deck, count: inDeck.length, frames: tally(inDeck.map((card) => card.cardColor as string)) }
	})

	const attackSpread = Array.from({ length: LAST_BUCKET / BUCKET_STEP + 1 }, (_, index) => {
		const from = index * BUCKET_STEP
		const isLast = from === LAST_BUCKET
		return {
			label: isLast ? `${from.toLocaleString()}+` : `${from.toLocaleString()}–${(from + BUCKET_STEP - 1).toLocaleString()}`,
			count: attacks.filter((attack) => attack >= from && (isLast || attack < from + BUCKET_STEP)).length,
		}
	})

	return {
		cards: cards.length,
		monsters: monsters.length,
		spellsAndTraps: cards.length - monsters.length,
		cardTypes: tally(cards.map((card) => card.cardColor as string)),
		decks,
		attributes: tally(monsters.flatMap((card) => (card.cardAttribute ? [card.cardAttribute] : []))),
		monsterTypes: tally(monsters.map((card) => (card.monsterType as string).split('/')[0])),
		attackSpread,
		withAttack: attacks.length,
		highestAttack: highest(monsters, attackOf),
		highestDefense: highest(monsters, defenseOf),
	}
}
