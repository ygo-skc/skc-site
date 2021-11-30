import { Typography, Divider } from '@material-ui/core'
import { FC, ReactNode } from 'react'

import styled from 'styled-components'

type RenderGroupTest = {
	group: string,
	children: ReactNode
}

const RenderGroup:FC<RenderGroupTest> = ({group, children}) => {
	return(
		<div style={{ padding: '0rem', paddingLeft: '.5rem' }} >
			<Typography
				variant='subtitle1' >
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

export {SearchSuggestionTypography}
export default RenderGroup