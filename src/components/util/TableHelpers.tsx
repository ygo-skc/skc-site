import { Table, TableHead, TableRow, TableBody, TableCell, TableContainer, Box } from '@mui/material'
import '../../css/util/table.css'

function createHeaderRow(headerNames: string[]) {
	const columns = headerNames.map((header: string) => {
		return <TableCell>{header}</TableCell>
	})

	return <TableRow className='no-hover'>{columns}</TableRow>
}

function createRows(rowValues: string[][], rowOnClick: { (): void }[] = []): JSX.Element[] {
	return rowValues.map((row: string[], index: number) => {
		const columns: JSX.Element[] = row.map((columnValue: string) => {
			return <TableCell key={columnValue}>{columnValue}</TableCell>
		})

		return rowOnClick.length === 0 ? (
			<TableRow className='no-hover' key={index}>
				{columns}
			</TableRow>
		) : (
			<TableRow className='hover' key={index} onClick={rowOnClick[index]}>
				{columns}
			</TableRow>
		)
	})
}

export default function createTable(headerNames: string[], rowValues: string[][], rowOnClick: { (): void }[] = [], fullWidth: boolean = false): JSX.Element {
	return (
		<TableContainer className={'table-container'} style={fullWidth ? { maxWidth: '100%', margin: '0' } : undefined} component={Box}>
			<Table size='small'>
				<TableHead className={'table-head'}>{createHeaderRow(headerNames)}</TableHead>
				<TableBody>{createRows(rowValues, rowOnClick)}</TableBody>
			</Table>
		</TableContainer>
	)
}

export { createHeaderRow, createRows }
