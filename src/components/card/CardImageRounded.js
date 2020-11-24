import React, {useState} from 'react'


export default function CardImageRounded({cardID})
{
	const [showDefault, setShowDefault] = useState(false)

	return(
		<div style={{margin: 'auto', marginBottom: '.5rem', width: '85%'}} >
			<div
				style={{ borderRadius: '50%', overflow: 'hidden', width: '100%',  height: '0', paddingBottom: '100%' }} >
					<img
						alt={`Default Image`}
						src={`${process.env.PUBLIC_URL}/Img/card_back_square.jpg`}
						style={(showDefault)? {  width: '100%', objectFit: 'cover' } : {display: 'none'}}
					/>

					<img
						alt={`Card Having ID ${cardID}`}
						src={`https://images.thesupremekingscastle.com/${cardID}.jpg`}
						style={{  width: '100%', objectFit: 'cover' }}
						onError={ () => {
							setShowDefault(true)
						}}
					/>
			</div>
		</div>
	)
}