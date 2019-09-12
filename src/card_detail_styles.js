import { blue, teal, pink, orange, deepPurple, grey, yellow } from '@material-ui/core/colors'

const cardStyles = {
	baseText: {
		paddingBottom: '5px',
		'white-space': 'pre-wrap'
	},
	monsterType: {
		fontWeight: 'bold'
	},
	alignRight: {
		'textAlign': 'right'
	},
	normal: {
		background: `linear-gradient(45deg, ${yellow[600]} 30%, ${yellow[800]} 90%)`,
		color: 'black',
	},
	normalSummary: {
		background: yellow[500],
		padding: '10',
		color: 'black',
	},
	effect: {
		background: `linear-gradient(45deg, ${orange[600]} 30%, ${orange[800]} 90%)`,
		color: 'f5f5f5',
	},
	effectSummary: {
		background: orange[500],
		padding: '10',
		color: 'f5f5f5',
	},
	ritual: {
		background: `linear-gradient(45deg, ${blue[500]} 30%, ${blue[700]} 90%)`,
		color: 'f5f5f5',
	},
	ritualSummary: {
		background: blue[100],
		padding: '10',
		color: 'black'
	},
	fusion: {
		background: `linear-gradient(180deg, ${deepPurple[300]} 30%, ${deepPurple[400]} 90%)`,
		color: 'f5f5f5',
	},
	fusionSummary: {
		background: deepPurple[100],
		padding: '10',
		color: 'black'
	},
	synchro: {
		background: `linear-gradient(180deg, ${grey[200]} 30%, ${grey[300]} 90%)`,
		color: 'black',
	},
	synchroSummary: {
		background: grey[100],
		padding: '10',
		color: 'black'
	},
	xyz: {
		background: `linear-gradient(180deg, ${grey[800]} 30%, ${grey[900]} 90%)`,
		color: 'f5f5f5',
	},
	xyzSummary: {
		background: grey[600],
		padding: '10',
		color: 'white'
	},
	'pendulum-normal': {
		background: `linear-gradient(180deg, ${yellow[600]} 30%, ${teal['A700']} 90%)`,
		color: 'black',
	},
	'pendulum-normalSummary': {
		background: blue[100],
		padding: '10',
		color: 'black'
	},
	'pendulum-effect': {
		background: `linear-gradient(180deg, ${orange[600]} 30%, ${teal['A700']} 90%)`,
		color: 'f5f5f5',
	},
	'pendulum-effectSummary': {
		background: blue[100],
		padding: '10',
		color: 'black'
	},
	link: {
		background: `linear-gradient(45deg, ${blue[700]} 30%, ${blue[800]} 90%)`,
		color: 'f5f5f5',
	},
	linkSummary: {
		background: grey[100],
		padding: '10',
		color: 'black'
	},
	spell: {
		background: `linear-gradient(45deg, ${teal['A700']} 30%, ${teal[300]} 90%)`,
		color: 'f5f5f5',
	},
	spellSummary: {
		background: teal[100],
		padding: '10',
		color: 'black'
	},
	trap: {
		background: `linear-gradient(45deg, ${pink[500]} 30%, ${pink[700]} 90%)`,
		color: 'f5f5f5',
	},
	trapSummary: {
		background: pink[100],
		padding: '10',
		color: 'black'
	},
	cardTop: {
		marginBottom: '5'
	},
	cardText: {
		'display': '-webkit-box',
		'-webkit-line-clamp': '3',
		'-webkit-box-orient': 'vertical',
		'overflow': 'hidden'
	},
	tooltip: {
		'tooltip': {
			fontSize: '2000'
		}
	}
}

export default cardStyles