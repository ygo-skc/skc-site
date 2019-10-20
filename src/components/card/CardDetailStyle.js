import { blue, teal, pink, orange, deepPurple, grey, yellow, red, lightBlue } from '@material-ui/core/colors'

const cardStyles = {
	normal: {
		background: `linear-gradient(45deg, ${yellow[700]} 30%, ${yellow[800]} 90%)`,
		color: 'black',
	},
	normalSummary: {
		background: yellow[400],
		padding: '10',
		color: 'black',
	},
	effect: {
		background: `linear-gradient(45deg, ${orange[600]} 10%, ${orange[900]} 90%)`,
		color: '#f5f5f5',
	},
	effectSummary: {
		background: orange['300'],
		padding: '10',
		color: 'black',
	},
	ritual: {
		background: `linear-gradient(45deg, ${blue[500]} 30%, ${blue[700]} 90%)`,
		color: '#f5f5f5',
	},
	ritualSummary: {
		background: blue[100],
		padding: '10',
		color: 'black'
	},
	fusion: {
		background: `linear-gradient(180deg, ${deepPurple[300]} 30%, ${deepPurple[400]} 90%)`,
		color: '#f5f5f5',
	},
	fusionSummary: {
		background: deepPurple[50],
		padding: '10',
		color: 'black'
	},
	synchro: {
		background: `linear-gradient(180deg, ${grey[300]} 10%, ${grey[400]} 90%)`,
		color: 'black',
	},
	synchroSummary: {
		background: grey[100],
		padding: '10',
		color: 'black'
	},
	xyz: {
		background: `linear-gradient(180deg, ${grey[800]} 30%, ${grey[900]} 90%)`,
		color: '#f5f5f5',
	},
	xyzSummary: {
		background: grey[300],
		padding: '10',
		color: 'black'
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
		background: `linear-gradient(180deg, ${orange[700]} 50%, ${teal['A700']} 65%)`,
		color: '#f5f5f5',
	},
	'pendulum-effectSummary': {
		background: teal[50],
		padding: '10',
		color: 'black'
	},
	link: {
		background: `linear-gradient(45deg, ${blue[700]} 30%, ${blue[800]} 90%)`,
		color: '#f5f5f5',
	},
	linkSummary: {
		background: lightBlue[100],
		padding: '10',
		color: 'black'
	},
	spell: {
		background: `linear-gradient(45deg, ${teal['A700']} 30%, #00ae96 90%)`,
		color: '#f5f5f5',
	},
	spellSummary: {
		background: teal[50],
		padding: '10',
		color: 'black'
	},
	trap: {
		background: `linear-gradient(45deg, ${pink[600]} 30%, ${pink[800]} 90%)`,
		color: '#f5f5f5',
	},
	trapSummary: {
		background: pink[400],
		padding: '10',
		color: '#f5f5f5'
	},
	err: {
		background: `linear-gradient(45deg, ${red[500]} 30%, ${red[600]} 90%)`,
		color: '#f5f5f5',
	},
	errSummary: {
		background: red['100'],
		padding: '10',
		color: 'black'
	},
}

export default cardStyles