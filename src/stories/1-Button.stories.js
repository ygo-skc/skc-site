import React from 'react';
import CardDetails from '../components/card/BanListYGOCard'

export default {
  title: 'CardDetails',
};

export const CardDetails = () => <CardDetails
cardID={12345678} cardName='Javi' monsterType='Spellcaster' cardColor='fusion'
						cardEffect='When summoned, win duel' cardClicked={false} fullDetails={false}/>;
