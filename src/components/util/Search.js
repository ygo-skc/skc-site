import React from 'react'
import { Typography, Divider } from '@material-ui/core'

import styled from 'styled-components'


const RenderGroup = ({group, children}) =>
{
	return(
		<div style={{ paddingLeft: '.5rem', paddingTop: '.8rem' }} >
			<Typography
				variant='subtitle1' style={{fontWeight: '800'}} >
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
		font-weight: 500;
	}
`

export {RenderGroup, SearchSuggestionTypography}