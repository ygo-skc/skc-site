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

declare namespace YGOBanList {
	type Date = {
		effectiveDate: string
	}

	type Dates = {
		banListDates: YGOBanList.Date[]
	}

	type NormalFormatContent = {
		forbidden: YGOCard.Deets[]
		limited: YGOCard.Deets[]
		semiLimited: YGOCard.Deets[]
		numForbidden: number
		numLimited: number
		numSemiLimited: number
	}

	type NormalFormatRemovedCards = {
		removedCards: YGOBanList.PreviousBanListStatus[]
		numRemoved: number
	}

	type NormalFormatNewlyAdded = {
		newForbidden: YGOBanList.PreviousBanListStatus[]
		newLimited: YGOBanList.PreviousBanListStatus[]
		newSemiLimited: YGOBanList.PreviousBanListStatus[]
		numNewForbidden: number
		numNewLimited: number
		numNewSemiLimited: number
	}

	type NormalFormatDiff = YGOBanList.NormalFormatRemovedCards & YGOBanList.NormalFormatNewlyAdded

	type DLFormatContent = {
		forbidden: YGOCard.Deets[]
		limitedOne: YGOCard.Deets[]
		limitedTwo: YGOCard.Deets[]
		limitedThree: YGOCard.Deets[]
		numForbidden: number
		numLimitedOne: number
		numLimitedTwo: number
		numLimitedThree: number
	}

	type DLFormatRemovedCards = {
		removedCards: YGOBanList.PreviousBanListStatus[]
		numRemoved: number
	}

	type DLFormatNewlyAdded = {
		newForbidden: YGOBanList.PreviousBanListStatus[]
		newLimitedOne: YGOBanList.PreviousBanListStatus[]
		newLimitedTwo: YGOBanList.PreviousBanListStatus[]
		newLimitedThree: YGOBanList.PreviousBanListStatus[]
		numNewForbidden: number
		numNewLimitedOne: number
		numNewLimitedTwo: number
		numNewLimitedThree: number
	}

	type DLFormatDiff = DLFormatRemovedCards & DLFormatNewlyAdded

	declare type PreviousBanListStatus = {
		card: Deets
		previousBanStatus: string
	}
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

	type YouTubeUploadsResponse = {
		videos: HeartAPI.YouTubeUpload[]
		total: number
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

declare namespace SKC {
	type DBStats = {
		cardTotal: number
		banListTotal: number
		productTotal: number
	}

	type CardOfTheDay = {
		date: string
		version: number
		card: YGOCard.Deets
	}
}

declare type APIRequest<T> = T & {
	isFetchingData: boolean
	requestHasError: boolean
}
