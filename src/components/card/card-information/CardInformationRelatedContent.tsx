import { FC, memo } from 'react'
import { Grid, Typography } from '@mui/material'

import Section from '../../util/Section'

import CardProductInformation from './CardProductInformation'
import CardBanListInformation from './CardBanListInformation'

type CardInformationRelatedContentType = {
	cardName: string
	isLoading: boolean
	productInfo: any
	banListInfo: any
	cardID: string
	cardColor: cardColor
}

const CardInformationRelatedContent: FC<CardInformationRelatedContentType> = memo(
	({ cardName, cardColor, isLoading, productInfo, banListInfo, cardID }) => {
		return (
			<Section
				sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''}
				sectionName='Explore'
				sectionContent={
					<div className='section-content'>
						<Typography variant='h5'>
							Related Content For <i>{cardName}</i>
						</Typography>

						<Grid container spacing={3}>
							<Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
								<CardProductInformation isLoading={isLoading} hasInfo={productInfo.length === 0 ? false : true} cardID={cardID} productInfo={productInfo} />
							</Grid>

							<Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
								<CardBanListInformation isLoading={isLoading} hasInfo={banListInfo.length === 0 ? false : true} banListInfo={banListInfo} />
							</Grid>
						</Grid>
					</div>
				}
			/>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.isLoading !== newProps.isLoading) return false

		return true
	}
)

export default CardInformationRelatedContent
