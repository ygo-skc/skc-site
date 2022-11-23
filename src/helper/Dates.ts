class Dates {
	static readonly getNonLocalizedDateString = (date: Date) => date.toDateString()
	static readonly getDateString = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
	static readonly getTimeString = (date: Date) => date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })

	static readonly getMonth = (date: Date) => date.toLocaleDateString('en-US', { month: 'short' })
	static readonly getDay = (date: Date) => date.toLocaleDateString('en-US', { day: 'numeric' })
	static readonly getYear = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric' })

	static readonly fromYYYYMMDDToDate = (fromDate: string) => {
		const [year, month, day] = fromDate.split('-')
		return Dates.getDateString(new Date(+year, +month - 1, +day))
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
			return Dates.fromYYYYMMDDToDate(selectedBanList) + ' - Present'
		} else {
			return Dates.fromYYYYMMDDToDate(selectedBanList) + ' - ' + Dates.fromYYYYMMDDToDate(banListStartDates[banListPos - 1])
		}
	}
}

export { Dates }
