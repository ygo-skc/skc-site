import { useEffect, useState, FunctionComponent } from 'react'
import '../../../css/card-information-styles.css'

import { Dates } from '../../../helper/Dates'
import { Hint } from '../../util/Hints'
import createTable from '../../util/TableHelpers'
import Section from '../../util/Section'

type args = {
	isLoading: boolean
	hasInfo: boolean
	cardID: string
	productInfo: ProductInfo[]
}

const CardProductInformation: FunctionComponent<args> = ({ isLoading, hasInfo, productInfo, cardID }) => {
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
					Dates.getDateString(new Date(product.productReleaseDate)),
					productContent.rarities.join(', '),
				]
				rowValues.push(row)
				rowOnClick.push(() => setTimeout(() => window.location.assign(`/product/${product.productId}#${cardID}`), 150))
			})
		})

		setProductTable(createTable(headerNames, rowValues, rowOnClick))
	}, [productInfo, cardID])

	return (
		<Section
			border='default-border'
			shadow=''
			sectionHeaderBackground='product'
			sectionName='Products'
			margin='tight'
			sectionContent={
				<div className={'section-content'}>
					{!isLoading && hasInfo ? (
						productTable
					) : (
						<Hint backgroundColor='rgba(0, 0, 0, 0.7)' textColor='white'>
							{'Not Found In Any Product'}
						</Hint>
					)}
				</div>
			}
		/>
	)
}

export default CardProductInformation
