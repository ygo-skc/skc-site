import React from 'react'

import { Typography } from '@material-ui/core'

import { RightBoxHeaderTypography, RightBoxSubHeaderTypography } from './util/grid/OneThirdTwoThirdsGrid'

export default function()
{
	return(
		<div>
			<RightBoxHeaderTypography variant='h4' >
				Social
			</RightBoxHeaderTypography>
			<RightBoxSubHeaderTypography variant='h5'>
				Join The Discord
			</RightBoxSubHeaderTypography>

			<Typography variant='body1' >
				Use Discord to chat with others within the community. This is my personal server I use with friends. There are chats for you fine people there too! Lets grow the community!
			</Typography>
			<br />

			<div style={{borderStyle: 'solid', borderColor: '#543fda', borderWidth: '.25rem', borderRadius: '1.1rem'}}>
				<iframe style={{borderStyle: 'solid', borderRadius: '1rem'}} src="https://discord.com/widget?id=659477868799197185&theme=light" width="100%" height="400" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
			</div>
		</div>
	)
}