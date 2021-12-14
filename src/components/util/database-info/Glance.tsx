import { Typography, Box } from '@mui/material'
import { FC } from 'react'
import styled from 'styled-components'

const Container = styled(Box)`
	&& {
		padding: 1rem;
		border-radius: 1.5rem;
		flex: 1;
		background: white;
		border-color: rgb(93, 90, 107);
		border-style: solid;
		border-width: 1px;
		animation: pulse-animation 1.8s infinite;

		:hover {
			cursor: pointer;
			transform: scale(1.02);
		}

		@keyframes pulse-animation {
			0% {
				box-shadow: 0 0 0 0rem rgba(255, 184, 136, 0.4);
			}
			25% {
				box-shadow: 0 0 0 0.4rem rgba(255, 184, 136, 0.2);
			}
			50% {
				box-shadow: 0 0 0 0.75rem rgba(255, 184, 136, 0);
			}
		}
	}
`

type _DatabaseInfo = {
	total: number
	subject: string
	color: string
	action: any
}

const DatabaseInfo: FC<_DatabaseInfo> = ({ total, subject, color, action }) => {
	return (
		<Container onClick={() => action()}>
			<Typography variant='h1' align='center' style={{ color: '#626262' }}>
				{total}
			</Typography>
			<Typography variant='h5' align='center' style={{ color: color }}>
				{subject}
			</Typography>
		</Container>
	)
}

export default DatabaseInfo
