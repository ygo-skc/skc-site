import { useEffect, useState, FC, useCallback, JSX } from 'react'
import { Typography, Button } from '@mui/material'

import { Dates } from '../../../helper/Dates'
import { Hint } from 'skc-rcl'
import CardProductListItem from '../../product/CardProductListItem'

type CardProductInformationProps = {
	cardID: string
	productInfo: ProductInfo[]
}

const CardProductInformation: FC<CardProductInformationProps> = ({ productInfo, cardID }) => {
	const initNumItems = 5
	const [productContents, setProductContents] = useState<JSX.Element[]>([])
	const [uniqueProductsFeaturedIn, setUniqueProductsFeaturedIn] = useState(0)
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
	}, [productInfo, cardID, loadAll])

	return (
		<div className='group'>
			<Typography variant='h4'>Products ({uniqueProductsFeaturedIn})</Typography>
			{productInfo.length !== 0 && (
				<div>
					{productContents}
					{loadAll ? undefined : <Button onClick={loadAllCB}>Load All</Button>}
				</div>
			)}

			{productInfo.length === 0 && (
				<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white' fullWidth={false}>
					{'Not Found In Any Product'}
				</Hint>
			)}
		</div>
	)
}

export default CardProductInformation
