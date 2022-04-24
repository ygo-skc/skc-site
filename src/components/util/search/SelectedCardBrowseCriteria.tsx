import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { FC, useEffect, useState } from 'react'

const SelectedCardBrowseCriteria: FC<{ selectedCriteria: BrowseCriteria[] }> = ({ selectedCriteria }) => {
	const [selectedCriteriaChips, setSelectedCriteriaChips] = useState<JSX.Element[]>([])

	useEffect(() => {
		if (selectedCriteria === undefined) return

		const criteriaMap = new Map()
		criteriaMap.set('cardColors', [])
		criteriaMap.set('attributes', [])
		criteriaMap.set('monsterTypes', [])
		criteriaMap.set('monsterSubTypes', [])
		criteriaMap.set('levels', [])
		criteriaMap.set('ranks', [])
		criteriaMap.set('linkRatings', [])

		const criteriaChips = selectedCriteria.map((criteria: BrowseCriteria) => {
			if (criteria.name === 'cardColors' || criteria.name === 'attributes' || criteria.name === 'monsterTypes' || criteria.name === 'monsterSubTypes')
				criteriaMap.get(criteria.name).push(criteria.value)
			else if (criteria.name === 'levels') {
				criteriaMap.get(criteria.name).push(criteria.value.replace('Level ', ''))
			} else if (criteria.name === 'ranks') {
				criteriaMap.get(criteria.name).push(criteria.value.replace('Rank ', ''))
			} else if (criteria.name === 'linkRatings') {
				criteriaMap.get(criteria.name).push(criteria.value.replace('Link Rating ', ''))
			}

			return <Chip key={criteria.value} label={criteria.value} style={{ background: 'rgba(107, 52, 91, .8)' }} />
		})

		setSelectedCriteriaChips(criteriaChips)

		// setIsCardBrowseDataLoaded(false)
		// Fetch.handleFetch(
		// 	`${DownstreamServices.NAME_maps_ENDPOINT['browse']}?cardColors=${criteriaMap.get('cardColors').join(',')}&attributes=${criteriaMap
		// 		.get('attributes')
		// 		.join(',')}&monsterTypes=${criteriaMap.get('monsterTypes').join(',')}&monsterSubTypes=${criteriaMap.get('monsterSubTypes').join(',')}&levels=${criteriaMap
		// 		.get('levels')
		// 		.join(',')}&ranks=${criteriaMap.get('ranks').join(',')}&linkRatings=${criteriaMap.get('linkRatings').join(',')}`,
		// 	(json) => {
		// 		setJsonResults(json.results)
		// 		setNumResults(json.numResults)

		// 		setIsCardBrowseDataLoaded(true)
		// 	}
		// )
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
