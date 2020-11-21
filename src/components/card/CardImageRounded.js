import React, {useState} from 'react'

const defaultImg = <img
	alt={`Default Image`}
	src={`${process.env.PUBLIC_URL}/Img/card_back_square.svg`}
	style={{  width: '100%', objectFit: 'cover' }}
/>

export default function CardImageRounded({cardID})
{
	const [showDefault, setShowDefault] = useState(false)

	return(
		<div style={{margin: 'auto', marginBottom: '.5rem', width: '85%'}} >
			<div
				style={{ borderRadius: '50%', overflow: 'hidden', width: '100%',  height: '0', paddingBottom: '100%' }} >
					{(showDefault)? defaultImg :
						<img
						alt={`Card Having ID ${cardID}`}
						src={`https://yugiohsiteimages.s3.us-east-2.amazonaws.com/${cardID}.jpg`}
						style={{  width: '100%', objectFit: 'cover' }}
						onError={(error) => {
							setShowDefault(true)
						}}
						/>
					}
			</div>
		</div>
	)
}