import { FC, ReactElement } from 'react'
import { Typography } from '@material-ui/core'

type GenericNonBreakingErrArgs = {
	errExplanation: string
}


const GenericNonBreakingErr:FC<GenericNonBreakingErrArgs> = ({ errExplanation }) : ReactElement => {
	return(
		<div style={{width: '100%', marginTop: '3rem', marginBottom: '3rem'}} >
			<Typography align='center' variant='h5' >
				⚠️ There Was An Error Fetching Required Data ⚠️
			</Typography>
			<Typography align='center' variant='h6' >
				{errExplanation}
			</Typography>
		</div>
	)
}


export default GenericNonBreakingErr