import React, { useEffect, useState } from 'react'
import {Paper, TableContainer, Table, TableHead, TableRow, TableBody, TableCell} from '@material-ui/core'
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


const StyledTableContainer = Styled(TableContainer)`
	&&
	{
		border-radius: 1.1rem;
		padding-bottom: 1rem;
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


const StyledTableRow = Styled(TableRow)`
	&&
	{
		&:hover
		{
			cursor: pointer;
			background: rgba(0, 0, 0, 0.2);
		}
	}
`

export default function CardProductInformation({ isLoading, hasInfo, headerText, noInfoText, background, backgroundImage, cardInfo, cardID })
{

	const [productTable, setProductTable] = useState(undefined)

	useEffect(() => {

		if (cardInfo === null || cardInfo === undefined || cardInfo.length === 0) return

		const productTable = <StyledTableContainer component={Paper} >
			<Table size='small' >
				<TableHead style={{background: 'rgba(0, 0, 0, 0.3)'}}>
					<TableRow>
						<StyledTableCell >ID</StyledTableCell>
						<StyledTableCell>Release Date</StyledTableCell>
						<StyledTableCell>Position</StyledTableCell>
						<StyledTableCell>Rarities</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						cardInfo.map( (product) => (
							product.productContent.map( (content) => (
								<StyledTableRow onClick={ () => setTimeout( () => window.location.assign(`/product/${product.productId}#${cardID}`), 150 ) }>
									<StyledTableCell>{product.productId}</StyledTableCell>
									<StyledTableCell>{product.productReleaseDate}</StyledTableCell>
									<StyledTableCell>{content.productPosition}</StyledTableCell>
									<StyledTableCell>{content.rarities.join(', ')}</StyledTableCell>
								</StyledTableRow>
							))
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
						: <LightTypographyOverride align='center' variant='subtitle1' >
							{noInfoText}
						</LightTypographyOverride>
			}
		</Parent>
	)
}