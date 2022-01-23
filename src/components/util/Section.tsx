import '../../css/util/section.css'

import { FC, ReactNode } from 'react'
import { Typography } from '@mui/material'

import '../../css/ygo-card-styles.css'

type SectionType = {
	sectionName: string
	sectionContent: ReactNode
	sectionHeaderBackground?: cardColor | '' | undefined
}

const Section: FC<SectionType> = ({ sectionName, sectionContent, sectionHeaderBackground = '' }) => {
	const sectionHeaderBackgroundClass = sectionHeaderBackground === '' ? 'default-section-header-container' : `${sectionHeaderBackground}-ygo-card-style`

	return (
		<div className='section-parent heavy-shadow '>
			<div className={`section-header-container ${sectionHeaderBackgroundClass}`}>
				<Typography variant='h1' align='center' className='section-header-text'>
					{sectionName}
				</Typography>
			</div>

			{sectionContent}
		</div>
	)
}

export default Section
