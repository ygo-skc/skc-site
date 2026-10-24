import { useEffect, useState, FunctionComponent, startTransition, Fragment, useCallback, JSX } from 'react'
import { Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

import * as Dates from '../../../helper/Dates'

import { AcceptableBanListFormat } from '../../../helper/BanListUtil'
import { DatedListItem, Hint } from 'skc-rcl'

type CardBanListInformationProps = {
	restrictedIn: YGOCard.Restrictions
}

function determineFormat(restrictedIn: YGOCard.Restrictions): AcceptableBanListFormat {
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

const FORMATS = [AcceptableBanListFormat.TCG, AcceptableBanListFormat.MD, AcceptableBanListFormat.DL]

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
			const content: JSX.Element[] = restrictedIn[format].slice(0, loadAll ? restrictedIn[format].length : initNumItems).map((banList: YGOCard.RestrictionStatus) => {
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
			<Typography variant='h4'>Ban Lists ({restrictedIn.TCG.length + restrictedIn.MD.length + restrictedIn.DL.length})</Typography>

			{restrictedIn[format].length !== 0 && (
				<Fragment>
					{/* segmented control - a white lens marks the selected format, a format with no ban lists can't be picked */}
					<ToggleButtonGroup
						className='ban-list-format-container'
						fullWidth
						exclusive
						size='small'
						aria-label='Ban list format'
						value={format}
						onChange={(_, value: AcceptableBanListFormat | null) => value && setFormat(value)}
					>
						{FORMATS.map((f) => (
							<ToggleButton key={f} value={f} disabled={restrictedIn[f].length === 0}>
								{transformFormat(f)} — {restrictedIn[f].length}
							</ToggleButton>
						))}
					</ToggleButtonGroup>

					<div>
						<Typography variant='h5'>Selected Format — {transformFormat(format)}</Typography>
						{banListContent}
						{loadAll ? undefined : <Button onClick={loadAllCB}>Load All</Button>}
					</div>
				</Fragment>
			)}
			{restrictedIn[format].length === 0 && (
				<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white' fullWidth={false}>
					{'Not Found In Any Ban List'}
				</Hint>
			)}
		</div>
	)
}

export default CardBanListInformation
