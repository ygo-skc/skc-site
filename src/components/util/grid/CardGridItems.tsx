import Grid2 from '@mui/material/Unstable_Grid2'
import { FC, Fragment, useEffect, useState } from 'react'
import { YGOCardWithImage } from 'skc-rcl'

const CardGridItems: FC<{ cards: SKCCard[] }> = ({ cards }) => {
	const [cardGridItems, setCardGridItems] = useState<JSX.Element[]>([])

	useEffect(() => {
		const cardGridItems = cards.map((card) => <CardGridItem key={card.cardID} card={card} />)
		setCardGridItems(cardGridItems)
	}, [cards])

	return <Fragment>{cardGridItems}</Fragment>
}

const CardGridItem: FC<{ card: SKCCard }> = ({ card }) => {
	return (
		<Grid2 className='ygo-card-grid-item' id={card.cardID} key={card.cardID} xs={6} sm={4} md={4} lg={3} xl={2}>
			<a href={`/card/${card.cardID}`} className='aggregate-anchor'>
				<YGOCardWithImage card={card} imgLoadingType='lazy' />
			</a>
		</Grid2>
	)
}

export default CardGridItems
