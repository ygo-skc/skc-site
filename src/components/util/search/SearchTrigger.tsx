import { IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import { useSiteSearch } from './SiteSearch'

/*
 * Nav button for site search
 */
export default function SearchTrigger() {
	const { openSearch } = useSiteSearch()

	return (
		<IconButton className='styled-icon-button' aria-label='Search cards' aria-keyshortcuts='Meta+K Control+K /' aria-haspopup='dialog' onClick={openSearch}>
			<SearchIcon />
		</IconButton>
	)
}
