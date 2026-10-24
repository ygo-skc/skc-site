export const getNonLocalizedDateString = (date: Date): string => date.toDateString()
export const getDateString = (date: Date): string => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
export const getTimeString = (date: Date): string => date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })

export const getMonth = (date: Date): string => date.toLocaleDateString('en-US', { month: 'short' })
export const getDay = (date: Date): string => date.toLocaleDateString('en-US', { day: 'numeric' })
export const getYear = (date: Date): string => date.toLocaleDateString('en-US', { year: 'numeric' })

export const fromYYYYMMDDToDate = (fromDateStr: string): Date => {
	const [year, month, day] = fromDateStr.split('-')
	return new Date(+year, +month - 1, +day)
}

export const fromYYYYMMDDToDateStr = (fromDateStr: string): string => {
	return getDateString(fromYYYYMMDDToDate(fromDateStr))
}

export const daysBetweenTwoDates = (lowestDate: Date, highestDate: Date = new Date()): number => {
	return Math.ceil((highestDate.getTime() - lowestDate.getTime()) / (1000 * 3600 * 24))
}

export const isFutureDate = (d: Date): boolean => {
	return d > new Date()
}

export const getCurrentBanListDate = (selectedBanList?: string, banListStartDates?: string[]): string => {
	if (selectedBanList === undefined || banListStartDates === undefined) {
		return ''
	}

	const banListPos = banListStartDates.findIndex((item) => {
		if (item === selectedBanList) return true

		return false
	})

	if (banListPos === 0) {
		return fromYYYYMMDDToDateStr(selectedBanList) + ' - Present'
	} else {
		return fromYYYYMMDDToDateStr(selectedBanList) + ' - ' + fromYYYYMMDDToDateStr(banListStartDates[banListPos - 1])
	}
}
