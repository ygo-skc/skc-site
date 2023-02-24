import { Dates } from '../Dates'

const myBday = new Date(746322027000)
const becksBday = new Date(680664480000)

test('verify date gets formatted with {Day-Of-Week Month day, year}', () => {
	expect(Dates.getNonLocalizedDateString(myBday)).toBe('Wed Aug 25 1993')
	expect(Dates.getNonLocalizedDateString(becksBday)).toBe('Sat Jul 27 1991')
})

test('verify date gets formatted with {month day, year}', () => {
	expect(Dates.getDateString(myBday)).toBe('Aug 25, 1993')
	expect(Dates.getDateString(becksBday)).toBe('Jul 27, 1991')
})

test('verify time gets formatted with {hh:mm ZONE}', () => {
	// v8 browsers (like chrome) started adding this character in place of space https://stackoverflow.com/questions/75406192/javascript-tolocaletimestring-returning-ascii-226-instead-of-space-in-latest-v
	expect(Dates.getTimeString(myBday)).toBe('6:40 PM')
	expect(Dates.getTimeString(becksBday)).toBe('8:28 PM')
})

test('verify month is formatted correctly {3 char month - xxx}', () => {
	expect(Dates.getMonth(myBday)).toBe('Aug')
	expect(Dates.getMonth(becksBday)).toBe('Jul')
})

test('verify day is formatted correctly {day of month - x or xx}', () => {
	expect(Dates.getDay(myBday)).toBe('25')
	expect(Dates.getDay(becksBday)).toBe('27')
})

test('verify year is formatted correctly {xxxx}', () => {
	expect(Dates.getYear(myBday)).toBe('1993')
	expect(Dates.getYear(becksBday)).toBe('1991')
})

test('verify ban list date gets formatted correctly', () => {
	expect(Dates.fromYYYYMMDDToDateStr('2022-01-01')).toBe('Jan 1, 2022')
	expect(Dates.fromYYYYMMDDToDateStr('2021-02-10')).toBe('Feb 10, 2021')
	expect(Dates.fromYYYYMMDDToDateStr('1993-12-31')).toBe('Dec 31, 1993')
	expect(Dates.fromYYYYMMDDToDateStr('2001-09-11')).toBe('Sep 11, 2001')
})

test('verify fromYYYYMMDDToDate() works as intended', () => {
	const d = Dates.fromYYYYMMDDToDate('2022-09-11')

	expect(d.getFullYear()).toBe(2022)
	expect(d.getUTCMonth()).toBe(8)
	expect(d.getUTCDate()).toBe(11)
})

test('verify daysBetweenTwoDates() works as intended', () => {
	expect(Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate('1993-08-24'), Dates.fromYYYYMMDDToDate('1993-08-25'))).toBe(1)
	expect(Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate('1991-07-27'), Dates.fromYYYYMMDDToDate('1993-08-25'))).toBe(760)
	expect(Dates.daysBetweenTwoDates(becksBday, new Date(680664481000))).toBe(1)
	expect(Dates.daysBetweenTwoDates(new Date())).toBe(0)
})

test('verify isFutureDate() works as intended', () => {
	expect(Dates.isFutureDate(Dates.fromYYYYMMDDToDate('2050-01-01'))).toBe(true)
	expect(Dates.isFutureDate(Dates.fromYYYYMMDDToDate('2022-01-01'))).toBe(false)
})

test("verify retrieval of ban list date range doesn't cause issues with undefined input", () => {
	expect(Dates.getCurrentBanListDate()).toBe('')
	expect(Dates.getCurrentBanListDate('')).toBe('')
})

test('verify retrieval of ban list date range works as intended', () => {
	const dates = ['2021-01-10', '2021-03-11', '2021-07-01']

	expect(Dates.getCurrentBanListDate('2021-01-10', dates)).toBe('Jan 10, 2021 - ⁇')
	expect(Dates.getCurrentBanListDate('2021-03-11', dates)).toBe('Mar 11, 2021 - Jan 10, 2021')
	expect(Dates.getCurrentBanListDate('2021-07-01', dates)).toBe('Jul 1, 2021 - Mar 11, 2021')
})
