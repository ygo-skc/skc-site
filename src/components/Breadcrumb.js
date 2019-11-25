import React from 'react'

import {Breadcrumbs, Link, Paper} from '@material-ui/core'

import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import HomeIcon from '@material-ui/icons/Home'
import Block from '@material-ui/icons/Block'
import ErrorIcon from '@material-ui/icons/Error'

import { NAME_maps_ROUTE } from '../Routes'

import styled from 'styled-components'

const BreadCrumbsContent = styled(Paper)`
	display: flex;
	padding-right: 10px;
	padding-left: 10px;
	padding-top: 15px;
	padding-bottom: 15px;
	margin-top: 20px;
	margin-bottom: 25px
`

const BreadCrumbItem = styled(Link)`
	&&
	{
		display: flex;
	}
`


const BREADCRUMB_maps_ICON = new Map()
const iconStyle = { width: 20, height: 20, marginRight: 5, color: 'rgba(68, 68, 68, 0.68)' }
BREADCRUMB_maps_ICON['Home'] = <HomeIcon style={iconStyle} />
BREADCRUMB_maps_ICON['Ban List'] = <Block style={iconStyle} />
BREADCRUMB_maps_ICON['404 - Err'] = <ErrorIcon style={iconStyle} />


export default function BreadCrumb(props)
{
	let Crumbs = props.crumbs.map((item, ind) =>
	{
		if ((ind === props.crumbs.length - 1))
		{
			return	<BreadCrumbItem color='inherit' key={ind} underline='none' >
						{BREADCRUMB_maps_ICON[item]}
						{item}
					</BreadCrumbItem>
		}

		return	<BreadCrumbItem color='inherit' href={NAME_maps_ROUTE[item]} key={ind} >
					{BREADCRUMB_maps_ICON[item]}
					{item}
				</BreadCrumbItem>
	})

	return(
		<BreadCrumbsContent >
			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label='breadcrumb' >
				{Crumbs}
			</Breadcrumbs>
		</BreadCrumbsContent>
	)
}