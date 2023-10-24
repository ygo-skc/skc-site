/// <reference types="react-scripts" />

declare type BrowseCriteria = {
	name: string
	value: string
}

declare type ProductInfo = {
	productId: string
	productLocale?: string
	productName?: string
	productType?: string
	productSubType?: string
	productReleaseDate: string
	productTotal?: number
	productContent: ProductContent[]
}

declare type ProductDetails = {
	productId: string
	productName: string
	productType: string
	productSubType: string
	productReleaseDate: string
	numUniqueCards: string
	isDataLoaded: boolean
}

declare type ProductStats = {
	productTotal: number
	productRarityStats: { [key: string]: number }
	cards: SKCCard[]
}

declare type cardColor =
	| 'normal'
	| 'effect'
	| 'ritual'
	| 'fusion'
	| 'synchro'
	| 'xyz'
	| 'pendulum-normal'
	| 'pendulum-effect'
	| 'pendulum-fusion'
	| 'pendulum-xyz'
	| 'pendulum-synchro'
	| 'token'
	| 'link'
	| 'spell'
	| 'trap'
	| 'err'
	| undefined

declare type _YouTubeUploads = {
	thumbnailImg: HTMLImageElement
	title: string
	url: string
}

declare type HATEOAS = {
	rel: string
	href: string
}

// SKC API related type declarations

declare type SKCBanListDate = {
	effectiveDate: Date
	_links: SKCBanListDateLinks
}

declare type SKCBanListDateLinks = {
	'Ban List Content': HATEOAS
	'Ban List New Content': HATEOAS
	'Ban List Removed Content': HATEOAS
}

declare type SKCBanListDates = {
	banListDates: SKCBanListDate[]
}

declare type SKCCard = {
	cardID: string
	cardName: string
	cardColor: cardColor
	cardAttribute?: string
	monsterType?: string
	monsterAssociation?: SKCMonsterAssociation
	monsterAttack?: string
	monsterDefense?: string
	cardEffect: string
}

declare type SKCCardBrowseCriteria = {
	cardColors: string[]
	attributes: string[]
	monsterTypes: string[]
	monsterSubTypes: string[]
	levels: number[]
	ranks: number[]
	linkRatings: number[]
	_links: {
		self: HATEOAS
	}
}

declare type SKCCardsPreviousBanListStatus = {
	card: SKCCard
	previousBanStatus: string
}

declare type SKCMonsterAssociation = {
	level: number
	rank: number
	scaleRating: number
	linkRating: number
	linkArrows: string[]
}

declare type SKCProductContent = {
	productPosition: string
	rarities: string[]
	card: SKCCard
}

// Heart API related type declarations

declare type HeartApiYouTubeUpload = {
	id: string
	title: string
	description: string
	publishedAt: Date
	thumbnailUrl: string
	url: string
}

declare type HeartApiMessageOutput = {
	service: string
	messages: HeartApiMessageItem[]
}

declare type HeartApiMessageItem = {
	title: string
	content: string
	tags: string[]
	createdAt: string
	updatedAt: string
}

declare type HeartApiEventOutput = {
	service: string
	events: HeartApiEventItem[]
}

declare type HeartApiEventItem = {
	name: string
	notes: string
	location: string
	eventDate: string
	url: string
	tags: string[]
	createdAt: string
	updatedAt: string
}

declare type Deck = {
	id: string
	name: string
	listContent: string
	VideoUrl: string
	uniqueCards: number
	deckMascots: string[]
	numMainDeckCards: number
	numExtraDeckCards: number
	tags: string[]
	createdAt: Date
	updatedAt: Date
	mainDeck: null
	extraDeck: null
}

declare type CardReference = {
	occurrences: number
	card: SKCCard
}

declare type CardSuggestionOutput = {
	namedMaterials: CardReference[]
	namedReferences: CardReference[]
}

declare type CardSupportOutput = {
	card: SKCCard
	referencedBy: SKCCard[]
	materialFor: SKCCard[]
}

declare type SKCBanListInstance = {
	banListDate: string
	cardID: string
	banStatus: string
	_links: SKCBanListDateLinks
}

declare type RestrictedIn = {
	TCG: SKCBanListInstance[]
	MD: SKCBanListInstance[]
	DL: SKCBanListInstance[]
}

declare type SKCCardInfo = SKCCard & {
	restrictedIn: RestrictedIn
	foundIn: ProductInfo[]
}
