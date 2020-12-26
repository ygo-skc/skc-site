import React, {useState, useEffect} from 'react'
import VizSensor from 'react-visibility-sensor'

async function getImg(imgURL)
{
	return <img
		src={imgURL}
		style={{  width: '100%', objectFit: 'cover' }}
	/>
}

export default function CardImageRounded({cardID, timeout=10})
{
	const [visible, setVisible] = useState(false)
	const [img, setImg] = useState(undefined)

	useEffect( () => {
		getImg(`https://images.thesupremekingscastle.com/${cardID}.jpg`).then(img => {
			setTimeout( () => setImg(img), timeout)
	})
	}, [])


	return(
      <VizSensor
			partialVisibility
			offset={{bottom:-750, top: -500}}
			onChange={(isVisible) => {
				if (isVisible !== false)
				setVisible(isVisible)
			}} >
			<div style={{margin: 'auto', marginBottom: '.5rem', width: '85%'}} >
				<div
					style={{ borderRadius: '50%', overflow: 'hidden', width: '100%',  height: '0', paddingBottom: '100%' }} >
					{(visible)? img : undefined
					}
				</div>
			</div>

		</VizSensor>
	)
}