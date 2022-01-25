import '../../css/util/section.css'

import { FC, ReactNode } from 'react'
import { Typography } from '@mui/material'

import '../../css/ygo-card-styles.css'

type SectionType = {
	sectionName: string
	sectionContent: ReactNode
	sectionHeaderBackground?: cardColor | 'default' | 'ban-list' | 'product' | ''
	sticky?: boolean
	maxWidth?: string
}

const Section: FC<SectionType> = ({ sectionName, sectionContent, sectionHeaderBackground = 'default', sticky = false, maxWidth = '100%' }) => {
	let sectionHeaderBackgroundClass = ''

	if (sectionHeaderBackground !== undefined && sectionHeaderBackground !== '') {
		sectionHeaderBackgroundClass =
			sectionHeaderBackground === 'default' || sectionHeaderBackground === 'ban-list' || sectionHeaderBackground === 'product'
				? `${sectionHeaderBackground}-section-header-container`
				: `${sectionHeaderBackground}-ygo-card-style`
	}

	const stickyClass = sticky ? 'sticky' : ''

	return (
		<div style={{ maxWidth: maxWidth }} className={`section-parent heavy-shadow ${stickyClass}`}>
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
