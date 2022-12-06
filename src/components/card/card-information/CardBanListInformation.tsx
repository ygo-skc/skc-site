import { useEffect, useState, FunctionComponent, startTransition, Fragment } from 'react'
import { Button, ButtonGroup, Typography } from '@mui/material'

import '../../../css/card-information-styles.css'

import { Dates } from '../../../helper/Dates'
import Hint from '../../util/Hints'

import createTable from '../../util/TableHelpers'

type args = {
	isLoading: boolean
	restrictedIn: RestrictedIn
}

function determineFormat(restrictedIn: RestrictedIn): BanListFormat {
	if (restrictedIn['TCG'].length !== 0) {
		return 'TCG'
	} else if (restrictedIn['MD'].length !== 0) {
		return 'MD'
	} else {
		return 'DL'
	}
}

function transformFormat(format: BanListFormat) {
	switch (format) {
		case 'TCG':
			return 'TCG'
		case 'MD':
			return 'Master Duel'
		case 'DL':
			return 'Duel Links'
	}
}

const CardBanListInformation: FunctionComponent<args> = ({ isLoading, restrictedIn }) => {
	const [banListTable, setBanListTable] = useState<JSX.Element | undefined>(undefined)
	const [format, setFormat] = useState<BanListFormat>(determineFormat(restrictedIn))

	const CreateButton = (format: BanListFormat) => {
		return (
			<Button onClick={() => setFormat(format)} disabled={restrictedIn[format].length === 0}>
				{transformFormat(format)} — {restrictedIn[format].length}
			</Button>
		)
	}

	useEffect(() => {
		if (isLoading) return

		startTransition(() => {
			const headerNames: string[] = ['Date', 'Status']
			const rowValues: string[][] = restrictedIn[format].map((banList: SKCBanListInstance) => [Dates.fromYYYYMMDDToDateStr(banList.banListDate), banList.banStatus])

			const table: JSX.Element = createTable(headerNames, rowValues)
			setBanListTable(table)
		})
	}, [isLoading, format])

	return (
		<div className='group'>
			<Typography variant='h4'>Ban Lists</Typography>

			<ButtonGroup className='ban-list-format-container' fullWidth disableElevation variant='contained' aria-label='Disabled elevation buttons'>
				{CreateButton('TCG')}
				{CreateButton('MD')}
				{CreateButton('DL')}
			</ButtonGroup>

			{!isLoading && restrictedIn[format].length !== 0 && (
				<Fragment>
					<Typography variant='h5'>Selected Format — {transformFormat(format)}</Typography>
					{banListTable}
				</Fragment>
			)}
			{!isLoading && restrictedIn[format].length === 0 && (
				<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white'>
					{'Not Found In Any Ban List'}
				</Hint>
			)}
		</div>
	)
}

export default CardBanListInformation
