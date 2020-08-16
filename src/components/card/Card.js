import React, { useState, useEffect } from 'react'
import { Chip, Typography, Paper, IconButton, Popover, Switch, FormControlLabel, Grid, Avatar } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined'

import Breadcrumb from '../Breadcrumb'
import {YGOCard} from './YGOCard'
import cardStyles from './YGOCardStyles'
import { handleFetch } from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'
import { MainContentContainer } from '../MainContent'

import styled from 'styled-components'

import {OneThirdTwoThirdsGrid} from '../grid/OneThirdTwoThirdsGrid'


// When user wants to include or exclude a category from the info component the corresponding local storage variable is updated and the corresponding
// state variable is also updated. This method will take a reference to the state variable to update, the method used to update the state variable and
// the name of the variable used in local storage.
const onFilterItemClicked = (stateVariable, stateChangeMethod, localStorageItemName) => {
	localStorage.setItem(localStorageItemName, !stateVariable)
	stateChangeMethod(!stateVariable)
}

const CardSummaryChip = styled(Chip)`
	&&
	{

	}
`

const ContentPaper = styled(Paper)
`
	&&
	{
		@media screen and (min-width: 400px)
		{
			padding: .7rem
		}
		@media screen and (min-width: 600px)
		{
			padding: 2rem
		}
		@media screen and (min-width: 960px)
		{
			padding: 2.5rem
		}
		@media screen and (min-width: 1280px)
		{
			padding: 3rem
		}
		@media screen and (min-width: 1920px)
		{
			padding: 5rem
		}
	}
`


export const Card = ( { match, history } ) =>
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

	const [productInfoChips, setPackInfoChips] = useState(undefined)
	const [banListInfoChips, setBanListInfoChips] = useState(undefined)

	const [dynamicCrumbs, setDynamicCrumbs] = useState(['Home', ''])

	const [isShowingFilter, setIsShowingFilter] = useState(false)
	const [filterAnchor, setFilterAnchor] = useState(undefined)

	const [showPackInfo, setShowPackInfo] = useState( (localStorage.getItem('showPackInfo') === null)? true: JSON.parse(localStorage.getItem('showPackInfo')) )
	const [showBanInfo, setShowBanInfo] = useState( (localStorage.getItem('showBanInfo') === null)? true: JSON.parse(localStorage.getItem('showBanInfo')) )
	const [showDependencyInfo, setShowDependencyInfo] = useState( (localStorage.getItem('showDependencyInfo') === null)? true: JSON.parse(localStorage.getItem('showDependencyInfo')) )
	const [showSupportInfo, setShowSupportInfo] = useState( (localStorage.getItem('showSupportInfo') === null)? true: JSON.parse(localStorage.getItem('showSupportInfo')) )


	useEffect( () => {
		handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}${cardId}?allInfo=true`, history, (json) => {
			setCardName(json.cardName)
			setCardColor(json.cardColor)
			setCardEffect(json.cardEffect)
			setMonsterType(json.monsterType)
			setMonsterAtk(json.monsterAttack)
			setMonsterDef(json.monsterDefense)
			setMonsterAssociation(json.monsterAssociation)

			setPackInfo(json.foundIn)
			setBanListInfo(json.restrictedIn)

			const crumbs = ['Home', json.cardName]
			setDynamicCrumbs(crumbs)
			setTimeout(() => {
				setIsLoading(false)
			});
		})
	}, [])


	useEffect( () => {
		if ( productInfo !== undefined && productInfoChips === undefined )
		{
			const productInfoChips = []

			productInfo.forEach( item => {

				const rarities = item.productContent.map( item => {
					return item.rarity
				})

				const raritiesString = rarities.join(', ')
				productInfoChips.push(<CardSummaryChip label={`${item.productId} #${item.productContent[0].position}  •  ${raritiesString}`} />)
				setPackInfoChips(productInfoChips)
			})
		}
	}, [productInfo])


	useEffect( () => {
		if ( banListInfo !== undefined && banListInfoChips === undefined )
		{
			const banListInfoChips = []

			banListInfo.forEach( item => {
				banListInfoChips.push(<CardSummaryChip label={`${item.banListDate}  •  ${item.banStatus}`} />)
				setBanListInfoChips(banListInfoChips)
			})
		}
	}, [banListInfo])


	return (
		<MainContentContainer style={{ paddingLeft: '0rem', paddingRight: '0rem', paddingBottom: '0rem' }}  >
			<Popover
				open={isShowingFilter}
				onClose={ () => setIsShowingFilter(false) } anchorEl={filterAnchor}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				transformOrigin={{ vertical: 'bottom', horizontal: 'center' }} >

				<Paper style={{width: '250px', padding: '2rem'}} >
					<Typography
						variant='h6'
						align='center'
						style={{ marginBottom: '1.5rem' }} >
							Display...
					</Typography>
					<FormControlLabel
						control={<Switch checked={showPackInfo} onChange={ () => onFilterItemClicked(showPackInfo, setShowPackInfo, 'showPackInfo') } />}
						label='Pack Info'
					/>
					<FormControlLabel
						control={<Switch checked={showBanInfo} onChange={ () => onFilterItemClicked(showBanInfo, setShowBanInfo, 'showBanInfo') } />}
						label='Ban Info'
					/>
				</Paper>

			</Popover>


			<Breadcrumb crumbs={ dynamicCrumbs } />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<div>
						<div
							style={{ textAlign: 'center', marginBottom: '.5rem' }} >
							<img src={`https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${cardId}.jpg`} width = '55%' style={{ borderRadius: '50%' }} />
						</div>
						<div
							style={{ width: '350px', maxWidth: '100%', margin: 'auto', paddingBottom: '3.5rem' }} >
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
						</div>
					</div>
				}
				twoThirdComponent={
					<ContentPaper >
						<div style={{ textAlign: 'center' }} >
							<IconButton onClick={ (event) => {
								setFilterAnchor(event.target)
								setIsShowingFilter(!isShowingFilter)
							}} >
								<FilterListOutlinedIcon fontSize='large' />
							</IconButton>
						</div>

						<div style={{ marginBottom: '2rem' }} >
							{
								(isLoading)?
									<Skeleton height={30} style={{ margin: '0 auto', width: '420', maxWidth: '90%' }} />
									: <Typography variant='h6' align='center'>Content Associated With <strong>{cardName}</strong></Typography>
							}
						</div>

						<Grid container >
							<Grid item xs={12} sm={12} md={12} lg={6} xl={6}  style={ (showPackInfo === true)? { display: 'inline-grid', padding: '1.2rem' } : {display: 'none'} } >

								<div style={{background: '#7d7dba', padding: '1rem'}}>
									{
										(isLoading)?
											<Skeleton width={150} height={25} style={{margin: 'auto'}} />
											: <Typography variant='subtitle1' align='center' style={{color: '#eee'}} >Product(s)</Typography>
									}
									<br />
									{
										(isLoading)?
											undefined
											: (productInfo)?
												productInfoChips
												: <Typography style={{ color: '#fff' }} align='center' variant='body1' ><strong>{cardName}</strong> Not Found In Any Product</Typography>
									}
								</div>
							</Grid>

							<Grid item xs={12} sm={12} md={12} lg={6} xl={6} style={ (showBanInfo === true)? { display: 'inline-grid', padding: '1.2rem' } : {display: 'none'} } >
								<div style={{background: '#ce7e65', padding: '1rem'}}>
									{
										(isLoading)?
											<Skeleton width={150} height={25} style={{margin: 'auto'}}  />
											: <Typography variant='subtitle1' align='center' style={{color: '#eee'}} >Ban List(s)</Typography>
									}
									<br />
									{
										(isLoading)?
											undefined
											: (banListInfo)?
												banListInfoChips
												: <Typography style={{ color: '#fff' }} align='center' variant='subtitle2' >No Instances of <strong>{cardName}</strong> Being Forbidden, Limited, or Semi-Limited</Typography>
									}
								</div>
							</Grid>
						</Grid>
					</ContentPaper>
					}
				/>

		</MainContentContainer>
	)
}