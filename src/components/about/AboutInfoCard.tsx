import { FunctionComponent, JSX } from 'react'

import { Typography } from '@mui/material'
import { LinkPhoto } from 'skc-rcl'

type AboutInfoCardProps = {
	title: string
	subtitle: string
	body: JSX.Element
	imgName: string
	imgLink: string
}

const AboutInfoCard: FunctionComponent<AboutInfoCardProps> = ({ title, subtitle, body, imgName, imgLink }) => (
	<div className='info-card'>
		<div className='info-card-header-container'>
			<div className='centered-image'>
				<LinkPhoto imageName={imgName} link={imgLink} imageSrc={`/assets/${imgName}`} />
			</div>
			<Typography align='center' variant='h4'>
				{title}
			</Typography>
			<Typography align='center' variant='h5'>
				{subtitle}
			</Typography>
		</div>

		<div className='info-card-body'>{body}</div>
	</div>
)

export default AboutInfoCard
