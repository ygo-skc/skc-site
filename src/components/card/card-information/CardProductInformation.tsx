import { useEffect, useState, FC, Fragment, useCallback, JSX } from 'react'
import { Typography, Divider, Chip, Button } from '@mui/material'

import { Dates } from '../../../helper/Dates'
import { Hint } from 'skc-rcl'
import CardProductListItem from '../../product/CardProductListItem'

type CardProductInformationProps = {
	cardID: string
	cardName: string
	productInfo: ProductInfo[]
}

const CardProductInformation: FC<CardProductInformationProps> = ({ productInfo, cardID, cardName }) => {
	const initNumItems = 5
	const [productContents, setProductContents] = useState<JSX.Element[]>([])
	const [uniqueProductsFeaturedIn, setUniqueProductsFeaturedIn] = useState(0)
	const [uniqueRarityPrintings, setUniqueRarityPrintings] = useState<JSX.Element[]>([])
	const [loadAll, setLoadAll] = useState(false)

	const loadAllCB = useCallback(() => {
		setLoadAll(true)
	}, [])

	useEffect(() => {
		setLoadAll(productInfo.length <= initNumItems)
	}, [productInfo])

	const alphaSort = (a: string, b: string) => a.localeCompare(b)

	useEffect(() => {
		if (productInfo === null || productInfo === undefined || productInfo.length === 0) return

		const contents: React.JSX.Element[] = []
		const uniqueProductsFeaturedIn = new Set<string>()
		let uniqueRarityPrintings = new Set<string>()

		productInfo.forEach((product: ProductInfo, index: number) => {
			uniqueProductsFeaturedIn.add(product.productId)

			product.productContent.forEach((productContent: SKCProductContent) => {
				const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)
				uniqueRarityPrintings = new Set([...uniqueRarityPrintings, ...productContent.rarities])

				if (loadAll || index < initNumItems) {
					productContent.rarities.sort(alphaSort)

					contents.push(
						<CardProductListItem
							cardID={cardID}
							productID={product.productId}
							productName={product.productName}
							productReleaseDate={productReleaseDate}
							productContent={productContent}
						/>
					)
				}
			})
		})

		setProductContents(contents)
		setUniqueProductsFeaturedIn(uniqueProductsFeaturedIn.size)

		const sortedUniqueRarityPrintings = [...uniqueRarityPrintings]
		sortedUniqueRarityPrintings.sort(alphaSort)
		setUniqueRarityPrintings(sortedUniqueRarityPrintings.map((uniqueRarity) => <Chip className='dark-chip' key={uniqueRarity} label={uniqueRarity} />))
	}, [productInfo, cardID, loadAll])

	return (
		<div className='group'>
			<Typography variant='h4'>Products</Typography>
			{productInfo.length !== 0 && (
				<Fragment>
					<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white' variant='tight'>
						Last printing released {Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(productInfo[0].productReleaseDate)).toLocaleString()} day(s) ago
					</Hint>
					{productInfo.length >= 2 && (
						<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white' variant='tight'>
							First printing released {Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(productInfo[productInfo.length - 1].productReleaseDate)).toLocaleString()} day(s) ago
						</Hint>
					)}

					<div className='unique-rarities'>
						<Typography variant='subtitle1'>
							<span className='prominent'>{cardName}</span> was printed in {uniqueRarityPrintings.length} unique {uniqueRarityPrintings.length == 1 ? 'rarity' : 'rarities'}
						</Typography>
						{uniqueRarityPrintings}
						<Divider className='dark-translucent-divider' />
					</div>
					<br />
					<div>
						<Typography variant='subtitle1'>
							<span className='prominent'>{cardName}</span> was included in {uniqueProductsFeaturedIn} {uniqueProductsFeaturedIn == 1 ? 'product' : 'products'}
						</Typography>
						{productContents}
						{loadAll ? undefined : <Button onClick={loadAllCB}>Load All</Button>}
					</div>
				</Fragment>
			)}

			{productInfo.length === 0 && (
				<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white'>
					{'Not Found In Any Product'}
				</Hint>
			)}
		</div>
	)
}

export default CardProductInformation
