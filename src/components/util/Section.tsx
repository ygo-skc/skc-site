import '../../css/util/section.css'

import { FC, ReactNode } from 'react'
import { Typography } from '@mui/material'

type SectionType = {
	sectionName: string
	sectionContent: ReactNode
}

const Section: FC<SectionType> = ({ sectionName, sectionContent }) => {
	return (
		<div className='section-parent heavy-shadow'>
			<div className='section-header-container'>
				<Typography variant='h1' align='center' className='section-header-text'>
					{sectionName}
				</Typography>
			</div>

			{sectionContent}
		</div>
	)
}

export default Section
