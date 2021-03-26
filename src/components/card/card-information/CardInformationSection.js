import React from 'react'
import {Paper} from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'

import Styled from 'styled-components'
import {LightTranslucentDivider} from '../../util/Divider'
import { LightTypography } from '../../util/CustomTypography'

const LightTypographyOverride = Styled(LightTypography)`
	&&
	{
		margin-bottom: 0;
	}
`

const LightTranslucentDividerOverride = Styled(LightTranslucentDivider)`
	&&
	{
		margin-bottom: 1rem;
		margin-top: .8rem;
	}
`

export default function CardInformationSection({ isLoading, hasInfo, infoChips, headerText, noInfoText, background, backgroundImage })
{
	const Parent = Styled(Paper)`
		&&
		{
			background: ${background};
			background-image: ${backgroundImage};
			padding-left: .9rem;
			padding-right: .9rem;
			padding-top: 1.3rem;
			padding-bottom: 1.3rem;
			border-radius: 1.05rem;
		}
	`


	return(
		<Parent>
			{
				(isLoading)?
					<Skeleton width={150} height={25} />
					: <LightTypographyOverride variant='h6' >
						{headerText}
					</LightTypographyOverride>
			}

			<LightTranslucentDividerOverride />

			{
				(isLoading)?
					undefined
					: (hasInfo)?
						infoChips
						: <LightTypographyOverride align='center' variant='subtitle1' >
							{noInfoText}
						</LightTypographyOverride>
			}
		</Parent>
	)
}