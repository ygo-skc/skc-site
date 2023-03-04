import { ClickAwayListener, IconButton, Tooltip, Typography } from '@mui/material'
import { FC, Fragment, useState } from 'react'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import '../../../css/card/ygo-card-suggestion.css'

type _SuggestionSection = {
	suggestions: JSX.Element[]
	sectionName: string
	sectionExplanation: string
}

const SuggestionSection: FC<_SuggestionSection> = ({ suggestions, sectionName, sectionExplanation }) => {
	const [isTooltipOpen, setIsTooltipOpen] = useState(false)

	return (
		<Fragment>
			{suggestions.length === 0 ? undefined : (
				<div className='suggestion-section'>
					<div className='suggestion-section-title'>
						<Typography variant='h4'>
							{sectionName} ({suggestions.length})
						</Typography>

						<ClickAwayListener onClickAway={() => setIsTooltipOpen(false)}>
							<div>
								<Tooltip
									PopperProps={{
										disablePortal: true,
									}}
									onClose={() => setIsTooltipOpen(false)}
									open={isTooltipOpen}
									disableFocusListener
									disableHoverListener
									disableTouchListener
									title={sectionExplanation}
									arrow
								>
									<IconButton className='suggestion-section-question-mark-button' onClick={() => setIsTooltipOpen(true)}>
										<QuestionMarkIcon className='suggestion-section-question-mark-icon' />
									</IconButton>
								</Tooltip>
							</div>
						</ClickAwayListener>
					</div>

					<div className='suggestions-wrapper'>{suggestions}</div>
				</div>
			)}
		</Fragment>
	)
}

export default SuggestionSection
