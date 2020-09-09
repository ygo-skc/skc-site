import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Chip, Typography, Grid, Box } from '@material-ui/core'
import withWidth from '@material-ui/core/withWidth'

import Breadcrumb from '../Breadcrumb'
import {YGOCard} from './YGOCard'
import CardImageRounded from './CardImageRounded'
import cardStyles from './YGOCardStyles'
import { handleFetch } from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'
import { MainContentContainer } from '../MainContent'
import Footer from '../Footer'

import styled from 'styled-components'

import OneThirdTwoThirdsGrid from '../grid/OneThirdTwoThirdsGrid'

const CardInformationSection = lazy( () => import('./CardInformationSection') )


const CardSummaryChip = styled(Chip)`
	&&
	{

	}
`

// When user wants to include or exclude a category from the info component the corresponding local storage variable is updated and the corresponding
// state variable is also updated. This method will take a reference to the state variable to update, the method used to update the state variable and
// the name of the variable used in local storage.
// const onFilterItemClicked = (stateVariable, stateChangeMethod, localStorageItemName) => {
// 	localStorage.setItem(localStorageItemName, !stateVariable)
// 	stateChangeMethod(!stateVariable)
// }


function Card( { match, history, width } )
{
	const [isLoading, setIsLoading] = useState(true)
	const cardId = match.params.cardId

	const [cardName, setCardName] = useState(undefined)
	const [cardColor, setCardColor] = useState(undefined)
	const [cardEffect, setCardEffect] = useState(undefined)
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
			setMonsterType(json.monsterType)
			setMonsterAtk(json.monsterAttack)
			setMonsterDef(json.monsterDefense)
			setMonsterAssociation(json.monsterAssociation)

			setPackInfo( (json.foundIn === undefined)? [] : json.foundIn )
			setBanListInfo( (json.restrictedIn === undefined)? [] : json.restrictedIn )

			const crumbs = ['Home', 'Card Browse', json.cardID]
			setDynamicCrumbs(crumbs)
			setTimeout(() => {
				setIsLoading(false)
			});
		})
	}, [])


	useEffect( () => {
		if ( productInfoChips.length === 0 )
		{
			const productInfoChips = []

			productInfo.forEach( item => {
				const productId = item.productId
				item.productContent.forEach(item => {
					console.log(item)
					productInfoChips.push(<CardSummaryChip label={`${productId} #${item.productPosition}  •  ${item.rarities.join(', ')}`} />)
				})
			})
			setPackInfoChips(productInfoChips)
		}
	}, [productInfo])


	useEffect( () => {
		if ( banListInfoChips.length === 0 )
		{
			const banListInfoChips = []

			banListInfo.forEach( item => {
				banListInfoChips.push(<CardSummaryChip label={`${item.banListDate}  •  ${item.banStatus.charAt(0)}`} />)
				setBanListInfoChips(banListInfoChips)
			})
		}
	}, [banListInfo])


	return (
		<MainContentContainer style={{ paddingLeft: '0rem', paddingRight: '0rem', paddingBottom: '0rem' }}  >
			<Breadcrumb crumbs={ dynamicCrumbs } />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<Box
						style={{ margin: 'auto', paddingBottom: '3.5rem' }}>

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
					</Grid>
					}
				/>

			<Footer />
		</MainContentContainer>
	)
}


export default withWidth()(Card)