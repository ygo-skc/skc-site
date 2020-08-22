import React, { useState, useEffect } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Paper, Typography } from '@material-ui/core'

import Breadcrumb from '../Breadcrumb'
import { MainContentContainer } from '../MainContent'
import OneThirdTwoThirdsGrid from '../grid/OneThirdTwoThirdsGrid'

import Styled from 'styled-components'

const MainBrowseInfoTypography = Styled(Typography)`
	&&
	{
		color: rgba(255, 255, 255, .95);
	}
`

export default function ProductBrowse()
{
	return (
		<MainContentContainer style={{}} >
			<Breadcrumb crumbs={ ['Home', 'Browse'] } />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={

					<Paper style={{padding: '1.4rem', background: '#a4508', backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)' }} >
						<MainBrowseInfoTypography variant='h4'>Product Browse Tool</MainBrowseInfoTypography>
					</Paper>
				}
				twoThirdComponent={undefined}
			/>
		</MainContentContainer>
	)
}