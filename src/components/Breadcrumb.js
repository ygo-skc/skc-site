import React from 'react'

import {Breadcrumbs, Link, Box} from '@material-ui/core'

import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import HomeIcon from '@material-ui/icons/Home'
import Block from '@material-ui/icons/Block'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info';

import { NAME_maps_ROUTE } from '../Routes'

import styled from 'styled-components'

const BreadCrumbsContent = styled(Box)`
	&&
	{
		display: flex;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: rgba(195, 188, 242, .2);
	}

`

const BreadCrumbItem = styled(Link)`
	&&
	{
		display: flex;
		font-weight: 600;
		color: black;
	}
`


const BREADCRUMB_maps_ICON = new Map()
const iconStyle = { width: 20, height: 20, marginRight: 5, color: 'rgba(68, 68, 68, 0.68)' }
BREADCRUMB_maps_ICON['Home'] = <HomeIcon style={iconStyle} />
BREADCRUMB_maps_ICON['Ban List'] = <Block style={iconStyle} />
BREADCRUMB_maps_ICON['404 - Err'] = <ErrorIcon style={iconStyle} />
BREADCRUMB_maps_ICON['About'] = <InfoIcon style={iconStyle} />


export default function BreadCrumb( { crumbs } )
{
	let Crumbs = crumbs.map((item, ind) =>
	{
		if ((ind === crumbs.length - 1))
		{
			return(
				<BreadCrumbItem
					variant='subtitle1'
					color='inherit'
					key={ind}
					underline='none' >
						{ BREADCRUMB_maps_ICON[item] }
						{ item }
				</BreadCrumbItem>
			)
		}

		return(
			<BreadCrumbItem
				variant='subtitle1'
				color='inherit'
				href={NAME_maps_ROUTE[item]}
				key={ind} >
					{ BREADCRUMB_maps_ICON[item] }
					{ item }
			</BreadCrumbItem>
		)
	})

	return(
		<BreadCrumbsContent >
			<Breadcrumbs
				separator={<NavigateNextIcon fontSize="small" />}
				aria-label='breadcrumb' >
					{ Crumbs }
			</Breadcrumbs>
		</BreadCrumbsContent>
	)
}