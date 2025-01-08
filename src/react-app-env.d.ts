/// <reference types="react-scripts" />

declare type YGOCard = {
	cardID: string
	cardName: string
	cardColor: YGOCardColor
	cardAttribute?: string
	cardEffect: string
	monsterType?: string
	monsterAssociation?: SKCMonsterAssociation
	monsterAttack?: string
	monsterDefense?: string
}

declare type BrowseCriteria = {
	name: string
	value: string
}

declare type YGOProductBrowseResults = {
	locale: string
	products: YGOProductInfo[]
}

declare type YGOProduct = {
	productId: string
	productLocale: string
	productName: string
	productType: string
	productSubType: string
	productReleaseDate: string
	productTotal: number
}

declare type YGOProductInfo = YGOProductStats &
	YGOProduct & {
		productContent: SKCProductContent[]
	}

declare type YGOProductStats = {
	productRarityStats: { [key: string]: number }
	cards: YGOCard[]
}

declare type YGOCardColor =
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

declare type YouTubeUploads = {
	thumbnailImg: HTMLImageElement
	title: string
	url: string
}

// SKC API related type declarations

declare type SKCBanListDate = {
	effectiveDate: string
}

declare type SKCBanListDates = {
	banListDates: SKCBanListDate[]
}

declare type SKCBanListContentNormalFormat = {
	forbidden: YGOCard[]
	limited: YGOCard[]
	semiLimited: YGOCard[]
	numForbidden: number
	numLimited: number
	numSemiLimited: number
}

declare type SKCBanListRemovedCards = {
	removedCards: SKCCardsPreviousBanListStatus[]
	numRemoved: number
}

declare type SKCBanListNewCardsNormalFormat = {
	newForbidden: SKCCardsPreviousBanListStatus[]
	newLimited: SKCCardsPreviousBanListStatus[]
	newSemiLimited: SKCCardsPreviousBanListStatus[]
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
}

declare type SKCBanListDiffContentNormalFormat = SKCBanListRemovedCards & SKCBanListNewCardsNormalFormat

declare type SKCBanListContentDuelLinksFormat = {
	forbidden: YGOCard[]
	limitedOne: YGOCard[]
	limitedTwo: YGOCard[]
	limitedThree: YGOCard[]
	numForbidden: number
	numLimitedOne: number
	numLimitedTwo: number
	numLimitedThree: number
}

declare type SKCBanListRemovedCardsDuelLinksFormat = {
	removedCards: SKCCardsPreviousBanListStatus[]
	numRemoved: number
}

declare type SKCBanListNewCardsDuelLinksFormat = {
	newForbidden: SKCCardsPreviousBanListStatus[]
	newLimitedOne: SKCCardsPreviousBanListStatus[]
	newLimitedTwo: SKCCardsPreviousBanListStatus[]
	newLimitedThree: SKCCardsPreviousBanListStatus[]
	numNewForbidden: number
	numNewLimitedOne: number
	numNewLimitedTwo: number
	numNewLimitedThree: number
}

declare type SKCBanListDiffContentDuelLinksFormat = SKCBanListRemovedCardsDuelLinksFormat & SKCBanListNewCardsDuelLinksFormat

declare type SKCCardBrowseCriteria = {
	cardColors: string[]
	attributes: string[]
	monsterTypes: string[]
	monsterSubTypes: string[]
	levels: number[]
	ranks: number[]
	linkRatings: number[]
}

declare type SKCCardBrowseResults = {
	results: YGOCard[]
	numResults: number
	requestedCriteria: SKCCardBrowseCriteria
}

declare type SKCCardsPreviousBanListStatus = {
	card: YGOCard
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
	card: YGOCard
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
	card: YGOCard
}

declare type CardSuggestionOutput = {
	namedMaterials: CardReference[]
	namedReferences: CardReference[]
	hasSelfReference: boolean
	materialArchetypes: string[]
	referencedArchetypes: string[]
}

declare type CardSupportOutput = {
	card: YGOCard
	referencedBy: CardReference[]
	materialFor: CardReference[]
}

declare type ProductCardSuggestionOutput = {
	suggestions: CardSuggestionOutput
	support: CardSupportOutput
}

declare type SKCBanListInstance = {
	banListDate: string
	cardID: string
	banStatus: string
}

declare type RestrictedIn = {
	TCG: SKCBanListInstance[]
	MD: SKCBanListInstance[]
	DL: SKCBanListInstance[]
}

declare type SKCCardInfo = YGOCard & {
	restrictedIn: RestrictedIn
	foundIn: YGOProductInfo[]
}
