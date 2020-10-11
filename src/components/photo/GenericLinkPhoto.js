import React from 'react'

import Styled from 'styled-components'


const CustomImg = Styled('img')`
	&&
	{
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
			style={{width: '70px', marginRight: '1rem'}}
			onClick={ () => {
				const w = window.open(link, '_blank')
				w.focus()
			} } />
	)
}