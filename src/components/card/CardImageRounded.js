import React, {useState} from 'react'
import '../../css/rounded-img.css'
import VizSensor from 'react-visibility-sensor'


export default function CardImageRounded({cardImg, defaultVisibility=false})
{
	const [visible, setVisible] = useState(defaultVisibility)

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
					{(visible)? <img
							src={cardImg.src}
							id='rounded-img'
							width='100%'
							height='1'
							alt={`Card`}
						/> : undefined
					}
				</div>
			</div>

		</VizSensor>
	)
}