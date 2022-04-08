import { Table, TableHead, TableRow, TableBody, TableCell, TableContainer, Box } from '@mui/material'
import '../../css/card-information-styles.css'

function createHeaderRow(headerNames: string[]) {
	return headerNames.map((header: string) => {
		return <TableCell className={'table-cell'}>{header}</TableCell>
	})
}

function createRows(rowValues: string[][], rowOnClick: { (): void }[] = []): JSX.Element[] {
	return rowValues.map((row: string[], index: number) => {
		const columns: JSX.Element[] = row.map((columnValue: string) => {
			return (
				<TableCell key={columnValue} className={'table-cell'}>
					{columnValue}
				</TableCell>
			)
		})

		return rowOnClick.length === 0 ? (
			<TableRow key={index}>{columns}</TableRow>
		) : (
			<TableRow key={index} className={'table-row'} onClick={rowOnClick[index]}>
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
