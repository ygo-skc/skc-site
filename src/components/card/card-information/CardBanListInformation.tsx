import { useEffect, useState, FunctionComponent, startTransition, Fragment, useCallback, JSX } from 'react'
import { Button, ButtonGroup, Typography } from '@mui/material'

import { Dates } from '../../../helper/Dates'

import { AcceptableBanListFormat } from '../../../helper/BanListUtil'
import { DatedListItem, Hint } from 'skc-rcl'

type CardBanListInformationProps = {
	restrictedIn: RestrictedIn
}

type BanListFormatButtonProps = {
	format: AcceptableBanListFormat
	restrictedIn: RestrictedIn
	setFormat: React.Dispatch<React.SetStateAction<AcceptableBanListFormat>>
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

const BanListFormatButton: FunctionComponent<BanListFormatButtonProps> = ({ format, restrictedIn, setFormat }) => {
	const handleButtonClicked = useCallback(() => setFormat(format), [format, setFormat])

	return (
		<Button onClick={handleButtonClicked} disabled={restrictedIn[format].length === 0}>
			{transformFormat(format)} — {restrictedIn[format].length}
		</Button>
	)
}

const CardBanListInformation: FunctionComponent<CardBanListInformationProps> = ({ restrictedIn }) => {
	const initNumItems = 10
	const [banListContent, setBanListContent] = useState<JSX.Element[]>([])
	const [format, setFormat] = useState<AcceptableBanListFormat>(AcceptableBanListFormat.TCG)
	const [loadAll, setLoadAll] = useState(false)

	const loadAllCB = useCallback(() => {
		setLoadAll(true)
	}, [])

	useEffect(() => {
		setFormat(determineFormat(restrictedIn))
	}, [restrictedIn])

	useEffect(() => {
		setLoadAll(restrictedIn[format].length <= initNumItems)
	}, [format])

	useEffect(() => {
		startTransition(() => {
			const content: JSX.Element[] = restrictedIn[format].slice(0, loadAll ? restrictedIn[format].length : initNumItems).map((banList: SKCBanListInstance) => {
				const banListEffectiveDate = Dates.fromYYYYMMDDToDate(banList.banListDate)
				return (
					<DatedListItem
						key={banList.banListDate}
						link={''}
						month={Dates.getMonth(banListEffectiveDate)}
						day={+Dates.getDay(banListEffectiveDate)}
						year={+Dates.getYear(banListEffectiveDate)}
						variant='inline'
						className='aggregate-anchor'
					>
						<div className='list-item-text'>
							<Typography variant='subtitle1'>{banList.banStatus}</Typography>
						</div>
					</DatedListItem>
				)
			})

			setBanListContent(content)
		})
	}, [format, restrictedIn, loadAll])

	return (
		<div className='group'>
			<Typography variant='h4'>Ban Lists</Typography>

			{restrictedIn[format].length !== 0 && (
				<Fragment>
					<ButtonGroup className='ban-list-format-container' fullWidth disableElevation variant='contained' aria-label='Disabled elevation buttons'>
						<BanListFormatButton format={AcceptableBanListFormat.TCG} setFormat={setFormat} restrictedIn={restrictedIn} />
						<BanListFormatButton format={AcceptableBanListFormat.MD} setFormat={setFormat} restrictedIn={restrictedIn} />
						<BanListFormatButton format={AcceptableBanListFormat.DL} setFormat={setFormat} restrictedIn={restrictedIn} />
					</ButtonGroup>

					<div>
						<Typography variant='h5'>Selected Format — {transformFormat(format)}</Typography>
						{banListContent}
						{loadAll ? undefined : <Button onClick={loadAllCB}>Load All</Button>}
					</div>
				</Fragment>
			)}
			{restrictedIn[format].length === 0 && (
				<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white'>
					{'Not Found In Any Ban List'}
				</Hint>
			)}
		</div>
	)
}

export default CardBanListInformation
