import { FC, memo, startTransition, useEffect, useState } from 'react'
import { Skeleton, Typography } from '@mui/material'

import Section from '../../util/Section'

import YGOCardWithQuantity from '../YGOCardWithQuantity'
import FetchHandler from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'

type _CardSuggestion = {
	cardID: string
	cardColor: cardColor
}

const CardSuggestions: FC<_CardSuggestion> = memo(
	({ cardID, cardColor }) => {
		const [suggestions, setSuggestions] = useState<JSX.Element[]>()
		const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(true)

		useEffect(() => {
			FetchHandler.handleFetch(
				`${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card/${cardID}`,
				(json: MaterialSuggestionOutput) => {
					const suggestionOutput = json.namedMaterials.map((cardData: SKCCard) => {
						return <YGOCardWithQuantity key={cardData.cardID} card={cardData} quantity={1} />
					})

					startTransition(() => {
						setSuggestions(suggestionOutput)
						setIsLoadingSuggestions(false)
					})
				},
				false
			)?.catch((_err) => {})
		}, [cardID])

		return (
			<div>
				<Section
					sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''}
					sectionName='Materials'
					sectionContent={
						isLoadingSuggestions ? (
							<div className='section-content'>
								<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='250px' />
							</div>
						) : (
							<div className='section-content'>
								<Typography variant='h5'>{/* Cards Used In Summoning <i>{card.cardName}</i> From ED */}</Typography>

								<div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '.3rem' }}>{suggestions}</div>
							</div>
						)
					}
				/>
			</div>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.cardID !== newProps.cardID) return false

		return true
	}
)

export default CardSuggestions
