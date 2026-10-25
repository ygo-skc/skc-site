import { cardInformationReducer, CardInformationType } from '../CardInformationReducer'

type State = Parameters<typeof cardInformationReducer>[0]

test('card pages sit under Card Browse once the card loads', () => {
	const state = cardInformationReducer({ pageBreadcrumbs: ['Home', 'Card Browse', ''] } as State, {
		type: CardInformationType.UPDATE_CARD,
		cardInfo: { cardID: '89631139', foundIn: [] } as unknown as YGOCard.Info,
	})

	expect(state.pageBreadcrumbs).toEqual(['Home', 'Card Browse', '89631139'])
})
