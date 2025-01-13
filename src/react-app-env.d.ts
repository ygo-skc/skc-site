/// <reference types="react-scripts" />

declare namespace YGOCard {
	type Color =
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

	type MonsterAssociation = {
		level: number
		rank: number
		scaleRating: number
		linkRating: number
		linkArrows: string[]
	}

	type RestrictionStatus = {
		banListDate: string
		cardID: string
		banStatus: string
	}

	declare type Restrictions = {
		TCG: YGOCard.RestrictionStatus[]
		MD: YGOCard.RestrictionStatus[]
		DL: YGOCard.RestrictionStatus[]
	}

	type Reference = {
		occurrences: number
		card: YGOCard
	}

	type Suggestion = {
		namedMaterials: YGOCard.Reference[]
		namedReferences: YGOCard.Reference[]
		hasSelfReference: boolean
		materialArchetypes: string[]
		referencedArchetypes: string[]
	}

	type Support = {
		card: YGOCard
		referencedBy: YGOCard.Reference[]
		materialFor: YGOCard.Reference[]
	}
}

declare type YGOCard = {
	cardID: string
	cardName: string
	cardColor: YGOCard.Color
	cardAttribute?: string
	cardEffect: string
	monsterType?: string
	monsterAssociation?: MonsterAssociation
	monsterAttack?: string
	monsterDefense?: string
}

declare type YGOCardInfo = YGOCard & {
	restrictedIn: Restrictions
	foundIn: YGOProductInfo[]
}

declare type YGODeck = {
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

// yugioh card browse and search

declare type YGOCardBrowseCriteria = {
	name: string
	value: string
}

declare type YGOProductBrowseResults = {
	locale: string
	products: YGOProductInfo[]
}

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

// yugioh product

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
		productContent: YGOProductContent[]
	}

declare type YGOProductStats = {
	productRarityStats: { [key: string]: number }
	cards: YGOCard[]
}

declare type YGOProductContent = {
	productPosition: string
	rarities: string[]
	card: YGOCard
}

declare type ProductCardSuggestion = {
	suggestions: YGOCardSuggestion
	support: YGOCardSupport
}

// yugioh ban list

declare type YGOBanListDate = {
	effectiveDate: string
}

declare type YGOBanListDates = {
	banListDates: YGOBanListDate[]
}

declare type YGOBanListContentNormalFormat = {
	forbidden: YGOCard[]
	limited: YGOCard[]
	semiLimited: YGOCard[]
	numForbidden: number
	numLimited: number
	numSemiLimited: number
}

declare type YGOBanListRemovedCards = {
	removedCards: YGOCardsPreviousBanListStatus[]
	numRemoved: number
}

declare type YGOBanListNewCardsNormalFormat = {
	newForbidden: YGOCardsPreviousBanListStatus[]
	newLimited: YGOCardsPreviousBanListStatus[]
	newSemiLimited: YGOCardsPreviousBanListStatus[]
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
}

declare type YGOBanListDiffContentNormalFormat = YGOBanListRemovedCards & YGOBanListNewCardsNormalFormat

declare type YGOBanListContentDLFormat = {
	forbidden: YGOCard[]
	limitedOne: YGOCard[]
	limitedTwo: YGOCard[]
	limitedThree: YGOCard[]
	numForbidden: number
	numLimitedOne: number
	numLimitedTwo: number
	numLimitedThree: number
}

declare type YGOBanListRemovedCardsDLFormat = {
	removedCards: YGOCardsPreviousBanListStatus[]
	numRemoved: number
}

declare type YGOBanListNewCardsDLFormat = {
	newForbidden: YGOCardsPreviousBanListStatus[]
	newLimitedOne: YGOCardsPreviousBanListStatus[]
	newLimitedTwo: YGOCardsPreviousBanListStatus[]
	newLimitedThree: YGOCardsPreviousBanListStatus[]
	numNewForbidden: number
	numNewLimitedOne: number
	numNewLimitedTwo: number
	numNewLimitedThree: number
}

declare type YGOBanListDiffContentDLFormat = YGOBanListRemovedCardsDLFormat & YGOBanListNewCardsDLFormat

declare type YGOCardsPreviousBanListStatus = {
	card: YGOCard
	previousBanStatus: string
}

declare namespace HeartAPI {
	type YouTubeUpload = {
		id: string
		title: string
		description: string
		publishedAt: Date
		thumbnailUrl: string
		url: string
	}

	type YouTubeUploads = {
		thumbnailImg: HTMLImageElement
		title: string
		url: string
	}

	type Event = {
		service: string
		events: HeartAPI.EventItem[]
	}

	type EventItem = {
		name: string
		notes: string
		location: string
		eventDate: string
		url: string
		tags: string[]
		createdAt: string
		updatedAt: string
	}

	type Message = {
		service: string
		messages: HeartApiMessageItem[]
	}

	type MessageInstance = {
		title: string
		content: string
		tags: string[]
		createdAt: string
		updatedAt: string
	}
}
