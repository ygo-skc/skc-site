class Dates {
	static readonly getDateString = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
	static readonly getTimeString = (date: Date) => date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })

	static readonly getCurrentBanListDate = (selectedBanList: string, banListStartDates: string[]): string => {
		const banListPos = banListStartDates.findIndex((item) => {
			if (item === selectedBanList) return true

			return false
		})

		switch (banListPos) {
			case 0:
				return Dates.getDateString(new Date(selectedBanList)) + ' - Present'
			default:
				let offset = 24 * 60 * 60 * 1000 * 1 //5 days
				let nextDate = new Date(banListStartDates[banListPos - 1])
				nextDate.setTime(nextDate.getTime() - offset)

				return Dates.getDateString(new Date(selectedBanList)) + ' - ' + Dates.getDateString(nextDate)
		}
	}
}

export { Dates }
