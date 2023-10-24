import '../../../css/card/card-information-styles.css'
import { FC, memo } from 'react'
import Grid2 from '@mui/material/Unstable_Grid2'

import CardProductInformation from './CardProductInformation'
import CardBanListInformation from './CardBanListInformation'
import { Section } from 'skc-rcl'

type CardInformationRelatedContentType = {
	isLoading: boolean
	productInfo: ProductInfo[]
	restrictedIn: RestrictedIn
	cardName: string
	cardID: string
	cardColor: cardColor //should remove "pendulum" suffix for Pendulum cards
}

const CardInformationRelatedContent: FC<CardInformationRelatedContentType> = memo(
	({ cardName, cardColor, isLoading, productInfo, restrictedIn, cardID }) => {
		return (
			<Section sectionHeaderBackground={cardColor} sectionName='Explore'>
				<div className='section-content'>
					<Grid2 container spacing={3}>
						<Grid2 xs={12} sm={12} md={12} lg={6} xl={6}>
							<CardProductInformation isLoading={isLoading} cardID={cardID} cardName={cardName} productInfo={productInfo} />
						</Grid2>

						<Grid2 xs={12} sm={12} md={12} lg={6} xl={6}>
							<CardBanListInformation isLoading={isLoading} restrictedIn={restrictedIn} />
						</Grid2>
					</Grid2>
				</div>
			</Section>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.isLoading !== newProps.isLoading) return false

		return true
	}
)

CardInformationRelatedContent.displayName = 'CardInformationRelatedContent'
export default CardInformationRelatedContent
