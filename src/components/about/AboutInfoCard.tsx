import { FunctionComponent, JSX, memo, useId } from 'react'

import { Typography } from '@mui/material'
import { LinkPhoto } from 'skc-rcl'

type AboutInfoCardProps = {
	title: string
	subtitle: string
	body: JSX.Element
	imgName: string
	imgLink: string
}

/*
 * One column of the about grid - a small icon beside an eyebrow label and the title, with the body below. Columns are split by
 * hairlines rather than boxed, which keeps four dense sections from reading as four competing cards.
 */
const AboutInfoCard: FunctionComponent<AboutInfoCardProps> = memo(({ title, subtitle, body, imgName, imgLink }) => {
	const titleId = useId()

	return (
		<article className='info-card' aria-labelledby={titleId}>
			<header className='info-card__header'>
				<div className='info-card__badge'>
					<LinkPhoto imageName={imgName} link={imgLink} imageSrc={`/assets/${imgName}`} />
				</div>
				<div>
					<Typography variant='subtitle2' component='p' className='info-card__subtitle'>
						{subtitle}
					</Typography>
					<Typography id={titleId} variant='h5' className='info-card__title'>
						{title}
					</Typography>
				</div>
			</header>

			<div className='info-card__body'>{body}</div>
		</article>
	)
})

AboutInfoCard.displayName = 'AboutInfoCard'
export default AboutInfoCard
