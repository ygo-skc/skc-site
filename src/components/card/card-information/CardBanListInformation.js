import React, { useEffect, useState } from 'react'
import {Paper, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Box} from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'

import Styled from 'styled-components'
import {LightTranslucentDivider} from '../../util/Divider'
import { LightTypography } from '../../util/CustomTypography'

import { getDateString, months } from '../../../helper/Dates'
import {Hint} from '../../util/Hints'


const LightTypographyOverride = Styled(LightTypography)`
	&&
	{
		margin-bottom: 0;
	}
`

const LightTranslucentDividerOverride = Styled(LightTranslucentDivider)`
	&&
	{
		margin-top: 0;
		margin-bottom: 1.5rem;
		width: 97%;
	}
`


const StyledTableContainer = Styled(TableContainer)`
	&&
	{
		border-radius: 1.1rem;
		background: rgba(0, 0, 0, 0.3);
		color: rgba(255, 255, 255, .97);
		max-width: 97%;
		margin: auto;
	}
`


const StyledTableCell = Styled(TableCell)`
	&&
	{
		color: rgba(255, 255, 255, .97);
	}
`

export default function CardBanListInformation({ isLoading, hasInfo, headerText, noInfoText, background, backgroundImage, cardInfo })
{

	const [productTable, setProductTable] = useState(undefined)

	useEffect(() => {
		console.log('card info is', cardInfo)

		if (cardInfo === null || cardInfo === undefined || cardInfo.length === 0) return

		const productTable = <StyledTableContainer component={Box} >
			<Table size='small' >
				<TableHead style={{background: 'rgba(0, 0, 0, 0.3)'}}>
					<TableRow>
						<StyledTableCell >Date</StyledTableCell>
						<StyledTableCell>Status</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						cardInfo.map( (banList) => (
							<TableRow>
								<StyledTableCell>{ getDateString(months, new Date(banList.banListDate)) }</StyledTableCell>
								<StyledTableCell>{banList.banStatus}</StyledTableCell>
							</TableRow>
						))
					}
				</TableBody>
			</Table>
		</StyledTableContainer>

		setProductTable(productTable)
	}, [cardInfo])

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
						productTable
						: <Hint text={noInfoText} variant='subtitle1' backgroundColor='rgba(0, 0, 0, 0.3)' textColor='white'>
							{noInfoText}
						</Hint>
			}
		</Parent>
	)
}