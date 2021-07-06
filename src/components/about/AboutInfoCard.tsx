import React, { FunctionComponent } from 'react'

import { Typography, Link, Paper } from '@material-ui/core'
import styled from 'styled-components'

import {DarkTranslucentDivider} from '../util/Divider'

import GenericLinkPhoto from '../util/photo/GenericLinkPhoto'

const CustomLink = styled(Link)`
	&&
	{
		background: rgba(253, 237, 221, 1);
		padding: .15rem;
	}
`


const CenteredText = styled(Typography)`
	&&
	{
		text-align: center;
	}
`


const HeaderWithSubheader = styled(CenteredText)`
	&&
	{
		margin-bottom: .55rem;
	}
`


const CenteredImage = styled.div`
	text-align: center;
	margin-bottom: 2rem;
	min-height: 100px;
`


const InfoPaper2 = styled(Paper)`
	&&
	{
		max-width: 100%;
		padding: 1.4rem;
		border-radius: 1.2rem;

		background: white;
	}
`


type AboutInfoCardProps = {
	title: string
	, subtitle: string
	, body: JSX.Element
	, imgPath: string
	, imgLink: string
}


const AboutInfoCard: FunctionComponent<AboutInfoCardProps> = ({title, subtitle, body, imgPath, imgLink}) => (
	<InfoPaper2 style={{maxWidth: '100%'}} >
		<CenteredImage >
			<GenericLinkPhoto
				imageName={imgPath}
				link={imgLink}
			/>
		</CenteredImage>
		<HeaderWithSubheader variant='h4'>
			{title}
		</HeaderWithSubheader>
		<CenteredText
			variant='h5'>
			{subtitle}
		</CenteredText>

		<Typography variant='body1'>
			{body}
		</Typography>
	</InfoPaper2>
)


export default AboutInfoCard