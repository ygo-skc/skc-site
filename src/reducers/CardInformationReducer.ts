type CardInformationState = Omit<SKCCard, 'cardID'> & {
	productInfo: ProductInfo[]
	restrictionInfo: RestrictedIn
}

export enum CardInformationType {
	UPDATE_CARD = 'UPDATE CARD',
	UPDATE_PRODUCTS = 'UPDATE PRODUCTS',
	UPDATE_RESTRICTIONS = 'UPDATE RESTRICTIONS',
}

type CardInformationAction =
	| {
			type: CardInformationType.UPDATE_CARD
			cardName: string
			cardEffect: string
			cardColor: cardColor
			cardAttribute?: string
			monsterType?: string
			monsterAssociation?: SKCMonsterAssociation
			monsterAtk?: string
			monsterDef?: string
	  }
	| { type: CardInformationType.UPDATE_PRODUCTS; productInfo: ProductInfo[] }
	| { type: CardInformationType.UPDATE_RESTRICTIONS; restrictionInfo: RestrictedIn }

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
			}
		case CardInformationType.UPDATE_PRODUCTS:
			return {
				...state,
				productInfo: action.productInfo,
			}
		case CardInformationType.UPDATE_RESTRICTIONS:
			return {
				...state,
				restrictionInfo: action.restrictionInfo,
			}
	}
}
