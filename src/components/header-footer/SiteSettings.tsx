import '../../css/header-footer/navigation-icon.css'
import '../../css/header-footer/site-settings.css'

import { useState } from 'react'
import { IconButton, Popover, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'

import { ResultsView, useResultsViewPreference } from '../util/ResultsViewPreference'

// the nav's settings - a sheet like the messages popup, holding preferences saved in this browser
function SiteSettings() {
	const [anchor, setAnchor] = useState<HTMLButtonElement>()
	const { resultsView, setResultsView } = useResultsViewPreference()

	return (
		<>
			<IconButton className='styled-icon-button' aria-label='Settings' aria-haspopup='dialog' color='inherit' onClick={(event) => setAnchor(event.currentTarget)}>
				<SettingsIcon />
			</IconButton>

			<Popover
				open={Boolean(anchor)}
				anchorEl={anchor}
				onClose={() => setAnchor(undefined)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				marginThreshold={12}
				slotProps={{ paper: { className: 'site-settings', role: 'dialog', 'aria-labelledby': 'site-settings-heading' } }}
			>
				<Typography id='site-settings-heading' variant='h5' component='h2' className='site-settings__heading'>
					Settings
				</Typography>

				<div className='site-settings__group'>
					<div className='site-settings__row'>
						<div className='site-settings__text'>
							<Typography id='site-settings-results-view' variant='body1' className='site-settings__label'>
								Results view
							</Typography>
							<Typography variant='body2' className='site-settings__hint'>
								Card Browse, Product Browse and the ban list open in this view. Grid opens Product Browse and the ban list in Cards
							</Typography>
						</div>

						<ToggleButtonGroup
							className='site-settings__view'
							exclusive
							aria-labelledby='site-settings-results-view'
							value={resultsView}
							onChange={(_, value: ResultsView | null) => value && setResultsView(value)}
						>
							<ToggleButton value='list'>
								<ViewListRoundedIcon />
								List
							</ToggleButton>
							<ToggleButton value='grid'>
								<GridViewRoundedIcon />
								Grid
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
				</div>
			</Popover>
		</>
	)
}

export default SiteSettings
