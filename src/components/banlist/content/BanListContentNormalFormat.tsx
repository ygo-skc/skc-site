import { FC } from 'react'
import Section from '../../util/Section'
import BanListChangedStatus from '../BanListChangedStatus'
import BanListSection from '../BanListSection'
import NormalFormatTabbedView from '../tab/NormalFormatTabbedView'

type _BanListContentNormalFormat = {
	forbidden: SKCCard[]
	limited: SKCCard[]
	semiLimited: SKCCard[]
	numForbidden: number
	numLimited: number
	numSemiLimited: number
	removedCards: SKCCardsPreviousBanListStatus[]
	numRemoved: number
	newForbiddenCards: SKCCardsPreviousBanListStatus[]
	newLimitedCards: SKCCardsPreviousBanListStatus[]
	newSemiLimitedCards: SKCCardsPreviousBanListStatus[]
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
	isFetchingBanList: boolean
}

const BanListContentNormalFormat: FC<_BanListContentNormalFormat> = ({
	forbidden,
	limited,
	semiLimited,
	numForbidden,
	numLimited,
	numSemiLimited,
	removedCards,
	numRemoved,
	newForbiddenCards,
	newLimitedCards,
	newSemiLimitedCards,
	numNewForbidden,
	numNewLimited,
	numNewSemiLimited,
	isFetchingBanListNewContent,
	isFetchingBanListRemovedContent,
	isFetchingBanList,
}) => {
	return (
		<div>
			<BanListChangedStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Limited' cards={newLimitedCards} numCards={numNewLimited} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Semi Limited' cards={newSemiLimitedCards} numCards={numNewSemiLimited} isLoadingData={isFetchingBanListNewContent} />

			<BanListChangedStatus newStatusName='Unlimited' cards={removedCards} numCards={numRemoved} isLoadingData={isFetchingBanListRemovedContent} />

			<Section
				sectionHeaderBackground={'ban-list'}
				sectionName='Content'
				sectionContent={
					<div className='sticky section-content'>
						<NormalFormatTabbedView
							numForbidden={numForbidden}
							numLimited={numLimited}
							numSemiLimited={numSemiLimited}
							forbiddenContent={
								<BanListSection sectionExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format' cards={forbidden} isDataLoaded={!isFetchingBanList} />
							}
							limitedContent={<BanListSection sectionExplanation='Limited cards can be included in Deck/Side deck - max 1' cards={limited} isDataLoaded={!isFetchingBanList} />}
							semiLimitedContent={
								<BanListSection sectionExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2' cards={semiLimited} isDataLoaded={!isFetchingBanList} />
							}
						/>
					</div>
				}
			/>
		</div>
	)
}

export default BanListContentNormalFormat
