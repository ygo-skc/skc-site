import { Typography } from '@mui/material'
import { FC } from 'react'
import { ReactElement } from 'react-markdown/lib/react-markdown'

type _ImageWithNumber = {
	imageComponent?: ReactElement
	text: string
}

const ImageWithNumber: FC<_ImageWithNumber> = ({ imageComponent, text }) => {
	return (
		<div className='img-with-number-parent'>
			{imageComponent}
			<Typography variant='subtitle1' textAlign='center'>
				{text}
			</Typography>
		</div>
	)
}

export { ImageWithNumber }
