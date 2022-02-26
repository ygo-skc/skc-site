import { Grid } from '@mui/material'
import { FC } from 'react'
import Section from '../util/Section'
import ProductStatPie from './ProductStatPie'

const ProductInfoDetailsComponent: FC<ProductStats> = ({ productTotal, productRarityStats, cards }) => {
	console.log(productTotal)
	const data: any[] = Object.keys(productRarityStats).map((key: string) => {
		return {
			id: key,
			label: key,
			value: productRarityStats[key],
		}
	})

	const cardColors = new Map<string, number>()

	cards.forEach((card: SKCCard) => {
		let cardColor = card.cardColor!

		const value = cardColors.get(cardColor)

		if (value) {
			cardColors.set(cardColor, value + 1)
		} else {
			cardColors.set(cardColor, 1)
		}
	})

	const rrr = Array.from(cardColors.keys()).map((cardColor: string) => {
		return {
			id: cardColor,
			label: cardColor,
			value: cardColors.get(cardColor),
		}
	})

	return (
		<Section
			sectionName='Product Stats'
			sectionContent={
				<Grid className='section-content' container style={{ width: '100%', backgroundColor: 'rgb(95, 10, 135)' }}>
					<Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
						<ProductStatPie statName='Rarities' data={data} />
					</Grid>
					<Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
						<ProductStatPie statName='Card Types' data={rrr} />
					</Grid>
				</Grid>
			}
		></Section>
	)
}

export default ProductInfoDetailsComponent
