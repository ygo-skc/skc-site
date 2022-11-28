import { useEffect, useState, FunctionComponent } from 'react'
import { Typography } from '@mui/material'

import '../../../css/card-information-styles.css'

import { Dates } from '../../../helper/Dates'
import { Hint } from '../../util/Hints'

import createTable from '../../util/TableHelpers'

type args = {
	isLoading: boolean
	hasInfo: boolean
	banListInfo: BanListInfo[]
}

type BanListInfo = {
	banListDate: string
	banStatus: string
}

const CardBanListInformation: FunctionComponent<args> = ({ isLoading, hasInfo, banListInfo }) => {
	const [banListTable, setBanListTable] = useState<JSX.Element | undefined>(undefined)

	useEffect(() => {
		if (banListInfo === null || banListInfo === undefined || banListInfo.length === 0) return

		const headerNames: string[] = ['Date', 'Status']
		const rowValues: string[][] = banListInfo.map((banList: BanListInfo) => [Dates.fromYYYYMMDDToDateStr(banList.banListDate), banList.banStatus])

		const table: JSX.Element = createTable(headerNames, rowValues)
		setBanListTable(table)
	}, [banListInfo])

	return (
		<div className='group'>
			<Typography variant='h4'>Ban Lists</Typography>
			{!isLoading && hasInfo ? (
				banListTable
			) : (
				<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white'>
					{'Not Found In Any Ban List'}
				</Hint>
			)}
		</div>
	)
}

export default CardBanListInformation
