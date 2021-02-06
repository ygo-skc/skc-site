import React from 'react'
import {Paper, Typography} from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'

import Styled from 'styled-components'
import {LightTranslucentDivider} from '../util/Divider'

export default function CardInformationSection({ isLoading, hasInfo, infoChips, headerText, noInfoText, background, backgroundImage })
{
	const StyledPaper = Styled(Paper)`
		&&
		{
			background: ${background};
			background-image: ${backgroundImage};
			padding-left: .5rem;
			padding-right: .5rem;
			padding-top: 2.25rem;
			padding-bottom: 2.25rem;
			text-align: center;
			border-radius: .7rem;
		}
	`


	return(
		<StyledPaper >
			{
				(isLoading)?
					<Skeleton width={150} height={25} style={{margin: 'auto'}}  />
					: <Typography variant='h6' align='center' style={{color: '#fff', marginBottom: '0rem'}} >
						{headerText}
					</Typography>
			}
			<LightTranslucentDivider />
			{
				(isLoading)?
					undefined
					: (hasInfo)?
						infoChips
						: <Typography style={{ color: '#fff' }} align='center' variant='subtitle1' >
							{noInfoText}
						</Typography>
			}
		</StyledPaper>
	)
}