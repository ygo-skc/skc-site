import { FC } from 'react'

import '../../../css/util/photo.css'

const GenericLinkPhoto: FC<{ imageName: string; link: string }> = ({ imageName, link }) => {
	return (
		<img
			className='generic-link-photo'
			src={`${process.env.PUBLIC_URL}/Img/${imageName}`}
			onClick={() => {
				const w = window.open(link, '_blank')!
				w.focus()
			}}
		/>
	)
}

export default GenericLinkPhoto
