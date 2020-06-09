import React, { FunctionComponent } from 'react'

import {Breadcrumbs, Link, Box} from '@material-ui/core'

import HomeIcon from '@material-ui/icons/Home'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import Block from '@material-ui/icons/Block'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info';

import { NAME_maps_ROUTE } from '../Routes'

import styled from 'styled-components'

type BreadcrumbProps = {
	crumbs: string[]
}

const BreadCrumbsContent = styled(Box)`
	&&
	{
		display: flex;
		padding: 1rem;
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
BREADCRUMB_maps_ICON.set('Home', <HomeIcon style={iconStyle} />)
BREADCRUMB_maps_ICON.set('Ban List', <Block style={iconStyle} />)
BREADCRUMB_maps_ICON.set('404 - Err', <ErrorIcon style={iconStyle} />)
BREADCRUMB_maps_ICON.set('About', <InfoIcon style={iconStyle} />)


const Breadcrumb: FunctionComponent<BreadcrumbProps> = ( { crumbs }  ) =>
{
	var Crumbs: JSX.Element[] = crumbs.map((item, ind) =>
	{
		if ((ind === crumbs.length - 1))
		{
			return(
				<BreadCrumbItem
					variant='subtitle1'
					color='inherit'
					key={ind}
					underline='none' >
						{ BREADCRUMB_maps_ICON.get(item) }
						{ item }
				</BreadCrumbItem>
			)
		}

		return(
			<BreadCrumbItem
				variant='subtitle1'
				color='inherit'
				// href={ NAME_maps_ROUTE[item] } --- fix me
				key={ind} >
					{ BREADCRUMB_maps_ICON.get(item) }
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

export default Breadcrumb