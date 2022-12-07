import { useState, useEffect, FC, Fragment } from 'react'
import CardDisplayGrid from '../util/grid/CardDisplayGrid'
import Hint from '../util/generic/Hints'

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
		<Fragment>
			<Hint>{sectionExplanation}</Hint>
			{cardTypeContentGrid}
		</Fragment>
	)
}

export default BanListSection
