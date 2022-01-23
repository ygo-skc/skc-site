/// <reference types="react-scripts" />

declare type MessageOutput = {
	service: string
	message: MessageItem[]
}

declare type MessageItem = {
	title: string
	content: string
	tags: string[]
	createdAt: string
	updatedAt: string
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

declare type _YGOCard = {
	cardID: string
	cardName: string
	cardColor: cardColor
	cardEffect: string
	monsterType?: string
	cardAttribute?: string
	monsterAtk?: string
	monsterDef?: string
	monsterAssociation?: SKCMonsterAssociation
	fullDetails: boolean
	effectMaxLineHeight?: number
	isLoading?: boolean
	className?: string
}

declare type _YouTubeUploads = {
	thumbnailImg: HTMLImageElement
	title: string
	url: string
}

declare type _CardData = {
	cardID: string
	cardName: string
	cardColor: cardColor
	cardEffect: string
	monsterType?: string
	cardAttribute?: string
	monsterAtk?: string
	monsterDef?: string
	monsterAssociation?: SKCMonsterAssociation
	isLoading: boolean
	cardImg
}

declare type HATEOAS = {
	href: string
}

declare type SKCBanListDate = {
	effectiveDate: Date
	_links: {
		'Ban List Content': HATEOAS
		'Ban List New Content': HATEOAS
		'Ban List New Content': HATEOAS
	}
}

declare type SKCBanListDates = {
	banListDates: SKCBanListDate[]
}

declare type SKCCard = {
	cardID: string
	cardName: string
	cardColor: string
	cardAttribute: string
	monsterType: string
	monsterAssociation: SKCMonsterAssociation
	monsterAttack: number
	monsterDefense: number
	cardEffect: string
	monsterType: string
}

declare type SKCCardsPreviousBanListStatus = {
	cardName: string
	cardId: string
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

declare type HeartApiYouTubeUpload = {
	id: string
	title: string
	description: string
	publishedAt: Date
	thumbnailUrl: string
	url: string
}
// declare type HeartApiYouTubeUploads = {}
