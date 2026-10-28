// rarest first - anything not listed sorts after these, by name
const rarityOrder = [
	'Quarter Century Secret Rare',
	'Starlight Rare',
	'Ghost Rare',
	"Collector's Rare",
	'Ultimate Rare',
	'Prismatic Secret Rare',
	'Platinum Secret Rare',
	'Secret Rare',
	'Ultra Rare',
	'Super Rare',
	'Rare',
	'Short Print',
	'Common',
]

const rarityRank = (rarity: string) => {
	const rank = rarityOrder.indexOf(rarity)
	return rank === -1 ? rarityOrder.length : rank
}

export const byRarity = (a: string, b: string) => rarityRank(a) - rarityRank(b) || a.localeCompare(b)

// the frame words in a monster type ("Dragon/Synchro/Tuner/Effect") - the card type filter covers them
const frameWords = new Set(['Effect', 'Normal', 'Fusion', 'Synchro', 'Xyz', 'Link', 'Ritual', 'Pendulum', 'Token'])

const monsterTypeParts = (card: YGOCard.Deets) => card.monsterType?.split('/') ?? []

const tiers = (card: YGOCard.Deets): YGOData.CardBrowseValues[] => {
	const association = card.monsterAssociation
	if (association?.level !== undefined) return [{ name: 'levels', value: `Level ${association.level}` }]
	if (association?.rank !== undefined) return [{ name: 'ranks', value: `Rank ${association.rank}` }]
	if (association?.linkRating !== undefined) return [{ name: 'linkRatings', value: `Link Rating ${association.linkRating}` }]
	return []
}

// everything an item in the set can be filtered by, in the same name / value shape as the card browse criteria
const itemValues = (item: YGOProduct.Content): YGOData.CardBrowseValues[] => {
	const { card } = item
	const [monsterType, ...rest] = monsterTypeParts(card)
	const isMonster = monsterType !== undefined

	return [
		...item.rarities.map((rarity) => ({ name: 'rarities', value: rarity })),
		{ name: 'cardColors', value: card.cardColor as string },
		...(isMonster && card.cardAttribute ? [{ name: 'attributes', value: card.cardAttribute }] : []),
		...(isMonster ? [{ name: 'monsterTypes', value: monsterType }] : []),
		...rest.filter((part) => !frameWords.has(part)).map((part) => ({ name: 'monsterSubTypes', value: part })),
		...tiers(card),
	]
}

const tierNumber = (value: string) => +value.replace(/\D+/g, '')

// the options the set's cards actually have, so no filter can match nothing - rarities rarest first, levels in number order
export const contentFilterOptions = (content: YGOProduct.Content[]): YGOData.CardBrowseValues[] => {
	const seen = new Map<string, YGOData.CardBrowseValues>()
	content.flatMap(itemValues).forEach((option) => seen.set(`${option.name}:${option.value}`, option))

	return Array.from(seen.values()).sort((a, b) => {
		if (a.name !== b.name) return a.name.localeCompare(b.name)
		if (a.name === 'rarities') return byRarity(a.value, b.value)
		if (a.name === 'levels' || a.name === 'ranks' || a.name === 'linkRatings') return tierNumber(a.value) - tierNumber(b.value)
		return a.value.localeCompare(b.value)
	})
}

// levels, ranks and link ratings share one pill, so a pick in any of them is one choice
const filterGroup = (name: string) => (name === 'levels' || name === 'ranks' || name === 'linkRatings' ? 'tier' : name)

// picks in the same group widen the match (Dark or Light), picks in different groups narrow it (Dark and Level 4)
export const matchesFilters = (item: YGOProduct.Content, picks: YGOData.CardBrowseValues[]) => {
	if (picks.length === 0) return true
	const values = itemValues(item)
	const groups = new Set(picks.map((pick) => filterGroup(pick.name)))

	return Array.from(groups).every((group) =>
		picks.some((pick) => filterGroup(pick.name) === group && values.some((value) => value.name === pick.name && value.value === pick.value))
	)
}

// the number printed on the card, e.g. PHNI-EN001
export const setNumber = (product: Pick<YGOProduct.Deets, 'productId' | 'productLocale'>, item: Pick<YGOProduct.Content, 'productPosition'>) =>
	`${product.productId}-${product.productLocale.toUpperCase()}${item.productPosition}`

export const matchesQuery = (item: YGOProduct.Content, number: string, query: string) => {
	const needle = query.trim().toLowerCase()
	if (needle === '') return true
	return [item.card.cardName, number, item.card.cardEffect].some((text) => text?.toLowerCase().includes(needle))
}

export type CardKind = 'Monster' | 'Spell' | 'Trap'

export const cardKind = (card: YGOCard.Deets): CardKind => {
	const color = card.cardColor?.toLowerCase()
	return color === 'spell' ? 'Spell' : color === 'trap' ? 'Trap' : 'Monster'
}
