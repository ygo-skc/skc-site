import React from 'react'
import {Paper, Typography} from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'

import Styled from 'styled-components'


export default function CardInformationSection({ isLoading, hasInfo, infoChips, headerText, noInfoText, background, backgroundImage })
{
	const StyledPaper = Styled(Paper)`
		&&
		{
			background: ${background};
			background-image: ${backgroundImage};
			padding: 1.5rem;
		}
	`


	return(
		<StyledPaper >
			{
				(isLoading)?
					<Skeleton width={150} height={25} style={{margin: 'auto'}}  />
					: <Typography variant='subtitle1' align='center' style={{color: '#fff'}} >
						{headerText}
					</Typography>
			}
			<br />
			{
				(isLoading)?
					undefined
					: (hasInfo)?
						infoChips
						: <Typography style={{ color: '#fff' }} align='center' variant='subtitle2' >
							{noInfoText}
						</Typography>
			}
		</StyledPaper>
	)
}