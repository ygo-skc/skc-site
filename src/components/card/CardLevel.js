import React, { useEffect, useState } from 'react'


const levelImage = <img src={`${process.env.PUBLIC_URL}/Img/card_level.svg`} style={{ width: '20px', marginLeft: '1px' }} />


const CardLevel = ( { level } ) =>
{
	const [levelImages, setLevelImages] = useState(undefined)
	useEffect( () => {
		let starsToCreate = Number(level)
		const stars = []

		while (starsToCreate != 0)
		{
			stars.push(levelImage)
			starsToCreate--
		}
		setLevelImages(stars)

	}, [level])


	return(
		<div style={{ width: '100%', marginBottom: '.25rem', textAlign: 'right'}} >
			{ levelImages }
		</div>
	)
}

export { CardLevel }