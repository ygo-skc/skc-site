import { Dates } from '../Dates'

test('xxx', () => {
	expect(Dates.getDateString(new Date(746322027000))).toBe('Aug 25, 1993')
})
