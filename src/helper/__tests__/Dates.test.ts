import { Dates } from '../Dates'

const date = new Date(746322027000)
const date2 = new Date(680664480000)

test('verify date gets formatted with {month day, year}', () => {
	expect(Dates.getDateString(date)).toBe('Aug 25, 1993')
	expect(Dates.getDateString(date2)).toBe('Jul 27, 1991')
})

test('verify time gets formatted with {hh:mm ZONE}', () => {
	expect(Dates.getTimeString(date)).toBe('6:40 PM')
	expect(Dates.getTimeString(date2)).toBe('8:28 PM')
})

test('verify month is formatted correctly {3 char month - xxx}', () => {
	expect(Dates.getMonth(date)).toBe('Aug')
	expect(Dates.getMonth(date2)).toBe('Jul')
})

test('verify day is formatted correctly {day of month - x or xx}', () => {
	expect(Dates.getDay(date)).toBe('25')
	expect(Dates.getDay(date2)).toBe('27')
})

test('verify year is formatted correctly {xxxx}', () => {
	expect(Dates.getYear(date)).toBe('1993')
	expect(Dates.getYear(date2)).toBe('1991')
})

test('verify ban list date gets formatted correctly', () => {
	expect(Dates.banListDate('2022-01-01')).toBe('Jan 1, 2022')
	expect(Dates.banListDate('2021-02-10')).toBe('Feb 10, 2021')
	expect(Dates.banListDate('1993-12-31')).toBe('Dec 31, 1993')
	expect(Dates.banListDate('2001-09-11')).toBe('Sep 11, 2001')
})
