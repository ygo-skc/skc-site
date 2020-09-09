import React from 'react'



export default function CardImageRounded({cardID})
{
	return(
		<div style={{margin: 'auto', marginBottom: '.5rem', width: '85%'}} >
			<div
				style={{ borderRadius: '50%', overflow: 'hidden', width: '100%',  height: '0', paddingBottom: '100%' }} >
				<img src={`https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${cardID}.jpg`} style={{  width: '100%', objectFit: 'cover' }} />
			</div>
		</div>
	)
}