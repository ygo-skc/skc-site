import React, { Component } from 'react'

import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import HomeIcon from '@material-ui/icons/Home';
import Block from '@material-ui/icons/Block';

import NAME_maps_ROUTE from './Helper/site_map.js'
import { Typography, makeStyles } from '@material-ui/core';

const styles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	breadcrumb: {
		padding: theme.spacing(1, 2)
	}
}))

export default function BreadCrumb(props)
{
	const classes = styles();

	const BREADCRUMB_maps_ICON = new Map()
	BREADCRUMB_maps_ICON['Home'] = <HomeIcon style={{ width: 20, height: 20, marginRight: 5 }} />
	BREADCRUMB_maps_ICON['Ban List'] = <Block style={{ width: 20, height: 20, marginRight: 5  }} />

	let Crumbs = []
	props.crumbs.forEach((item, ind) =>
	{
		if ((ind === props.crumbs.length - 1)) {
			Crumbs.push(
				<Typography key={ind} >
					{BREADCRUMB_maps_ICON[item]}
					{item}
				</Typography>
			)
		}
		else{
			Crumbs.push(
				<Link color='inherit' href={NAME_maps_ROUTE[item]} key={ind} >
					{BREADCRUMB_maps_ICON[item]}
					{item}
				</Link>
			)
		}
	})

	return(
		<div className={classes.root}>
			<Paper className={classes.breadcrumb} elevation={0} >
				<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label='breadcrumb'>
					{Crumbs}
				</Breadcrumbs>
			</Paper>
		</div>
	)
}