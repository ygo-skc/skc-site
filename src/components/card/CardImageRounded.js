import React, {useState, useEffect} from 'react'
import { Skeleton } from '@material-ui/lab'
import VizSensor from 'react-visibility-sensor'

async function getImg(imgURL)
{
	return <img
		src={imgURL}
		style={{  width: '100%', objectFit: 'cover' }}
	/>
}

export default function CardImageRounded({cardID, timeout=10, defaultVisibility=false})
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
			<div style={{margin: 'auto', marginBottom: '.5rem', width: '96%'}} >
				<div
					style={{ borderRadius: '4rem', overflow: 'hidden', width: '100%',  height: '0', paddingBottom: '100%' }} >
					{(visible)? img : <Skeleton width='100%' height='100%' style={{objectFit: 'cover'}} />
					}
				</div>
			</div>

		</VizSensor>
	)
}