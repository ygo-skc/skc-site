import { FC } from 'react'
import Grid from '@mui/material/Grid2'

import CardProductInformation from './CardProductInformation'
import CardBanListInformation from './CardBanListInformation'
import { Section } from 'skc-rcl'

type CardInformationRelatedContentType = {
	productInfo: YGOProductInfo[]
	restrictedIn: YGOCard.Restrictions
	cardName: string
	cardID: string
	cardColor: YGOCard.Color //should remove "pendulum" suffix for Pendulum cards
}

const CardInformationRelatedContent: FC<CardInformationRelatedContentType> = ({ cardColor, productInfo, restrictedIn, cardID }) => {
	return (
		<Section sectionHeaderBackground={cardColor} sectionName='Explore'>
			<div className='section-content'>
				<Grid container spacing={3}>
					<Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
						<CardProductInformation cardID={cardID} productInfo={productInfo} />
					</Grid>

					<Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
						<CardBanListInformation restrictedIn={restrictedIn} />
					</Grid>
				</Grid>
			</div>
		</Section>
	)
}

CardInformationRelatedContent.displayName = 'CardInformationRelatedContent'
export default CardInformationRelatedContent
