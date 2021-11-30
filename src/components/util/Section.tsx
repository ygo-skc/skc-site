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
			<div style={{background: '#5D5A6B', color: 'white', borderTopLeftRadius: '1.75rem', borderTopRightRadius: '1.75rem'}}>
				<Typography variant='h2' style={{color: 'white', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem'}} >
					{sectionName}
				</Typography>
			</div>

			{sectionContent}
		</Paper>
	)
}

export default Section