import { useEffect, useState } from 'react'
import { ButtonBase, Typography, useMediaQuery } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import { useSiteSearch } from './SiteSearch'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

// a mix of names, a passcode and partial names - shows what can be searched rather than saying it
export const EXAMPLE_SEARCHES = ['Dark Magician', '46986414', 'Blue-Eyes', 'Ash Blossom', 'Raigeki']

const TYPE_MS = 70
const DELETE_MS = 35
const HOLD_MS = 1600
const GAP_MS = 300

/*
 * Types out each example, holds it, deletes it, then moves to the next.
 * With reduced motion the first example just stays put
 */
function useTypedExample(examples: string[]) {
	const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)', { noSsr: true })
	const [text, setText] = useState(examples[0])

	useEffect(() => {
		setText(examples[0])
		if (reduceMotion) return

		let index = 0
		let length = examples[0].length
		let deleting = false
		let timer: ReturnType<typeof setTimeout>

		const step = () => {
			if (!deleting && length === examples[index].length) {
				deleting = true
				timer = setTimeout(step, HOLD_MS)
				return
			}
			if (deleting && length === 0) {
				deleting = false
				index = (index + 1) % examples.length
				timer = setTimeout(step, GAP_MS)
				return
			}

			length += deleting ? -1 : 1
			setText(examples[index].slice(0, length))
			timer = setTimeout(step, deleting ? DELETE_MS : TYPE_MS)
		}

		timer = setTimeout(step, 0)
		return () => clearTimeout(timer)
	}, [examples, reduceMotion])

	return text
}

/*
 * Looks like a search box but is a button - it opens the site search popup, which is where typing happens
 */
export default function SearchField() {
	const { openSearch } = useSiteSearch()
	const example = useTypedExample(EXAMPLE_SEARCHES)

	return (
		// the typed example changes every few seconds, so the button keeps a steady name
		<ButtonBase className='search-field' aria-label='Search cards by name or passcode' aria-haspopup='dialog' aria-keyshortcuts='Meta+K Control+K /' onClick={openSearch}>
			<SearchIcon className='search-field__icon' />
			<Typography variant='body1' component='span' className='search-field__placeholder' aria-hidden='true'>
				Try{' '}
				<Typography variant='inherit' component='span' className='search-field__example'>
					{example}
				</Typography>
			</Typography>
			<Typography variant='body2' component='span' className='search-field__keys' aria-hidden='true'>
				<kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
				<kbd>K</kbd>
			</Typography>
		</ButtonBase>
	)
}
