import React from 'react'



export default function CardImageRounded({cardID})
{
	return(
		<div style={{margin: 'auto', marginBottom: '.5rem', width: '85%'}} >
			<div
				style={{ borderRadius: '50%', overflow: 'hidden', width: '100%',  height: '0', paddingBottom: '100%' }} >

				{/* <object data={`${process.env.PUBLIC_URL}/Img/card_back_square.svg`} type="image/png"> */}
					<img
						src={`https://yugiohsiteimages.s3.us-east-2.amazonaws.com/${cardID}.jpg`}
						style={{  width: '100%', objectFit: 'cover' }}
						onError={(error) => {
							error.target.src=`${process.env.PUBLIC_URL}/Img/card_back_square.svg`
							error.target.onError = null
						}}
						/>
				{/* </object> */}
			</div>
		</div>
	)
}