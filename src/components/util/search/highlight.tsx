import { Fragment, ReactNode } from 'react'

// the letters matching any word of the query, wrapped in <mark>
export default function highlight(text: string, query: string): ReactNode {
	const terms = query
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

	if (terms.length === 0) return text

	return text.split(new RegExp(`(${terms.join('|')})`, 'gi')).map((part, index) => (index % 2 === 1 ? <mark key={index}>{part}</mark> : <Fragment key={index}>{part}</Fragment>))
}
