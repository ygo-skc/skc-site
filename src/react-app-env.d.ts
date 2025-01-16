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

	type Deets = {
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

	type Info = Deets & {
		restrictedIn: Restrictions
		foundIn: YGOProduct.Info[]
	}
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

	type Restrictions = {
		TCG: YGOCard.RestrictionStatus[]
		MD: YGOCard.RestrictionStatus[]
		DL: YGOCard.RestrictionStatus[]
	}

	type Reference = {
		occurrences: number
		card: Deets
	}

	type Suggestion = {
		namedMaterials: YGOCard.Reference[]
		namedReferences: YGOCard.Reference[]
		hasSelfReference: boolean
		materialArchetypes: string[]
		referencedArchetypes: string[]
	}

	type Support = {
		card: Deets
		referencedBy: YGOCard.Reference[]
		materialFor: YGOCard.Reference[]
	}
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

declare namespace YGOData {
	type CardBrowseValues = {
		name: string
		value: string
	}

	type CardBrowseCriteria = {
		cardColors: string[]
		attributes: string[]
		monsterTypes: string[]
		monsterSubTypes: string[]
		levels: number[]
		ranks: number[]
		linkRatings: number[]
	}

	type CardBrowseResults = {
		results: Deets[]
		numResults: number
		requestedCriteria: CardBrowseCriteria
	}

	type ProductBrowseResult = {
		locale: string
		products: Info[]
	}
}

declare namespace YGOProduct {
	type Deets = {
		productId: string
		productLocale: string
		productName: string
		productType: string
		productSubType: string
		productReleaseDate: string
		productTotal: number
	}

	type Info = Stats &
		YGOProduct.Deets & {
			productContent: Content[]
		}

	type Stats = {
		productRarityStats: { [key: string]: number }
		cards: YGOCard.Deets[]
	}

	type Content = {
		productPosition: string
		rarities: string[]
		card: YGOCard.Deets
	}

	type SuggestionData = {
		suggestions: YGOCardSuggestion
		support: YGOCardSupport
	}
}

// yugioh ban list

declare type YGOBanListDate = {
	effectiveDate: string
}

declare type YGOBanListDates = {
	banListDates: YGOBanListDate[]
}

declare type YGOBanListContentNormalFormat = {
	forbidden: Deets[]
	limited: Deets[]
	semiLimited: Deets[]
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
	forbidden: Deets[]
	limitedOne: Deets[]
	limitedTwo: Deets[]
	limitedThree: Deets[]
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
	card: Deets
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
