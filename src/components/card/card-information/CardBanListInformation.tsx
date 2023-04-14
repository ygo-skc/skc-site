import { useEffect, useState, FunctionComponent, startTransition, Fragment, useCallback } from 'react'
import { Button, ButtonGroup, Typography } from '@mui/material'

import '../../../css/card/card-information-styles.css'

import { Dates } from '../../../helper/Dates'

import { AcceptableBanListFormat } from '../../../helper/BanListUtil'
import { Hint } from 'skc-rcl'
import SKCTable from '../../util/generic/SKCTable'

type Args = {
	isLoading: boolean
	restrictedIn: RestrictedIn
}

type BanListFormatButtonArgs = {
	format: AcceptableBanListFormat
	restrictedIn: RestrictedIn
	setFormat: any
}

function determineFormat(restrictedIn: RestrictedIn): AcceptableBanListFormat {
	if (restrictedIn['TCG'].length !== 0) {
		return AcceptableBanListFormat.TCG
	} else if (restrictedIn['MD'].length !== 0) {
		return AcceptableBanListFormat.MD
	} else {
		return AcceptableBanListFormat.DL
	}
}

function transformFormat(format: AcceptableBanListFormat) {
	switch (format) {
		case 'TCG':
			return 'TCG'
		case 'MD':
			return 'Master Duel'
		case 'DL':
			return 'Duel Links'
	}
}

const BanListFormatButton: FunctionComponent<BanListFormatButtonArgs> = ({ format, restrictedIn, setFormat }) => {
	const handleButtonClicked = useCallback(() => setFormat(format), [format, setFormat])

	return (
		<Button onClick={handleButtonClicked} disabled={restrictedIn[format].length === 0}>
			{transformFormat(format)} — {restrictedIn[format].length}
		</Button>
	)
}

const CardBanListInformation: FunctionComponent<Args> = ({ isLoading, restrictedIn }) => {
	const [banListTable, setBanListTable] = useState<JSX.Element | undefined>(undefined)
	const [format, setFormat] = useState<AcceptableBanListFormat>(determineFormat(restrictedIn))

	useEffect(() => {
		if (isLoading) return

		startTransition(() => {
			const headerNames: string[] = ['Date', 'Status']
			const rowValues: string[][] = restrictedIn[format].map((banList: SKCBanListInstance) => [Dates.fromYYYYMMDDToDateStr(banList.banListDate), banList.banStatus])

			const table: JSX.Element = <SKCTable headerNames={headerNames} rowValues={rowValues} />
			setBanListTable(table)
		})
	}, [isLoading, format, restrictedIn])

	return (
		<div className='group'>
			<Typography variant='h4'>Ban Lists</Typography>

			{!isLoading && restrictedIn[format].length !== 0 && (
				<Fragment>
					<ButtonGroup className='ban-list-format-container' fullWidth disableElevation variant='contained' aria-label='Disabled elevation buttons'>
						<BanListFormatButton format={AcceptableBanListFormat.TCG} setFormat={setFormat} restrictedIn={restrictedIn} />
						<BanListFormatButton format={AcceptableBanListFormat.MD} setFormat={setFormat} restrictedIn={restrictedIn} />
						<BanListFormatButton format={AcceptableBanListFormat.DL} setFormat={setFormat} restrictedIn={restrictedIn} />
					</ButtonGroup>

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
