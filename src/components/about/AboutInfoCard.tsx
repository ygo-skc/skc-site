import { FunctionComponent } from 'react'

import { Typography } from '@mui/material'
import LinkPhoto from '../util/photo/LinkPhoto'

type AboutInfoCardProps = {
	title: string
	subtitle: string
	body: JSX.Element
	imgPath: string
	imgLink: string
}

const AboutInfoCard: FunctionComponent<AboutInfoCardProps> = ({ title, subtitle, body, imgPath, imgLink }) => (
	<div className='info-card'>
		<div className='info-card-header-container'>
			<div className='centered-image'>
				<LinkPhoto imageName={imgPath} link={imgLink} />
			</div>
			<Typography align='center' variant='h4'>
				{title}
			</Typography>
			<Typography align='center' variant='h5'>
				{subtitle}
			</Typography>
		</div>

		<Typography variant='body1' className='info-card-body'>
			{body}
		</Typography>
	</div>
)

export default AboutInfoCard
