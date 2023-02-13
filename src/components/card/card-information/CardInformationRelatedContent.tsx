import { FC, Fragment, memo } from 'react'
import Grid2 from '@mui/material/Unstable_Grid2'

import Section from '../../util/generic/Section'

import CardProductInformation from './CardProductInformation'
import CardBanListInformation from './CardBanListInformation'

import CardSuggestions from './CardSuggestions'

type CardInformationRelatedContentType = {
	card: SKCCard
	isLoading: boolean
	productInfo: ProductInfo[]
	restrictedIn: RestrictedIn
	cardID: string
	cardColor: cardColor
}

const CardInformationRelatedContent: FC<CardInformationRelatedContentType> = memo(
	({ card, cardColor, isLoading, productInfo, restrictedIn, cardID }) => {
		return (
			<Fragment>
				<CardSuggestions cardID={card.cardID} cardColor={card.cardColor} />

				<Section
					sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''}
					sectionName='Explore'
					sectionContent={
						<div className='section-content'>
							<Grid2 container spacing={3}>
								<Grid2 xs={12} sm={12} md={12} lg={6} xl={6}>
									<CardProductInformation isLoading={isLoading} cardID={cardID} productInfo={productInfo} />
								</Grid2>

								<Grid2 xs={12} sm={12} md={12} lg={6} xl={6}>
									<CardBanListInformation isLoading={isLoading} restrictedIn={restrictedIn} />
								</Grid2>
							</Grid2>
						</div>
					}
				/>
			</Fragment>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.isLoading !== newProps.isLoading) return false

		return true
	}
)

export default CardInformationRelatedContent
