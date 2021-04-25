import React, {useState, useEffect} from 'react'
import '../../css/rounded-img.css'
import VizSensor from 'react-visibility-sensor'

async function getImg(imgURL)
{
	return <img
		src={imgURL}
		id='rounded-img'
	/>
}


export default function CardImageRounded({cardID, timeout=0, defaultVisibility=false})
{
	const [visible, setVisible] = useState(defaultVisibility)
	const [img, setImg] = useState(undefined)

	useEffect( () => {
		getImg(`https://images.thesupremekingscastle.com/${cardID}.jpg`).then(img => {
			setTimeout( () => setImg(img), timeout)
	})
	}, [])


	return(
      <VizSensor
			partialVisibility
			offset={{bottom:-350, top: -200}}
			onChange={(isVisible) => {
				if (isVisible !== false)
				setVisible(isVisible)
			}} >
			<div id='rounded-img-outer-container' >
				<div id='rounded-img-inner-container' >
					{(visible)? img : undefined
					}
				</div>
			</div>

		</VizSensor>
	)
}