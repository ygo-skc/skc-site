import '../../css/util/section.css'

import { FC, ReactNode } from 'react'
import { Typography } from '@mui/material'

import '../../css/ygo-card-styles.css'

type SectionType = {
	sectionName: string
	sectionContent: ReactNode
	sectionHeaderBackground?: cardColor | 'default' | ''
}

const Section: FC<SectionType> = ({ sectionName, sectionContent, sectionHeaderBackground = 'default' }) => {
	let sectionHeaderBackgroundClass = ''

	if (sectionHeaderBackground !== undefined && sectionHeaderBackground !== '') {
		sectionHeaderBackgroundClass = sectionHeaderBackground === 'default' ? 'default-section-header-container' : `${sectionHeaderBackground}-ygo-card-style`
	}

	console.log(sectionHeaderBackground)

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
