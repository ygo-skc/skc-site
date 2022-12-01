import { useState, useEffect, FC } from 'react'
import CardDisplayGrid from '../util/grid/CardDisplayGrid'
import Hint from '../util/Hints'

type _BanListSection = {
	sectionExplanation: string
	cards: SKCCard[]
	isDataLoaded: boolean
}

const BanListSection: FC<_BanListSection> = ({ sectionExplanation, cards, isDataLoaded }) => {
	const [cardTypeContentGrid, setCardTypeContentGrid] = useState<JSX.Element>()

	useEffect(() => {
		if (isDataLoaded) {
			setCardTypeContentGrid(
				<CardDisplayGrid
					cardJsonResults={cards}
					numResultsDisplayed={cards.length}
					numItemsToLoadWhenNeeded={cards.length}
					loadMoreCallback={undefined}
					isLoadMoreOptionVisible={false}
					numResults={cards.length}
					isDataLoaded={isDataLoaded}
				/>
			)
		} else setCardTypeContentGrid(undefined)
	}, [isDataLoaded])

	return (
		<div>
			<Hint>{sectionExplanation}</Hint>
			{cardTypeContentGrid}
		</div>
	)
}

export default BanListSection
