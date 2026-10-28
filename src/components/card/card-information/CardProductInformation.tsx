import { FC, useCallback, useMemo } from 'react'
import { Typography, Button } from '@mui/material'

import * as Dates from '../../../helper/Dates'
import { Hint } from 'skc-rcl'
import CardProductListItem from '../../product/CardProductListItem'
import { useHistoryEntryState } from '../../util/useHistoryEntry'

type CardProductInformationProps = {
	cardID: string
	productInfo: YGOProduct.Info[]
}

const CardProductInformation: FC<CardProductInformationProps> = ({ productInfo, cardID }) => {
	const initNumItems = 5
	// kept for coming back from a product page, and built during render rather than in an effect, so the list is there on the first paint
	const [loadedAll, setLoadAll] = useHistoryEntryState('card-products-load-all', false)
	const loadAll = loadedAll || productInfo.length <= initNumItems

	const loadAllCB = useCallback(() => {
		setLoadAll(true)
	}, [setLoadAll])

	const { productContents, uniqueProductsFeaturedIn } = useMemo(() => {
		const alphaSort = (a: string, b: string) => a.localeCompare(b)

		const contents: React.JSX.Element[] = []
		const uniqueProductsFeaturedIn = new Set<string>()
		let uniqueRarityPrintings = new Set<string>()

		productInfo.forEach((product: YGOProduct.Info, index: number) => {
			uniqueProductsFeaturedIn.add(product.productId)

			product.productContent.forEach((productContent: YGOProduct.Content) => {
				const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)
				uniqueRarityPrintings = new Set([...uniqueRarityPrintings, ...productContent.rarities])

				if (loadAll || index < initNumItems) {
					contents.push(
						<CardProductListItem
							key={`${product.productId}-${productContent.productPosition}`}
							cardID={cardID}
							productID={product.productId}
							productName={product.productName}
							productReleaseDate={productReleaseDate}
							// sorted on a copy, so the remembered product info isn't changed during render
							productContent={{ ...productContent, rarities: [...productContent.rarities].sort(alphaSort) }}
						/>
					)
				}
			})
		})

		return { productContents: contents, uniqueProductsFeaturedIn: uniqueProductsFeaturedIn.size }
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
