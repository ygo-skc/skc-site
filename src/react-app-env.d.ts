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

declare type ProductContent = {
	productPosition: string
	rarities: string[]
	card?: Card
}
