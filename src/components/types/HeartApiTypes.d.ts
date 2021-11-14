export type MessageOutput = {
	service: string,
	message: MessageItem[]
}

export type MessageItem = {
	title: string,
	content: string,
	tags: string[],
	createdAt: string,
	updatedAt: string
}