import React from 'react'

import Styled from 'styled-components'


const CustomImg = Styled('img')`
	&&
	{
		width: 120px;
		:hover
		{
			cursor: pointer
		}

		border-radius: 50%;
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