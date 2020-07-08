import React, { useState, useEffect } from 'react'
import { Chip, Typography, Paper, Divider, IconButton, Popover, Switch, FormControlLabel } from '@material-ui/core'
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined'

import Breadcrumb from '../Breadcrumb'
import {YGOCard} from './YGOCard'
import cardStyles from './YGOCardStyles'
import { handleFetch } from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'
import { MainContentContainer } from '../MainContent'


// When user wants to include or exclude a category from the info component the corresponding local storage variable is updated and the corresponding
// state variable is also updated. This method will take a reference to the state variable to update, the method used to update the state variable and
// the name of the variable used in local storage.
const onFilterItemClicked = (stateVariable, stateChangeMethod, localStorageItemName) => {
	localStorage.setItem(localStorageItemName, !stateVariable)
	stateChangeMethod(!stateVariable)
}


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

			setPackInfo(json.foundIn)
			setBanListInfo(json.restrictedIn)

			const crumbs = ['Home', json.cardName]
			setDynamicCrumbs(crumbs)
			setIsLoading(false)
		})
	}, [])


	useEffect( () => {
		if ( productInfo !== undefined && productInfoChips === undefined )
		{
			const productInfoChips = []

			productInfo.forEach( item => {
				console.log(item)
				productInfoChips.push(<Chip label={`${item.productName}  •  ${item.productId}`} />)
				setPackInfoChips(productInfoChips)
			})
		}
	}, [productInfo])


	useEffect( () => {
		if ( banListInfo !== undefined && banListInfoChips === undefined )
		{
			const banListInfoChips = []

			banListInfo.forEach( item => {
				console.log(item)
				banListInfoChips.push(<Chip label={`${item.banListDate}  •  ${item.banStatus}`} style={{ marginBottom: '.8rem' }} />)
				setBanListInfoChips(banListInfoChips)
			})
		}
	}, [banListInfo])


	return (
		<div style={{ display: 'flex', flexFlow: 'column', height: '100%' }} >
			<Popover
				open={isShowingFilter}
				onClose={ () => setIsShowingFilter(false) } anchorEl={filterAnchor}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				transformOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
				<Paper style={{width: '250px', padding: '2rem'}} >
					<Typography
						variant='subtitle1'
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
					<FormControlLabel
						control={<Switch checked={showDependencyInfo} onChange={ () => onFilterItemClicked(showDependencyInfo, setShowDependencyInfo, 'showDependencyInfo') } />}
						label='Dependency Info'
					/>
					<FormControlLabel
						control={<Switch checked={showSupportInfo} onChange={ () => onFilterItemClicked(showSupportInfo, setShowSupportInfo, 'showSupportInfo') } />}
						label='Support Info'
					/>
				</Paper>
			</Popover>

			<MainContentContainer>
			<Breadcrumb crumbs={ dynamicCrumbs } />
				<div
					style={{ width: '350px', maxWidth: '90%', margin: 'auto' }}>
					<YGOCard
						isNew={ false }
						cardName={cardName}
						cardColor={cardColor}
						cardEffect={cardEffect}
						monsterType={monsterType}
						monsterAtk={monsterAtk}
						monsterDef={monsterDef}
						cardStyles={ cardStyles }
						cardID={cardId}
						fullDetails={ true }
						isLoading={ isLoading }
					/>
				</div>

			</MainContentContainer>

			<Paper style={{ padding: '1.4rem', flexGrow: '1', marginTop: '2.5rem', borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem' }} >
				<div style={{ textAlign: 'center' }} >
					<IconButton onClick={ (event) => {
						setFilterAnchor(event.target)
						setIsShowingFilter(!isShowingFilter)
					}} >
						<FilterListOutlinedIcon fontSize='large' />
					</IconButton>
				</div>

				<div style={ (showPackInfo === true)? { display: 'block' } : {display: 'none'} } >
					<Typography variant='subtitle1' >Packs:</Typography>
					<br />
					{ (productInfo)? productInfoChips : <Typography align='center' variant='subtitle2' >{cardName} Not Found In Packs Currently In Database</Typography> }
					<Divider style={{ marginTop: '2rem', marginBottom: '.5rem'}} />
				</div>

				<div style={ (showBanInfo === true)? { display: 'block' } : {display: 'none'} } >
					<Typography variant='subtitle1' >Banned In:</Typography>
					<br />
					{ (banListInfo)? banListInfoChips: <Typography align='center' variant='subtitle2' >No Instances of {cardName} Being Banned.</Typography> }
					<Divider style={{ marginTop: '2rem', marginBottom: '.5rem'}} />
				</div>

				<div style={ (showDependencyInfo === true)? { display: 'block' } : {display: 'none'} } >
					<Typography variant='subtitle1' >Depends On:</Typography>
					<br />
					<Chip label="Chaos Form" />
				<Divider style={{ marginTop: '2rem', marginBottom: '.5rem'}} />
				</div>

				<div style={ (showSupportInfo === true)? { display: 'block' } : {display: 'none'} } >
					<Typography variant='subtitle1' >Support:</Typography>
					<br />
					<Chip label="Blue-Eyes" />
					<Chip label="Ritual" />
					<Chip label="Dragon" />
				</div>
			</Paper>
		</div>
	)
}