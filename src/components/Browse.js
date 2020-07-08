import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'

import Breadcrumb from './Breadcrumb'
import { MainContentContainer } from './MainContent'


export const Browse =() =>
{
	const options = ['Effect', 'Fusion', 'Ritual']
	return(
		<MainContentContainer>
			<Breadcrumb crumbs={ ['Home', 'Browse'] } />
			<Autocomplete
				multiple
				limitTags={2}
				id='multiple-limit-tags'
				options={options}
				getOptionLabel={(option) => option}
				renderInput={(params) => (
					<TextField {...params} variant='filled' label='' placeholder='Card Type' />
				)}
			/>
		</MainContentContainer>
	)
}