import React from 'react'

import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import HomeIcon from '@material-ui/icons/Home';
import Block from '@material-ui/icons/Block';

import NAME_maps_ROUTE from '../Helper/site_map.js'
import { Typography } from '@material-ui/core';

import styled from 'styled-components'

export default function BreadCrumb(props)
{
	const Navigation = styled(Paper)`
		display: flex;
		padding-right: 10px;
		padding-left: 10px;
		padding-top: 15px;
		padding-bottom: 15px;
	`

	const LinkBreadCrumb = styled(Link)`
		display: flex;
	`

	const NonLinkBreadCrumb = styled(LinkBreadCrumb)`
		.MuiLink-underlineHover:hover {
			text-decoration: underline;
		}
	`

	const BREADCRUMB_maps_ICON = new Map()
	const iconStyle = { width: 20, height: 20, marginRight: 5 }
	BREADCRUMB_maps_ICON['Home'] = <HomeIcon style={iconStyle} />
	BREADCRUMB_maps_ICON['Ban List'] = <Block style={iconStyle} />

	let Crumbs = []
	props.crumbs.forEach((item, ind) =>
	{
		if ((ind === props.crumbs.length - 1)) {
			Crumbs.push(
				<NonLinkBreadCrumb color='inherit' key={ind} style={{ display: 'flex' }} >
					{BREADCRUMB_maps_ICON[item]}
					{item}
				</NonLinkBreadCrumb>
			)
		}
		else{
			Crumbs.push(
				<LinkBreadCrumb color='inherit' href={NAME_maps_ROUTE[item]} key={ind} >
					{BREADCRUMB_maps_ICON[item]}
					{item}
				</LinkBreadCrumb>
			)
		}
	})

	return(
		<Navigation elevation={0} >
			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label='breadcrumb'>
				{Crumbs}
			</Breadcrumbs>
		</Navigation>
	)
}