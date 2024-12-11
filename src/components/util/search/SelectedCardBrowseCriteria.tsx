import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { FC, JSX, useEffect, useState } from 'react'

const SelectedCardBrowseCriteria: FC<{ selectedCriteria: BrowseCriteria[] }> = ({ selectedCriteria }) => {
	const [selectedCriteriaChips, setSelectedCriteriaChips] = useState<JSX.Element[]>([])

	useEffect(() => {
		if (selectedCriteria === undefined) return

		const criteriaChips = selectedCriteria.map((criteria: BrowseCriteria) => {
			return <Chip key={criteria.value} label={criteria.value} style={{ background: 'rgba(107, 52, 91, .8)' }} />
		})

		setSelectedCriteriaChips(criteriaChips)
	}, [selectedCriteria])

	return (
		<div style={{ marginBottom: '.75rem' }}>
			{selectedCriteriaChips.length === 0 ? (
				<Typography variant='h5' align='center'>
					No Criteria Specified
				</Typography>
			) : (
				selectedCriteriaChips
			)}
		</div>
	)
}

export default SelectedCardBrowseCriteria
