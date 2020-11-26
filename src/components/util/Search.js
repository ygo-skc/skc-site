import React from 'react'
import { Typography, Divider } from '@material-ui/core'

import styled from 'styled-components'


const RenderGroup = ({group, children}) =>
{
	return(
		<div style={{ paddingLeft: '1.25rem', paddingTop: '1.25rem' }} >
			<Typography
				variant='h6'>
				{group}
			</Typography>
			<Divider />
			{children}
		</div>
	)
}


const SearchSuggestionTypography = styled(Typography)`
	&&
	{
		white-space: pre-wrap;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		padding: 0rem;
		margin: 0rem;
	}
`

export {RenderGroup, SearchSuggestionTypography}