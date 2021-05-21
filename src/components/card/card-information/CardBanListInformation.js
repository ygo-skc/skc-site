import React, { useEffect, useState } from 'react'
import '../../../css/card-information-styles.css'
import {Paper, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Box} from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'

import Styled from 'styled-components'
import {LightTranslucentDivider} from '../../util/Divider'
import { LightTypography } from '../../util/CustomTypography'

import { getDateString, months } from '../../../helper/Dates'
import {Hint} from '../../util/Hints'



export default function CardBanListInformation({ isLoading, hasInfo, headerText, noInfoText, background, backgroundImage, cardInfo })
{

	const [productTable, setProductTable] = useState(undefined)

	useEffect(() => {
		console.log('card info is', cardInfo)

		if (cardInfo === null || cardInfo === undefined || cardInfo.length === 0) return

		const productTable = <TableContainer className={'table-container'} component={Box} >
			<Table size='small' >
				<TableHead className={'table-head'} >
					<TableRow>
						<TableCell className={'table-cell'} >Date</TableCell>
						<TableCell className={'table-cell'} >Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						cardInfo.map( (banList) => (
							<TableRow>
								<TableCell className={'table-cell'} >{ getDateString(months, new Date(banList.banListDate)) }</TableCell>
								<TableCell className={'table-cell'} >{banList.banStatus}</TableCell>
							</TableRow>
						))
					}
				</TableBody>
			</Table>
		</TableContainer>

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
					: <LightTypography variant='h6' className={'card-info-header'} >
						{headerText}
					</LightTypography>
			}

			<LightTranslucentDivider className={'divider'} />

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