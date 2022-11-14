import { FC, memo, useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'

import Section from '../../util/Section'

import CardProductInformation from './CardProductInformation'
import CardBanListInformation from './CardBanListInformation'
import YGOCardWithQuantity from '../YGOCardWithQuantity'
import FetchHandler from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'

type CardInformationRelatedContentType = {
	card: SKCCard
	isLoading: boolean
	productInfo: any
	banListInfo: any
	cardID: string
	cardColor: cardColor
}

const CardInformationRelatedContent: FC<CardInformationRelatedContentType> = memo(
	({ card, cardColor, isLoading, productInfo, banListInfo, cardID }) => {
		const [suggestions, setSuggestions] = useState<JSX.Element[]>()

		useEffect(() => {
			if (card === undefined) {
				return
			}

			FetchHandler.handleFetch(
				`${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card/${card.cardID}`,
				(json: MaterialSuggestionOutput) => {
					const s = json.namedMaterials.map((cardData) => {
						return <YGOCardWithQuantity card={cardData} quantity={1} />
					})

					setSuggestions(s)
				},
				false
			)?.catch((_err) => {})
		}, [card])

		return (
			<div>
				<Section
					sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''}
					sectionName='Materials'
					sectionContent={
						<div className='section-content'>
							<Typography variant='h5'>
								Cards Used In Summoning <i>{card.cardName}</i> From ED
							</Typography>

							<div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '.3rem' }}>{suggestions}</div>
						</div>
					}
				/>

				<Section
					sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''}
					sectionName='Explore'
					sectionContent={
						<div className='section-content'>
							<Typography variant='h5'>
								Related Content For <i>{card.cardName}</i>
							</Typography>

							<Grid2 container spacing={3}>
								<Grid2 xs={12} sm={12} md={12} lg={6} xl={6}>
									<CardProductInformation isLoading={isLoading} hasInfo={productInfo.length === 0 ? false : true} cardID={cardID} productInfo={productInfo} />
								</Grid2>

								<Grid2 xs={12} sm={12} md={12} lg={6} xl={6}>
									<CardBanListInformation isLoading={isLoading} hasInfo={banListInfo.length === 0 ? false : true} banListInfo={banListInfo} />
								</Grid2>
							</Grid2>
						</div>
					}
				/>
			</div>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.isLoading !== newProps.isLoading) return false

		return true
	}
)

export default CardInformationRelatedContent
