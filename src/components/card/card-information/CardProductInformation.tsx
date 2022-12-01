import { useEffect, useState, FC } from 'react'
import { Typography } from '@mui/material'

import '../../../css/card-information-styles.css'

import { Dates } from '../../../helper/Dates'
import Hint from '../../util/Hints'
import createTable from '../../util/TableHelpers'

type args = {
	isLoading: boolean
	hasInfo: boolean
	cardID: string
	productInfo: ProductInfo[]
}

const CardProductInformation: FC<args> = ({ isLoading, hasInfo, productInfo, cardID }) => {
	const [productTable, setProductTable] = useState<JSX.Element | undefined>(undefined)

	useEffect(() => {
		if (productInfo === null || productInfo === undefined || productInfo.length === 0) return

		const headerNames: string[] = ['ID', 'Pos', 'Release', 'Rarities']
		const rowValues: string[][] = []
		const rowOnClick: { (): void }[] = []

		productInfo.forEach((product: ProductInfo) => {
			product.productContent.forEach((productContent: SKCProductContent) => {
				const row: [string, string, string, string] = [
					product.productId,
					productContent.productPosition,
					Dates.fromYYYYMMDDToDateStr(product.productReleaseDate),
					productContent.rarities.join(', '),
				]
				rowValues.push(row)
				rowOnClick.push(() => setTimeout(() => window.location.assign(`/product/${product.productId}#${cardID}`), 150))
			})
		})

		setProductTable(createTable(headerNames, rowValues, rowOnClick))
	}, [productInfo, cardID])

	return (
		<div className='group'>
			<Typography variant='h4'>YGO Products</Typography>
			{!isLoading && hasInfo ? (
				<div>
					<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white'>
						Last printing released {Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(productInfo[0].productReleaseDate))} day(s) ago
					</Hint>
					{productTable}
				</div>
			) : (
				<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white'>
					{'Not Found In Any Product'}
				</Hint>
			)}
		</div>
	)
}

export default CardProductInformation
