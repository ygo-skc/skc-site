import { Typography, Divider } from '@mui/material'
import { FC, ReactNode } from 'react'

type _DBSearchGrouping = {
	group: string
	children: ReactNode
}

const DBSearchGrouping: FC<_DBSearchGrouping> = ({ group, children }) => {
	return (
		<div style={{ padding: '0rem', paddingLeft: '.5rem' }}>
			<Typography variant='subtitle1'>{group}</Typography>
			<Divider />
			{children}
		</div>
	)
}

export default DBSearchGrouping
