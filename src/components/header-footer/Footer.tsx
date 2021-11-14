import {FunctionComponent} from 'react'
import {Typography} from '@material-ui/core'


const Footer: FunctionComponent = () =>
{
	return(
		<div className='footer' >
			<div className='footer-wrapper' >
				<Typography
					className='footer-font'
					variant='body1'
					align='center' >
					Copyright 2021
				</Typography>

				<Typography
					className='footer-font'
					variant='body1'
					align='center' >
					Konami Digital Entertainment owns all rights to Yu-Gi-Oh!
				</Typography>

				<br />

				<Typography
					className='footer-font'
					variant='body1'
					align='center' >
					SKC Web Version: <strong>v{ process.env.REACT_APP_VERSION }</strong>
				</Typography>
			</div>
		</div>
	)
}


export default Footer