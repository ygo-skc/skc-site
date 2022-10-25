import { FC } from 'react'
import Section from '../../util/Section'
import BanListChangedStatus from '../BanListChangedStatus'
import BanListSection from '../BanListSection'
import DuelLinksFormatTabbedView from '../tab/DuelLinksFormatTabbedView'

type _BanListContentNormalFormat = {
	forbidden: SKCCard[]
	limitedOne: SKCCard[]
	limitedTwo: SKCCard[]
	limitedThree: SKCCard[]
	numForbidden: number
	numLimitedOne: number
	numLimitedTwo: number
	numLimitedThree: number
	removedCards: SKCCardsPreviousBanListStatus[]
	numRemoved: number
	newForbiddenCards: SKCCardsPreviousBanListStatus[]
	newLimitedOneCards: SKCCardsPreviousBanListStatus[]
	newLimitedTwoCards: SKCCardsPreviousBanListStatus[]
	newLimitedThreeCards: SKCCardsPreviousBanListStatus[]
	numNewForbidden: number
	numNewLimitedOne: number
	numNewLimitedTwo: number
	numNewLimitedThree: number
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
	removedCards,
	numRemoved,
	newForbiddenCards,
	newLimitedOneCards,
	newLimitedTwoCards,
	newLimitedThreeCards,
	numNewForbidden,
	numNewLimitedOne,
	numNewLimitedTwo,
	numNewLimitedThree,
	isFetchingBanListNewContent,
	isFetchingBanListRemovedContent,
	isFetchingBanList,
}) => {
	return (
		<div>
			<BanListChangedStatus newStatusName='Forbidden' cards={newForbiddenCards} numCards={numNewForbidden} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Limited One' cards={newLimitedOneCards} numCards={numNewLimitedOne} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Limited Two' cards={newLimitedTwoCards} numCards={numNewLimitedTwo} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Limited Three' cards={newLimitedThreeCards} numCards={numNewLimitedThree} isLoadingData={isFetchingBanListNewContent} />
			<BanListChangedStatus newStatusName='Unlimited' cards={removedCards} numCards={numRemoved} isLoadingData={isFetchingBanListRemovedContent} />

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
									sectionExplanation='You can only use a maximum of one card in the Limited One list in your deck'
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
