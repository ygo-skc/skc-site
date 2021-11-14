export type AllCommunication = {
	service: string,
	communications: CommunicationItem[]
}

export type CommunicationItem = {
	title: string,
	content: string,
	tags: string[],
	createdAt: string,
	updatedAt: string
}