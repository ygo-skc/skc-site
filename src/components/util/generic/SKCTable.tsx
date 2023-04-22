import { TableContainer, Box, TableHead, TableBody, Table, TableCell, TableRow } from '@mui/material'
import { FC, memo, useCallback } from 'react'

import '../../../css/util/generic/table.css'

export type SKCTableProps = {
	header: string[]
	rows: string[][]
	rowActions?: { (): void }[]
	fullWidth?: boolean
}

const SKCTable: FC<SKCTableProps> = ({ header: headerNames, rows: rowValues, rowActions: rowOnClick = [], fullWidth = false }) => {
	const createHeaderRow = useCallback((): JSX.Element => {
		const columns = headerNames.map((header: string) => {
			return <TableCell key={header}>{header}</TableCell>
		})

		return (
			<TableRow key='header' className='no-hover'>
				{columns}
			</TableRow>
		)
	}, [headerNames])

	const createRows = useCallback((): JSX.Element[] => {
		return rowValues.map((row: string[], index: number) => {
			const columns: JSX.Element[] = row.map((columnValue: string) => {
				return <TableCell key={columnValue}>{columnValue}</TableCell>
			})

			const rowKey = row.toString()

			return rowOnClick.length === 0 ? (
				<TableRow className='no-hover' key={rowKey}>
					{columns}
				</TableRow>
			) : (
				<TableRow className='hover' key={rowKey} onClick={rowOnClick[index]}>
					{columns}
				</TableRow>
			)
		})
	}, [rowOnClick, rowValues])

	return (
		<TableContainer className={'table-container'} style={fullWidth ? { maxWidth: '100%', margin: '0' } : undefined} component={Box}>
			<Table size='small'>
				<TableHead className={'table-head'}>{createHeaderRow()}</TableHead>
				<TableBody>{createRows()}</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(SKCTable, (prevProps, nextProps) => {
	if (
		prevProps.header.length !== nextProps.header.length ||
		prevProps.rows.length !== nextProps.rows.length ||
		prevProps.rowActions?.length !== nextProps.rowActions?.length ||
		prevProps.fullWidth !== nextProps.fullWidth
	)
		return false
	return true
})
