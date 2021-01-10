import React from 'react'

import Styled from 'styled-components'


const CustomImg = Styled('img')`
	&&
	{
		margin-bottom: 1rem;
		width: 120px;
		:hover
		{
			cursor: pointer
		}
	}
`


export default function GenericLinkPhoto( { imageName, link} )
{
	return(
		<CustomImg
			src={`${process.env.PUBLIC_URL}/Img/${imageName}`}
			onClick={ () => {
				const w = window.open(link, '_blank')
				w.focus()
			} } />
	)
}