import '../../css/nav/messages.css'
import { Typography } from '@material-ui/core'

function MessageFetchingError() {
	return(
		<div>
			<Typography className='communication-message-header' variant='h5'>Could Not Retrieve Messages From Server</Typography>
			<Typography className='communication-message-sub-header' variant='subtitle2' >
				There might be an issue with the server.
			</Typography>
		</div>
	)
}


export default MessageFetchingError