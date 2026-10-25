import { cardInformationReducer, CardInformationType } from '../CardInformationReducer'

type State = Parameters<typeof cardInformationReducer>[0]

test('card pages sit under Card Browse once the card loads', () => {
	const state = cardInformationReducer({ pageBreadcrumbs: ['Home', 'Card Browse', ''] } as unknown as State, {
		type: CardInformationType.UPDATE_CARD,
		cardInfo: { cardID: '89631139', cardName: 'Blue-Eyes White Dragon', foundIn: [] } as unknown as YGOCard.Info,
	})

	expect(state.pageBreadcrumbs).toEqual(['Home', 'Card Browse', 'Blue-Eyes White Dragon'])
})
