import { FC } from 'react'
import Section from '../util/Section'
import BanListSection from './BanListSection'
import DuelLinksFormatTabbedView from './tab/DuelLinksFormatTabbedView'

type _BanListContentNormalFormat = {
	forbidden: SKCCard[]
	limitedOne: SKCCard[]
	limitedTwo: SKCCard[]
	limitedThree: SKCCard[]
	numForbidden: number
	numLimitedOne: number
	numLimitedTwo: number
	numLimitedThree: number
	// removedCards: SKCCardsPreviousBanListStatus[]
	// numRemoved: number
	// newForbiddenCards: SKCCardsPreviousBanListStatus[]
	// newLimitedCards: SKCCardsPreviousBanListStatus[]
	// newSemiLimitedCards: SKCCardsPreviousBanListStatus[]
	// numNewForbidden: number
	// numNewLimited: number
	// numNewSemiLimited: number
	isFetchingBanListNewContent: boolean
	isFetchingBanListRemovedContent: boolean
	isFetchingBanList: boolean
}

const BanListContentNormalFormat: FC<_BanListContentNormalFormat> = ({
	forbidden,
	limitedOne,
	limitedTwo,
	limitedThree,
	numForbidden,
	numLimitedOne,
	numLimitedTwo,
	numLimitedThree,
	// removedCards,
	// numRemoved,
	// newForbiddenCards,
	// newLimitedCards,
	// newSemiLimitedCards,
	// numNewForbidden,
	// numNewLimited,
	// numNewSemiLimited,
	// isFetchingBanListNewContent,
	// isFetchingBanListRemovedContent,
	isFetchingBanList,
}) => {
	return (
		<div>
			{/* <BanListChangedStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Limited' cards={newLimitedCards} numCards={numNewLimited} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Semi Limited' cards={newSemiLimitedCards} numCards={numNewSemiLimited} isLoadingData={isFetchingBanListNewContent} />

			<BanListChangedStatus newStatusName='Unlimited' cards={removedCards} numCards={numRemoved} isLoadingData={isFetchingBanListRemovedContent} /> */}

			<Section
				sectionHeaderBackground={'ban-list'}
				sectionName='Content'
				sectionContent={
					<div className='sticky section-content'>
						<DuelLinksFormatTabbedView
							numForbidden={numForbidden}
							numLimitedOne={numLimitedOne}
							numLimitedTwo={numLimitedTwo}
							numLimitedThree={numLimitedThree}
							forbiddenContent={<BanListSection sectionExplanation='Forbidden cards cannot be used in your deck' cards={forbidden} isDataLoaded={!isFetchingBanList} />}
							limitedOneContent={
								<BanListSection
									sectionExplanation='You can only use a maximum of one card in the Limited One list in your deck.'
									cards={limitedOne}
									isDataLoaded={!isFetchingBanList}
								/>
							}
							limitedTwoContent={
								<BanListSection
									sectionExplanation='You can only use a maximum of two card in the Limited Two list in your deck'
									cards={limitedTwo}
									isDataLoaded={!isFetchingBanList}
								/>
							}
							limitedThreeContent={
								<BanListSection
									sectionExplanation='You can only use a maximum of three card in the Limited Three list in your deck'
									cards={limitedThree}
									isDataLoaded={!isFetchingBanList}
								/>
							}
						/>
					</div>
				}
			/>
		</div>
	)
}

export default BanListContentNormalFormat
