import Grid from '@mui/material/Grid'
import { FC, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { decodeHTML } from 'entities'
import { YGOCardWithImage } from 'skc-rcl'

// rendered straight from the cards (not built in an effect), so the grid has its full height on the first paint - going back to a page lands where it was left
const CardGridItems: FC<{ cards: YGOCard.Deets[] }> = ({ cards }) => (
	<Fragment>
		{cards.map((card) => (
			<CardGridItem key={card.cardID} card={card} />
		))}
	</Fragment>
)

const CardGridItem: FC<{ card: YGOCard.Deets }> = ({ card }) => {
	card.cardEffect = decodeHTML(card.cardEffect)

	return (
		<Grid className='ygo-card-grid-item' id={card.cardID} key={card.cardID} size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1.5 }}>
			<Link to={`/card/${card.cardID}`} className='aggregate-anchor'>
				<YGOCardWithImage card={card} imgLoadingType='lazy' />
			</Link>
		</Grid>
	)
}

export default CardGridItems
