import { FunctionComponent } from 'react'
import { Typography } from '@mui/material'

const Footer: FunctionComponent = () => {
	return (
		<div className='footer'>
			<div className='footer-wrapper'>
				<Typography className='footer-font' variant='body1' align='center'>
					Copyright 2022
				</Typography>

				<Typography className='footer-font' variant='body1' align='center'>
					Konami Digital Entertainment owns all rights to Yu-Gi-Oh!
				</Typography>

				<br />

				<Typography className='footer-font' variant='body1' align='center'>
					<strong>SKC Web Version:</strong> v{process.env.REACT_APP_VERSION}
				</Typography>
			</div>
		</div>
	)
}

export default Footer
