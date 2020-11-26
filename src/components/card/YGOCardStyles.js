import { blue, teal, pink, deepPurple, grey, lightBlue } from '@material-ui/core/colors'

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

	'pendulum-normalBackground': `linear-gradient(#f9c414 40%, #00cdb1 55%)`,
	'pendulum-normalColor': lightTextColor,
	'pendulum-normalSummaryBackground': 'rgba(238, 248, 247, 0.72)',
	'pendulum-normalSummaryColor': darkTextColor,

	'pendulum-effectBackground': `linear-gradient(#ff6410 40%, #00cdb1 55%)`,
	'pendulum-effectTableBackground': `linear-gradient(#ff6410 40%, #00cdb1 55%)`,
	'pendulum-effectColor': lightTextColor,
	'pendulum-effectSummaryBackground': 'rgba(238, 248, 247, 0.72)',
	'pendulum-effectSummaryColor': darkTextColor,

	'pendulum-fusionBackground': `linear-gradient(#7e57c2 40%, #00cdb1 55%)`,
	'pendulum-fusionTableBackground': `linear-gradient(#7e57c2 40%, #00cdb1 55%)`,
	'pendulum-fusionColor': lightTextColor,
	'pendulum-fusionSummaryBackground': 'rgba(238, 248, 247, 0.72)',
	'pendulum-fusionSummaryColor': darkTextColor,

	'pendulum-xyzBackground': `linear-gradient(${grey[800]}  40%, #00cdb1 55%)`,
	'pendulum-xyzTableBackground': `linear-gradient(${grey[800]}  40%, #00cdb1 55%)`,
	'pendulum-xyzColor': lightTextColor,
	'pendulum-xyzSummaryBackground': 'rgba(238, 248, 247, 0.72)',
	'pendulum-xyzSummaryColor': darkTextColor,

	'pendulum-synchroBackground': `linear-gradient(${grey[300]} 40%, #00cdb1 55%)`,
	'pendulum-synchroTableBackground': `linear-gradient(${grey[300]} 40%, #00cdb1 55%)`,
	'pendulum-synchroColor': darkTextColor,
	'pendulum-synchroSummaryBackground': 'rgba(238, 248, 247, 0.72)',
	'pendulum-synchroSummaryColor': darkTextColor,

	tokenBackground: `linear-gradient(180deg, ${grey[600]} 30%, ${grey[700]} 90%)`,
	tokenTableBackground: `${grey[700]}`,
	tokenColor: lightTextColor,
	tokenSummaryBackground: grey[400],
	tokenSummaryColor: darkTextColor,

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

	errBackground: 'linear-gradient(315deg, #feae96 0%, #fe0944 74%)',
	errColor: lightTextColor,
	errSummaryBackground: 'rgba(0, 0, 0, .25)',
	errSummaryColor: lightTextColor,
}

export default cardStyles