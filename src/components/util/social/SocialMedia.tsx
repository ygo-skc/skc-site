import { Fragment, FunctionComponent } from 'react'
import { Typography } from '@mui/material'

const SocialMedia: FunctionComponent = () => {
	return (
		<Fragment>
			<Typography variant='h6'>Join The Discord</Typography>
			<Typography variant='body1'>
				Use Discord to chat with others within the community. This is my personal server I use with friends. There are chats for you fine people there too! Lets grow the community!
			</Typography>
			<br />

			<iframe
				title='Discord Widget'
				style={{ borderStyle: 'solid', borderRadius: '1rem' }}
				src='https://discord.com/widget?id=659477868799197185&theme=light'
				width='100%'
				height='300'
				sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'
			/>
		</Fragment>
	)
}

export default SocialMedia
