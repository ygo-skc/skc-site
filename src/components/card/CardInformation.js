import React, { useState, useEffect, lazy, Suspense } from 'react'
import withWidth from '@material-ui/core/withWidth'
import {Helmet} from 'react-helmet'

import CardImageRounded from './CardImageRounded'
import cardStyles from './YGOCardStyles'
import { handleFetch } from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'
import { MainContentContainer } from '../MainContent'

import Breadcrumb from '../Breadcrumb'

const CardInformationSection = lazy( () => import('./CardInformationSection') )
const YGOCard = lazy( () => import('./YGOCard') )

const Footer = lazy( () => import('../Footer') )
const OneThirdTwoThirdsGrid = lazy( () => import('../grid/OneThirdTwoThirdsGrid') )

const Typography = lazy( () => import('@material-ui/core/Typography') )
const Chip = lazy( () => import('@material-ui/core/Chip') )
const Grid = lazy( () => import('@material-ui/core/Grid') )
const Box = lazy( () => import('@material-ui/core/Box') )



function Card( { match, history } )
{
	const [isLoading, setIsLoading] = useState(true)
	const cardId = match.params.cardId

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

	const [dynamicCrumbs, setDynamicCrumbs] = useState(['Home', 'Card Browse', ''])


	useEffect( () => {

		handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}${cardId}?allInfo=true`, history, (json) => {
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

			const crumbs = ['Home', 'Card Browse', json.cardID]
			setDynamicCrumbs(crumbs)
			setIsLoading(false)
		})
	}, [])


	useEffect( () => {
		if ( productInfoChips.length === 0 )
		{
			async function populateProductChips(productInfo)
			{
				return productInfo.map( (item, index) => {
					const productId = item.productId
					return item.productContent.map(item => <Chip key={index} label={`${productId} #${item.productPosition}  •  ${item.rarities.join(', ')}`} />)
					})
			}

			populateProductChips(productInfo).then(productInfoChips => setPackInfoChips(productInfoChips))
		}
	}, [productInfo])


	useEffect( () => {
		if ( banListInfoChips.length === 0 )
		{
			async function populateBanListChips(banListInfo)
			{
				return banListInfo.map( (item, index) => <Chip key={index} label={`${item.banListDate}  •  ${item.banStatus.charAt(0)}`} />)
			}

			populateBanListChips(banListInfo).then(banListInfoChips => setBanListInfoChips(banListInfoChips))
		}
	}, [banListInfo])


	return (
		<MainContentContainer style={{ paddingLeft: '0rem', paddingRight: '0rem', paddingBottom: '0rem' }}  >
			<Helmet>
				<title>SKC - Card: {cardId}</title>
				<meta
					name={`SKC - Card: ${cardId}`}
					content={`Information for YuGiOh card ${cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`}
					/>
				<meta name="keywords" content={`YuGiOh, The Supreme Kings Castle, card, ${cardName}, ${cardId}, ${cardColor}`} />
			</Helmet>
			<Breadcrumb crumbs={ dynamicCrumbs } />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<Box>

						<Typography
							variant='h4'
							align='center'
							style={{marginBottom: '2rem'}} >
							Card Information
						</Typography>

						<CardImageRounded
							cardID={cardId}
							/>

						<YGOCard
							isNew={ false }
							cardName={cardName}
							cardColor={cardColor}
							cardEffect={cardEffect}
							cardAttribute={cardAttribute}
							monsterType={monsterType}
							monsterAtk={monsterAtk}
							monsterDef={monsterDef}
							monsterAssociation={monsterAssociation}
							cardStyles={ cardStyles }
							cardID={cardId}
							fullDetails={ true }
							isLoading={ isLoading }
							/>
					</Box>
				}
				twoThirdComponent={
					<Grid container >
						<Grid item xs={12} sm={12} md={12} lg={6} xl={6}  style={ { display: 'inline-grid', padding: '1.2rem' } } >
							<Suspense fallback={undefined}>
								<CardInformationSection
									isLoading={isLoading}
									hasInfo={ (productInfo.length === 0)? false : true }
									infoChips={productInfoChips}
									headerText={'Product(s)'}
									noInfoText={'Not Found In Any Product'}
									background='#a4508b'
									backgroundImage='linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)'
								/>
							</Suspense>
						</Grid>

						<Grid item xs={12} sm={12} md={12} lg={6} xl={6} style={ { display: 'inline-grid', padding: '1.2rem' } } >
							<Suspense fallback={undefined}>
								<CardInformationSection
									isLoading={isLoading}
									hasInfo={ (banListInfo.length === 0)? false : true }
									infoChips={banListInfoChips}
									headerText={'Ban List(s)'}
									noInfoText={`No Instances of ${cardName} Being Forbidden, Limited, or Semi-Limited`}
									background='#fc9842'
									backgroundImage='linear-gradient(315deg, #fc9842 0%, #fe5f75 74%)'
								/>
							</Suspense>

						</Grid>

						<Footer />

					</Grid>
					}
				/>

		</MainContentContainer>
	)
}


export default withWidth()(Card)