import Grid2 from '@mui/material/Unstable_Grid2'
import { FC, lazy } from 'react'
import { Section } from 'skc-rcl'

const ProductStatPie = lazy(() => import('../util/data-display/Pie'))

const ProductStats: FC<ProductStats & { isDataLoaded: boolean }> = ({ productRarityStats, cards, isDataLoaded }) => {
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
		<Section sectionName='Product Stats'>
			<Grid2 className='section-content' container style={{ width: '100%' }}>
				<Grid2 xs={12} sm={12} md={6} lg={6} xl={6}>
					<ProductStatPie isDataLoaded={isDataLoaded} statName='Rarity Spread' data={data} />
				</Grid2>
				<Grid2 xs={12} sm={12} md={6} lg={6} xl={6}>
					<ProductStatPie isDataLoaded={isDataLoaded} statName='Card Type Spread' data={rrr} />
				</Grid2>
			</Grid2>
		</Section>
	)
}

export default ProductStats
