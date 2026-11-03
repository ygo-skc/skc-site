import { FC } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

// clearing the list can't be undone, so it asks first
const StartOverDialog: FC<{ open: boolean; onClose: () => void; onConfirm: () => void }> = ({ open, onClose, onConfirm }) => (
	<Dialog open={open} onClose={onClose} className='start-over-dialog' aria-labelledby='start-over-title'>
		<DialogTitle id='start-over-title' variant='h5' component='h2'>
			Start a new tier list?
		</DialogTitle>
		<DialogContent>
			<Typography variant='body1'>This clears the name, the tray and every tier on this device.</Typography>
		</DialogContent>
		<DialogActions>
			<Button className='start-over-dialog__cancel' onClick={onClose}>
				Cancel
			</Button>
			<Button className='start-over-dialog__confirm' variant='contained' onClick={onConfirm}>
				Start over
			</Button>
		</DialogActions>
	</Dialog>
)

export default StartOverDialog
