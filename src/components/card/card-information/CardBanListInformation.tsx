import { useEffect, useState, FunctionComponent } from 'react'
import '../../../css/card-information-styles.css'
import { Paper, Skeleton, Typography } from '@mui/material'

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
		const rowValues: string[][] = banListInfo.map((banList: BanListInfo) => [Dates.getDateString(new Date(banList.banListDate)), banList.banStatus])

		const banListTable: JSX.Element = createTable(headerNames, rowValues)

		setBanListTable(banListTable)
	}, [banListInfo])

	return (
		<Paper className={'ban-lists card-info-section'}>
			{isLoading ? (
				<Skeleton width={150} height={25} />
			) : (
				<Typography variant='h4' className={'card-info-header'}>
					{'Ban Lists'}
				</Typography>
			)}

			{isLoading ? undefined : hasInfo ? (
				banListTable
			) : (
				<Hint backgroundColor='rgba(0, 0, 0, 0.3)' textColor='white'>
					{'Not Found In Any Ban List'}
				</Hint>
			)}
		</Paper>
	)
}

export default CardBanListInformation
