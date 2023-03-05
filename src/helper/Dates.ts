class Dates {
	static readonly getNonLocalizedDateString = (date: Date): string => date.toDateString()
	static readonly getDateString = (date: Date): string => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
	static readonly getTimeString = (date: Date): string => date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })

	static readonly getMonth = (date: Date): string => date.toLocaleDateString('en-US', { month: 'short' })
	static readonly getDay = (date: Date): string => date.toLocaleDateString('en-US', { day: 'numeric' })
	static readonly getYear = (date: Date): string => date.toLocaleDateString('en-US', { year: 'numeric' })

	static readonly fromYYYYMMDDToDateStr = (fromDateStr: string): string => {
		return Dates.getDateString(this.fromYYYYMMDDToDate(fromDateStr))
	}

	static readonly fromYYYYMMDDToDate = (fromDateStr: string): Date => {
		const [year, month, day] = fromDateStr.split('-')
		return new Date(+year, +month - 1, +day)
	}

	static readonly daysBetweenTwoDates = (lowestDate: Date, highestDate: Date = new Date()): number => {
		return Math.ceil((highestDate.getTime() - lowestDate.getTime()) / (1000 * 3600 * 24))
	}

	static readonly isFutureDate = (d: Date): boolean => {
		return d > new Date() ? true : false
	}

	static readonly getCurrentBanListDate = (selectedBanList?: string, banListStartDates?: string[]): string => {
		if (selectedBanList === undefined || banListStartDates === undefined) {
			return ''
		}

		const banListPos = banListStartDates.findIndex((item) => {
			if (item === selectedBanList) return true

			return false
		})

		if (banListPos === 0) {
			return Dates.fromYYYYMMDDToDateStr(selectedBanList) + ' - ⁇'
		} else {
			return Dates.fromYYYYMMDDToDateStr(selectedBanList) + ' - ' + Dates.fromYYYYMMDDToDateStr(banListStartDates[banListPos - 1])
		}
	}
}

export { Dates }
