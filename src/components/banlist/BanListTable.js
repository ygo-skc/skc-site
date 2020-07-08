import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Table, TableHead, TableContainer, Paper, TableCell, TableBody, Typography } from '@material-ui/core'
import TableRow from '@material-ui/core/TableRow'

import cardStyles from '../card/YGOCardStyles'

const StyledTableHeadCell = withStyles(theme => ({
	body: {
		color: '#fff'
	}
}))(TableCell)


const BanListTable = ( {isDataLoaded, bannedContent, contentTitle, contentExplanation, contentColor, cardClicked} ) => {
	const [tableContent, setTableContent] = useState([])


	useEffect(() => {
		if (isDataLoaded === true)
		{
			const tableContent = []
			bannedContent.forEach(forbiddenCard => {

				const StyledTableRow = withStyles({
					'hover': {
						background: cardStyles[ `${forbiddenCard.cardColor.toLowerCase()}TableBackground` ]
						, cursor: 'pointer'
						, '&&:hover': {
							backgroundColor: '#456'
						}
					}
				})(TableRow)

				tableContent.push(
					<StyledTableRow
						hover
						onClick={ () => cardClicked(forbiddenCard.cardID) }
						>
						<StyledTableHeadCell>{ forbiddenCard.cardName }</StyledTableHeadCell>
						<StyledTableHeadCell>{ forbiddenCard.cardID }</StyledTableHeadCell>
						<StyledTableHeadCell>{ forbiddenCard.monsterType }</StyledTableHeadCell>
					</StyledTableRow>
				)
			})

			setTableContent(tableContent)
		}
	}, [ isDataLoaded ])

	return (
		<TableContainer
			component={ Paper }
			style={{paddingTop: '.75rem'}}
			>
			<Typography
				variant='h5'
				style={{ paddingLeft: '.4rem', color: contentColor, textAlign: 'center' }}
				>
				{ contentTitle }
			</Typography>
			<Typography
				variant='subtitle1'
				style={{ paddingLeft: '.4rem', textAlign: 'center'  }}
				>
				{ contentExplanation }
			</Typography>

			<br />

			<Table
				stickyHeader={true}
				>
				<TableHead>
					<TableRow>
						<TableCell>Card Name</TableCell>
						<TableCell>Card ID</TableCell>
						<TableCell>Type</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{ tableContent }
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default BanListTable