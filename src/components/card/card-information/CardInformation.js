import React, { useState, useEffect, Suspense, useMemo } from 'react'
import { Chip } from '@material-ui/core'
import {Helmet} from 'react-helmet'

import { handleFetch } from '../../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../../helper/YgoApiEndpoints'
import { MainContentContainer } from '../../MainContent'

import OneThirdTwoThirdsGrid from '../../util/grid/OneThirdTwoThirdsGrid'


import Breadcrumb from '../../Breadcrumb'
import CardData from './CardData'
import CardInformationRelatedContent from './CardInformationRelatedContent'

const crumbs = ['Home', 'Card Browse']

async function populateBanListChips(banListInfo)
{
	return banListInfo.map( (item, index) => <Chip key={index} label={`${item.banListDate}  •  ${item.banStatus.charAt(0)}`} />)
}

async function populateProductChips(productInfo, cardID)
{
	return productInfo.map( (product, index) => {
		return product.productContent.map(item => <Chip
				key={index}
				label={`${product.productReleaseDate}  •  ${product.productId} #${item.productPosition}  •  ${item.rarities.join(', ')}`}
				onClick={ () => setTimeout( () => window.location.assign(`/product/${product.productId}#${cardID}`), 250 ) }
		/>)
		})
}


const Card = ( { match, history } ) =>
{
	let cardID = useMemo( () => {
		return match.params.cardId
	}, [])

	const [isLoading, setIsLoading] = useState(true)

	const [cardName, setCardName] = useState(undefined)
	const [cardColor, setCardColor] = useState(undefined)
	const [cardEffect, setCardEffect] = useState(undefined)
	const [cardAttribute, setCardAttribute] = useState(undefined)
	const [monsterType, setMonsterType] = useState(undefined)
	const [monsterAtk, setMonsterAtk] = useState(undefined)
	const [monsterDef, setMonsterDef] = useState(undefined)
	const [monsterAssociation, setMonsterAssociation] = useState(undefined)

	const [productInfo, setPackInfo] = useState([])
	const [banListInfo, setBanListInfo] = useState([])

	const [productInfoChips, setPackInfoChips] = useState([])
	const [banListInfoChips, setBanListInfoChips] = useState([])

	const [dynamicCrumbs, setDynamicCrumbs] = useState([...crumbs, ''])

	const helmetData = useEffect( () => {
		handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}${cardID}?allInfo=true`, history, (json) => {
			setCardName(json.cardName)
			setCardColor(json.cardColor)
			setCardEffect(json.cardEffect)
			setCardAttribute(json.cardAttribute)
			setMonsterType(json.monsterType)
			setMonsterAtk(json.monsterAttack)
			setMonsterDef(json.monsterDefense)
			setMonsterAssociation(json.monsterAssociation)

			setPackInfo( (json.foundIn === undefined)? [] : json.foundIn )
			setBanListInfo( (json.restrictedIn === undefined)? [] : json.restrictedIn )

			setDynamicCrumbs([...crumbs, json.cardID])
			setIsLoading(false)
		})

		return (
		<Helmet>
			<title>SKC - Card: {cardID}</title>
			<meta
				name={`SKC - Card: ${cardID}`}
				content={`Information for YuGiOh card ${cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`}
				/>
			<meta name="keywords" content={`YuGiOh, The Supreme Kings Castle, card, ${cardName}, ${cardID}, ${cardColor}`} />
		</Helmet>
		)

	}, [])



	useEffect( () => {
		if ( productInfoChips.length === 0 )
		{
			populateProductChips(productInfo, cardID).then(productInfoChips => setPackInfoChips(productInfoChips))
		}
	}, [productInfo])


	useEffect( () => {
		if ( banListInfoChips.length === 0 )
		{
			populateBanListChips(banListInfo).then(banListInfoChips => setBanListInfoChips(banListInfoChips))
		}
	}, [banListInfo])


	return (
		<MainContentContainer >
			{helmetData}
			<Suspense>
				<Breadcrumb crumbs={ dynamicCrumbs } />
			</Suspense>

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<CardData
						cardName={cardName}
						cardColor={cardColor}
						cardEffect={cardEffect}
						cardAttribute={cardAttribute}
						monsterType={monsterType}
						monsterAtk={monsterAtk}
						monsterDef={monsterDef}
						monsterAssociation={monsterAssociation}
						cardID={cardID}
						isLoading={isLoading}
					/>
				}
				twoThirdComponent={
					<CardInformationRelatedContent cardName={cardName}
						isLoading={isLoading}
						productInfo={productInfo}
						productInfoChips={productInfoChips}
						banListInfo={banListInfo}
						banListInfoChips={banListInfoChips} />
					}
				/>

		</MainContentContainer>
	)
}

export default Card