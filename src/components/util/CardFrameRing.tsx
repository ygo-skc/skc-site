import { FC, ReactNode } from 'react'

// the card's frame colour as a ring around its round art in a list row - rcl's frame classes, so the colours (and the pendulum split) stay rcl's. no colour, no ring
const CardFrameRing: FC<{ cardColor?: YGOCard.Color | string; children: ReactNode }> = ({ cardColor, children }) =>
	cardColor ? <span className={`card-frame-ring ${cardColor.toLowerCase()}-ygo-card-style`}>{children}</span> : <>{children}</>

export default CardFrameRing
