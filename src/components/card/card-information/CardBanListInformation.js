import React, { useEffect, useState } from 'react'
import '../../../css/card-information-styles.css'
import {Paper, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Box} from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'

import {LightTranslucentDivider} from '../../util/Divider'
import { LightTypography } from '../../util/CustomTypography'

import { getDateString, months } from '../../../helper/Dates'
import {Hint} from '../../util/Hints'



export default function CardBanListInformation({ isLoading, hasInfo, cardInfo })
{

	const [productTable, setProductTable] = useState(undefined)

	useEffect(() => {
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


	return(
		<Paper className={'ban-lists card-info-section'} >
			{
				(isLoading)?
					<Skeleton width={150} height={25} />
					: <LightTypography variant='h6' className={'card-info-header'} >
						{'Ban Lists'}
					</LightTypography>
			}

			<LightTranslucentDivider className={'divider'} />

			{
				(isLoading)?
					undefined
					: (hasInfo)?
						productTable
						: <Hint text='Not Found In Any Ban List' variant='subtitle1' backgroundColor='rgba(0, 0, 0, 0.3)' textColor='white'>
							{'Not Found In Any Ban List'}
						</Hint>
			}
		</Paper>
	)
}