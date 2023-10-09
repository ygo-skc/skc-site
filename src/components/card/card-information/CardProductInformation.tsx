import { useEffect, useState, FC, Fragment, startTransition } from 'react'
import { Typography } from '@mui/material'

import { Dates } from '../../../helper/Dates'
import { Hint, SKCTable } from 'skc-rcl'

type args = {
	isLoading: boolean
	cardID: string
	cardName: string
	productInfo: ProductInfo[]
}

const CardProductInformation: FC<args> = ({ isLoading, productInfo, cardID, cardName }) => {
	const [productTable, setProductTable] = useState<React.JSX.Element | undefined>(undefined)

	useEffect(() => {
		if (productInfo === null || productInfo === undefined || productInfo.length === 0) return

		startTransition(() => {
			const headerNames: string[] = ['ID', 'Pos', 'Release', 'Rarities']
			const rowValues: string[][] = []
			const rowOnClick: (() => void)[] = []

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

			setProductTable(<SKCTable header={headerNames} rows={rowValues} rowActions={rowOnClick} />)
		})
	}, [productInfo, cardID])

	return (
		<div className='group'>
			<Typography variant='h4'>YGO Products</Typography>
			<Typography variant='subtitle1'>All TCG products {cardName} was printed in</Typography>

			{!isLoading && productInfo.length !== 0 && (
				<Fragment>
					<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white' variant='tight'>
						Last printing released {Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(productInfo[0].productReleaseDate)).toLocaleString()} day(s) ago
					</Hint>
					{productInfo.length >= 2 && (
						<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white' variant='tight'>
							First printing released {Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(productInfo[productInfo.length - 1].productReleaseDate)).toLocaleString()} day(s) ago
						</Hint>
					)}
					{productTable}
				</Fragment>
			)}

			{!isLoading && productInfo.length === 0 && (
				<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white'>
					{'Not Found In Any Product'}
				</Hint>
			)}
		</div>
	)
}

export default CardProductInformation
