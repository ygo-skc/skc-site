const getDateString = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
const getTimeString = (date: Date) => date.toLocaleTimeString('en-US', {hour12:true, hour:'numeric', minute:'numeric'})

export { getDateString, getTimeString }