import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Skeleton } from '@mui/material'

import Fetch from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'
import OneThirdTwoThirdsGrid from '../../util/grid/OneThirdTwoThirdsGrid'

const Breadcrumb = lazy(() => import('../../header-footer/Breadcrumb'))
const CardData = lazy(() => import('./CardData'))

class _Card {
	static cardId: string | null = null
	static cardImg: HTMLImageElement
	static readonly crumbs = ['Home', 'Card Browse']

	static readonly loadRelatedContent = (isLoading: boolean, cardName: string, cardColor: cardColor, productInfo: any, banListInfo: any) => {
		if (!isLoading) {
			const CardInformationRelatedContent = lazy(() => import('./CardInformationRelatedContent'))
			return (
				<CardInformationRelatedContent
					cardName={cardName}
					cardColor={cardColor?.replace(/Pendulum-/gi, '') as cardColor}
					isLoading={isLoading}
					cardID={_Card.cardId!}
					productInfo={productInfo}
					banListInfo={banListInfo}
				/>
			)
		}
	}
}

const Card = () => {
	const { cardId } = useParams()

	if (_Card.cardId === null) {
		_Card.cardId = cardId as string

		const cardImage = new Image()
		cardImage.src = `https://images.thesupremekingscastle.com/cards/lg/${_Card.cardId}.jpg`
		_Card.cardImg = cardImage
	}

	const [isLoading, setIsLoading] = useState(true)

	const [cardName, setCardName] = useState('')
	const [cardColor, setCardColor] = useState<cardColor>(undefined)
	const [cardEffect, setCardEffect] = useState('')
	const [cardAttribute, setCardAttribute] = useState('')
	const [monsterType, setMonsterType] = useState('')
	const [monsterAtk, setMonsterAtk] = useState('')
	const [monsterDef, setMonsterDef] = useState('')
	const [monsterAssociation, setMonsterAssociation] = useState(undefined)

	const [productInfo, setPackInfo] = useState([])
	const [banListInfo, setBanListInfo] = useState([])

	const [dynamicCrumbs, setDynamicCrumbs] = useState([..._Card.crumbs, ''])

	useEffect(() => {
		Fetch.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT['cardInstanceUrl']}${_Card.cardId}?allInfo=true`, (json) => {
			setDynamicCrumbs([..._Card.crumbs, json.cardID])

			setCardName(json.cardName)
			setCardColor(json.cardColor)
			setCardEffect(json.cardEffect)
			setCardAttribute(json.cardAttribute)
			setMonsterType(json.monsterType)
			setMonsterAtk(json.monsterAttack)
			setMonsterDef(json.monsterDefense)
			setMonsterAssociation(json.monsterAssociation)

			setPackInfo(json.foundIn === undefined ? [] : json.foundIn)
			setBanListInfo(json.restrictedIn === undefined ? [] : json.restrictedIn)
			setIsLoading(false)
		})
	}, [])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>SKC - Card: {_Card.cardId}</title>
				<meta
					name={`SKC - Card: ${_Card.cardId}`}
					content={`Information for YuGiOh card ${cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`}
				/>
				<meta name='keywords' content={`YuGiOh, The Supreme Kings Castle, card, ${cardName}, ${_Card.cardId}, ${cardColor}`} />
			</Helmet>

			<Breadcrumb crumbs={dynamicCrumbs} />

			<OneThirdTwoThirdsGrid
				mirrored={false}
				oneThirdComponent={
					<CardData
						cardName={cardName}
						cardColor={cardColor?.replace(/Pendulum-/gi, '') as cardColor}
						cardEffect={cardEffect}
						cardAttribute={cardAttribute}
						monsterType={monsterType}
						monsterAtk={monsterAtk}
						monsterDef={monsterDef}
						monsterAssociation={monsterAssociation}
						cardID={_Card.cardId}
						isLoading={isLoading}
						cardImg={_Card.cardImg}
					/>
				}
				twoThirdComponent={
					<Suspense fallback={<Skeleton width='100%' height='20rem' />}>{_Card.loadRelatedContent(isLoading, cardName, cardColor, productInfo, banListInfo)}</Suspense>
				}
			/>
		</div>
	)
}

export default Card
