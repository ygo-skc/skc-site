export type CardInformationState = Omit<SKCCard, 'cardID'> & {
	productInfo: ProductInfo[]
	restrictionInfo: RestrictedIn
	isLoadingData: boolean
	uniqueRarities: string[]
}

export enum CardInformationType {
	UPDATE_CARD = 'UPDATE CARD',
}

type CardInformationAction = {
	type: CardInformationType.UPDATE_CARD
	cardName: string
	cardEffect: string
	cardColor: cardColor
	cardAttribute?: string
	monsterType?: string
	monsterAssociation?: SKCMonsterAssociation
	monsterAtk?: string
	monsterDef?: string
	productInfo: ProductInfo[]
	restrictionInfo: RestrictedIn
}

export function cardInformationReducer(state: CardInformationState, action: CardInformationAction): CardInformationState {
	switch (action.type) {
		case CardInformationType.UPDATE_CARD:
			return {
				...state,
				cardName: action.cardName,
				cardColor: action.cardColor,
				cardEffect: action.cardEffect,
				cardAttribute: action.cardAttribute,
				monsterType: action.monsterType,
				monsterAttack: action.monsterAtk,
				monsterDefense: action.monsterDef,
				monsterAssociation: action.monsterAssociation,
				productInfo: action.productInfo,
				restrictionInfo: action.restrictionInfo,
				isLoadingData: false,
				uniqueRarities: Array.from(
					new Set(action.productInfo.flatMap((product: ProductInfo) => product.productContent.flatMap((productContent: SKCProductContent) => productContent.rarities)))
				),
			}
	}
}
