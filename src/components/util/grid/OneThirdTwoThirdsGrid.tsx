import { Typography, Box } from '@mui/material'

import Styled from 'styled-components'

import Parent from '../Parent'
import { FC, ReactNode } from 'react'

const LeftBoxSectionTypography = Styled(Typography)`
	&&
	{
		color: rgba(255, 255, 255, .95);
		margin-left: .5rem;
		margin-bottom: .2rem;
	}
`

const RightBoxHeaderContainer = Styled(Box)`
	&&
	{
		margin-bottom: .2rem;
	}
`

const RightBoxHeaderTypography = Styled(Typography)`
	&&
	{
		margin-bottom: .85rem;
	}
`

const RightBoxSubHeaderTypography = Styled(Typography)`
	&&
	{
	}
`

const OneThirdComponent = Styled(Box)`
	&&
	{
		margin-bottom: 2.5rem;

		@media screen and (min-width: 800px)
		{
			min-width: 25rem;
			max-width: 25rem;
		}

		@media screen and (min-width: 1500px)
		{
			min-width: 30rem;
			max-width: 30rem;
		}
	}
`

const MirroredOneThirdComponent = Styled(OneThirdComponent)`
	&&
	{
		@media screen and (min-width: 800px)
		{
			padding-left: 0rem;
		}
	}
`

const TwoThirdComponent = Styled(Box)`
	&&
	{
		@media screen and (min-width: 800px)
		{
			flex-grow: 1;
			padding-left: .8rem;
			width: 1;
		}
	}
`

const MirroredTwoThirdComponent = Styled(Box)`
	&&
	{
		@media screen and (min-width: 800px)
		{
			flex-grow: 1;
			padding-right: .8rem;
			width: 1;
		}
	}
`

type OneThirdTwoThirdsGridType = {
	oneThirdComponent: ReactNode
	twoThirdComponent: ReactNode
	mirrored?: boolean
}

const OneThirdTwoThirdsGrid: FC<OneThirdTwoThirdsGridType> = ({ oneThirdComponent, twoThirdComponent, mirrored = false }) => {
	return (
		<Parent>
			{mirrored ? <MirroredTwoThirdComponent>{twoThirdComponent}</MirroredTwoThirdComponent> : <MirroredOneThirdComponent>{oneThirdComponent}</MirroredOneThirdComponent>}
			{mirrored ? <OneThirdComponent>{oneThirdComponent}</OneThirdComponent> : <TwoThirdComponent>{twoThirdComponent}</TwoThirdComponent>}
		</Parent>
	)
}

export default OneThirdTwoThirdsGrid

export { LeftBoxSectionTypography, RightBoxHeaderTypography, RightBoxSubHeaderTypography, RightBoxHeaderContainer }
