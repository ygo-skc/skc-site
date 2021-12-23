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
	productTotal: number
	productRarityStats: { [key: string]: string }
	isDataLoaded: boolean
}

declare type _YGOCard = {
	cardName: string
	cardColor: string
	cardEffect: string
	monsterType: string
	cardAttribute?: string
	monsterAtk?: string
	monsterDef?: string
	monsterAssociation?: string
	cardID: string
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
