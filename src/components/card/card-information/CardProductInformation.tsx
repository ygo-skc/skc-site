import { useEffect, useState, FC, Fragment, startTransition, useCallback } from 'react'
import { Typography, Divider, Chip, Button } from '@mui/material'

import { Dates } from '../../../helper/Dates'
import { DateComponent, Hint } from 'skc-rcl'

type CardProductInformationProps = {
	isLoading: boolean
	cardID: string
	cardName: string
	productInfo: ProductInfo[]
}

const CardProductInformation: FC<CardProductInformationProps> = ({ isLoading, productInfo, cardID, cardName }) => {
	const initNumItems = 5
	const [productContents, setProductContents] = useState<JSX.Element[]>([])
	const [uniqueProductsFeaturedIn, setUniqueProductsFeaturedIn] = useState(0)
	const [uniqueRarityPrintings, setUniqueRarityPrintings] = useState<JSX.Element[]>([])
	const [loadAll, setLoadAll] = useState(productInfo.length <= initNumItems)

	const loadAllCB = useCallback(() => {
		setLoadAll(true)
	}, [])

	const alphaSort = (a: string, b: string) => a.localeCompare(b)

	useEffect(() => {
		if (productInfo === null || productInfo === undefined || productInfo.length === 0) return

		startTransition(() => {
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
						const productContents = (
							<div className='list-item-parent' onClick={() => window.location.assign(`/product/${product.productId}#${cardID}`)}>
								<DateComponent month={Dates.getMonth(productReleaseDate)} day={+Dates.getDay(productReleaseDate)} year={+Dates.getYear(productReleaseDate)} variant='condensed' />
								<div className='list-item-text'>
									<Typography variant='body1'>
										{product.productId}-{productContent.productPosition}
									</Typography>
									<Typography variant='subtitle1'>{product.productName}</Typography>
									<div>
										<Typography variant='body1' className='rarities'>
											Rarities
										</Typography>
										{productContent.rarities.map((uniqueRarity) => (
											<Chip className='dark-chip-condensed' key={uniqueRarity} label={uniqueRarity} />
										))}
									</div>
								</div>
							</div>
						)
						contents.push(productContents)
					}
				})
			})

			setProductContents(contents)
			setUniqueProductsFeaturedIn(uniqueProductsFeaturedIn.size)

			const sortedUniqueRarityPrintings = [...uniqueRarityPrintings]
			sortedUniqueRarityPrintings.sort(alphaSort)
			setUniqueRarityPrintings(sortedUniqueRarityPrintings.map((uniqueRarity) => <Chip className='dark-chip' key={uniqueRarity} label={uniqueRarity} />))
		})
	}, [productInfo, cardID, loadAll])

	return (
		<div className='group'>
			<Typography variant='h4'>Products</Typography>
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

					<div className='summary'>
						<Typography variant='h5'>Unique Products {uniqueProductsFeaturedIn}</Typography>
						<Typography variant='h5'>Unique Rarities</Typography>
						{uniqueRarityPrintings}
						<Divider className='dark-translucent-divider' />
					</div>
					<br />
					<div>
						<Typography variant='subtitle1'>
							<span className='prominent'>{cardName}</span> was printed in...
						</Typography>
						{productContents}
						{loadAll ? undefined : <Button onClick={loadAllCB}>Load All</Button>}
					</div>
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
