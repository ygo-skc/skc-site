import React, { useState, useEffect } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'

import Breadcrumb from './Breadcrumb'
import { MainContentContainer } from './MainContent'

import { handleFetch } from '../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../helper/YgoApiEndpoints'


export const Browse =( {history} ) =>
{
	const [browseCriteria, setBrowseCriteria] = useState([])
	const [intermediateSelectedCriteria, setIntermediateSelectedCriteria] = useState([])
	const [selectedCriteria, setSelectedCriteria] = useState([])


	useEffect( () => {
		handleFetch(NAME_maps_ENDPOINT['browseCriteria'], history, (json) => {
			const browseCriteria = []
			for (const criteria of Object.keys(json))
			{
				json[criteria].forEach(criteriaValue => {
					if (criteria == 'levels') criteriaValue = `Level ${criteriaValue}`
					browseCriteria.push({
						'criteriaName': criteria
						, 'criteriaValue': criteriaValue
					})
				})
			}
			console.log(browseCriteria)
			setBrowseCriteria(browseCriteria)
		})
	}, [])

	useEffect( () => {
		const criteriaMap = new Map()
		criteriaMap.set('cardColors', [])

		selectedCriteria.forEach(criteria => {
			if (criteria.criteriaName == 'cardColors')
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue)
		})

		handleFetch(`${NAME_maps_ENDPOINT['browse']}?cardColors=${criteriaMap.get('cardColors').join(',')}`, history, json => {
			console.log(json)
		})
	}, [selectedCriteria])

	return(
		<MainContentContainer>
			<Breadcrumb crumbs={ ['Home', 'Browse'] } />
			<Autocomplete
				multiple
				limitTags={2}
				id='browseCriteriaFilter'
				options={browseCriteria}
				getOptionLabel={option => option.criteriaValue}
				groupBy={option => option.criteriaName}
				autoHighlight
				onChange={ (event, val)  => {
					setIntermediateSelectedCriteria(val)
				}}
				renderTags={ () => null }
				disableCloseOnSelect
				onClose={ (event, reason) => {
					setSelectedCriteria(intermediateSelectedCriteria)
				}}
				renderInput={(params) => (
					<TextField {...params} variant='filled' label='' placeholder='Card Type' />
				)}
			/>
		</MainContentContainer>
	)
}