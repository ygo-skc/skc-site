import '../../../css/main-pages/ban-list.css'

import { FC } from 'react'
import { Chip } from '@mui/material'

import { BanStatus, banStatusClass, toBanStatus } from '../../../helper/BanStatus'

// a status chip in ban-list.css's tint for that status - the API's spelling as is when it isn't a known status
const BanStatusChip: FC<{ status: BanStatus | string }> = ({ status }) => {
	const known = toBanStatus(status)
	return <Chip className={`ban-status-chip ${known ? banStatusClass(known) : ''}`} label={known ?? status} />
}

export default BanStatusChip
