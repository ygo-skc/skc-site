import { Typography } from '@mui/material'
import { FC, Fragment } from 'react'

type _SuggestionSection = {
	suggestions: JSX.Element[]
	sectionName: string
}

const SuggestionSection: FC<_SuggestionSection> = ({ suggestions, sectionName }) => {
	return (
		<Fragment>
			{suggestions.length === 0 ? undefined : (
				<div className='suggestion-parent'>
					<Typography variant='h4'>
						{sectionName} ({suggestions.length})
					</Typography>
					<div className='suggestion-wrapper'>{suggestions}</div>
				</div>
			)}
		</Fragment>
	)
}

export default SuggestionSection
