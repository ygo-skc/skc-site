import React from 'react'
import { Typography, Box } from '@material-ui/core'
import Styled from 'styled-components'

const MonsterAtkDefComponent = Styled(Typography)`
	&&
	{
		display: inline-block;
		font-weight: 800;
	}
`

const modifyStat = (stat) => {
	if (stat === undefined)	return '?'
	return stat
}

const AtkDef = ({monsterAtk, monsterDef, cardColor}) =>
{

	return(
		<Box style={{ width: '100%', textAlign: 'right'}} >
			<Box style={{ background: 'rgba(255, 255, 255, .75)', display: 'inline-block', paddingTop: '.2rem', paddingBottom: '.2rem', paddingLeft: '.7rem', paddingRight: '.7rem', borderRadius: '4rem', textAlign: 'center'}} >
				<MonsterAtkDefComponent
					style={{ color: 'rgb(255, 77, 77, .93)' }}
					variant='body1' >
					{modifyStat(monsterAtk)}
				</MonsterAtkDefComponent>

				{(cardColor !== 'Link')?
					<MonsterAtkDefComponent
						style={{ marginLeft: '.6rem', color: 'rgba(77, 166, 255, .9)' }}
						variant='body1' >
						{modifyStat(monsterDef)}
					</MonsterAtkDefComponent>
					: undefined
				}
			</Box>
		</Box>
	)
}

export default AtkDef