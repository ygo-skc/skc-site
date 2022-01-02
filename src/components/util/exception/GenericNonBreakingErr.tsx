import { FC, ReactElement } from 'react'
import { Typography } from '@mui/material'

type GenericNonBreakingErrArgs = {
	errExplanation: string
}

const GenericNonBreakingErr: FC<GenericNonBreakingErrArgs> = ({ errExplanation }): ReactElement => {
	return (
		<div style={{ width: '100%' }}>
			<Typography align='center' variant='h5'>
				⚠️
				<br />
				<br />
				There Was An Error Fetching Required Data
			</Typography>
			<Typography align='center' variant='h6'>
				{errExplanation}
			</Typography>
		</div>
	)
}

export default GenericNonBreakingErr
