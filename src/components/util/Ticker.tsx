import React, { ReactNode } from 'react'
import '../../css/util/ticker.css' // Import the CSS file

interface TickerProps {
	children: ReactNode // Accepts children as the ticker content
}

const Ticker: React.FC<TickerProps> = ({ children }) => {
	return (
		<div className='stock-ticker'>
			<div>{children}</div>
			<div aria-hidden='true'>{children}</div>
		</div>
	)
}

export default Ticker
