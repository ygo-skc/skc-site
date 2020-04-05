import { blue, teal, pink, deepPurple, grey, red, lightBlue } from '@material-ui/core/colors'

const lightTextColor = '#fffbeb'
const darkTextColor = '#2b2a2a'

const cardStyles = {
	normalBackground: `linear-gradient(185deg, #f9a825, #fbc02d)`,
	normalTableBackground: `#fbc02d`,
	normalColor: lightTextColor,
	normalSummaryBackground: '#ffeb90',
	normalSummaryColor: darkTextColor,

	effectBackground: `linear-gradient(185deg, #e65100 25%, #fb8c00 85%)`,
	effectTableBackground: `#ea8300`,
	effectColor: lightTextColor,
	effectSummaryBackground: '#ffbf62',
	effectSummaryColor: darkTextColor,

	ritualBackground: `linear-gradient(185deg, #56b1fa 25%, #4e9fee 85%)`,
	ritualTableBackground: `#56b1fa`,
	ritualColor: lightTextColor,
	ritualSummaryBackground: blue[100],
	ritualSummaryColor: darkTextColor,

	fusionBackground: `linear-gradient(185deg, #7e57c2 25%, #9575cd 85%)`,
	fusionTableBackground: `#7e57c2`,
	fusionColor: lightTextColor,
	fusionSummaryBackground: deepPurple[50],
	fusionSummaryColor: darkTextColor,

	synchroBackground: `linear-gradient(180deg, ${grey[300]} 10%, ${grey[400]} 90%)`,
	synchroTableBackground: `${grey[300]}`,
	synchroColor: darkTextColor,
	synchroSummaryBackground: grey[100],
	synchroSummaryColor: darkTextColor,

	xyzBackground: `linear-gradient(180deg, ${grey[800]} 30%, ${grey[900]} 90%)`,
	xyzTableBackground: `${grey[900]}`,
	xyzColor: lightTextColor,
	xyzSummaryBackground: grey[300],
	xyzSummaryColor: darkTextColor,

	'pendulum-normalBackground': `linear-gradient(#f9c414 50%, #00cdb1 55%)`,
	'pendulum-normalColor': lightTextColor,
	'pendulum-normalSummaryBackground': 'rgba(238, 248, 247, 0.72)',
	'pendulum-normalSummaryColor': darkTextColor,

	'pendulum-effectBackground': `linear-gradient(#ff6410 50%, #00cdb1 55%)`,
	'pendulum-effectTableBackground': `linear-gradient(#ff6410 50%, #00cdb1 55%)`,
	'pendulum-effectColor': lightTextColor,
	'pendulum-effectSummaryBackground': 'rgba(238, 248, 247, 0.72)',
	'pendulum-effectSummaryColor': darkTextColor,

	linkBackground: `linear-gradient(45deg, ${blue[700]} 30%, ${blue[800]} 90%)`,
	linkTableBackground: `${blue[800]}`,
	linkColor: lightTextColor,
	linkSummaryBackground: lightBlue[100],
	linkSummaryColor: darkTextColor,

	spellBackground: `linear-gradient(45deg, ${teal['A700']} 30%, #00ae96 90%)`,
	spellTableBackground: `${teal['A700']}`,
	spellColor: lightTextColor,
	spellSummaryBackground: teal[50],
	spellSummaryColor: darkTextColor,

	trapBackground: `linear-gradient(185deg, #ad1457 25%, #d81b60 85%)`,
	trapTableBackground: '#ad1457',
	trapColor: lightTextColor,
	trapSummaryBackground: pink[400],
	trapSummaryColor: lightTextColor,

	errBackground: `linear-gradient(45deg, ${red[500]} 30%, ${red[600]} 90%)`,
	errColor: lightTextColor,
	errSummaryBackground: red['100'],
	errSummaryColor: darkTextColor,
}

export default cardStyles