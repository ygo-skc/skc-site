enum AcceptableBanListFormat {
	TCG = 'TCG',
	MD = 'MD',
	DL = 'DL',
}

function getValidFormat(userDefinedFormat: string | undefined): AcceptableBanListFormat {
	const format = userDefinedFormat ? userDefinedFormat.toUpperCase() : 'TCG'

	if (format in AcceptableBanListFormat) {
		return format as AcceptableBanListFormat
	} else {
		return AcceptableBanListFormat.TCG
	}
}

function determineListSize(size: number | undefined): number {
	return size ?? 0
}

export { AcceptableBanListFormat, getValidFormat, determineListSize }
