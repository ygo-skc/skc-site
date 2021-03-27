
const getDateString = (months, date) => `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export { getDateString, months }