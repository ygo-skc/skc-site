import '../../css/util/section.css'

import { FC, ReactNode } from 'react'
import { Paper, Typography } from '@material-ui/core'

type SectionType = {
	sectionName: string,
	sectionContent: ReactNode
}


const Section:FC<SectionType> = ({ sectionName, sectionContent }) => {
	return(
		<Paper className='section-parent' >
			<div className='section-header-container' >
				<Typography variant='h1' className='section-header-text' >
					{sectionName}
				</Typography>
			</div>

			{sectionContent}
		</Paper>
	)
}

export default Section