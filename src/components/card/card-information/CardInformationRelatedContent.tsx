import { FC } from 'react'

import CardBanListInformation from './CardBanListInformation'
import { Section } from 'skc-rcl'

type CardInformationRelatedContentType = {
	restrictedIn: YGOCard.Restrictions
	cardColor: YGOCard.Color //should remove "pendulum" suffix for Pendulum cards
}

const CardInformationRelatedContent: FC<CardInformationRelatedContentType> = ({ cardColor, restrictedIn }) => {
	return (
		<Section sectionHeaderBackground={cardColor} sectionName='Explore'>
			<div className='section-content'>
				<CardBanListInformation restrictedIn={restrictedIn} />
			</div>
		</Section>
	)
}

CardInformationRelatedContent.displayName = 'CardInformationRelatedContent'
export default CardInformationRelatedContent
