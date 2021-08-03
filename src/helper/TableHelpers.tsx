import React from 'react'
import {Table, TableHead, TableRow, TableBody, TableCell, TableContainer, Box} from '@material-ui/core'


function createHeaderRow(headerNames: string[]) {
	return headerNames.map( (header: string) => {
		return <TableCell className={'table-cell'} >{header}</TableCell>
	})
}


function createRows(rowValues: string[][]): JSX.Element[] {
	return rowValues.map( (row: string[]) => {
		const columns: JSX.Element[] = row.map( (value: string) => {
			return <TableCell className={'table-cell'} >{value}</TableCell>
		})

		return (
			<TableRow>
				{columns}
			</TableRow>
		)
	})
}


export default function createTable(headerNames: string[], rowValues: string[][]): JSX.Element {
	return <TableContainer className={'table-container'} component={Box} >
			<Table size='small' >
				<TableHead className={'table-head'} >
					<TableRow>
						{createHeaderRow(headerNames)}
					</TableRow>
				</TableHead>
				<TableBody>
					{createRows(rowValues)}
				</TableBody>
			</Table>
		</TableContainer>
}

export {createHeaderRow, createRows}