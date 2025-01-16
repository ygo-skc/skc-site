import Grid from '@mui/material/Grid2'
import { FC, lazy } from 'react'
import { Section } from 'skc-rcl'

const Pie = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Pie }
	})
)

const ProductStats: FC<YGOProduct.Stats & { isDataLoaded: boolean }> = ({ productRarityStats, cards, isDataLoaded }) => {
	const raritySpreadData = Object.keys(productRarityStats).map((key: string) => {
		return {
			id: key,
			label: key,
			value: productRarityStats[key],
		}
	})

	const cardColors = new Map<string, number>()

	cards.forEach((card: YGOCard.Deets) => {
		const cardColor = card.cardColor!

		const value = cardColors.get(cardColor)

		if (value) {
			cardColors.set(cardColor, value + 1)
		} else {
			cardColors.set(cardColor, 1)
		}
	})

	const cardTypeSpreadData = Array.from(cardColors.keys()).map((cardColor: string) => {
		const value = cardColors.get(cardColor)
		return {
			id: cardColor,
			label: cardColor,
			value: value === undefined ? 0 : +value,
		}
	})

	return (
		<Section sectionName='Product Stats'>
			<Grid className='section-content' container>
				<Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
					<Pie legendTextColor='white' isDataLoaded={isDataLoaded} statName='Rarity Spread' data={raritySpreadData} />
				</Grid>
				<Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
					<Pie legendTextColor='white' isDataLoaded={isDataLoaded} statName='Card Type Spread' data={cardTypeSpreadData} />
				</Grid>
			</Grid>
		</Section>
	)
}

export default ProductStats
