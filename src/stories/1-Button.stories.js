import React from 'react';
import CardDetail from '../components/card/CardDetail'

export default {
  title: 'CardDetail',
};

export const CardDetails = () => <CardDetail
cardID={12345678} cardName='Javi' monsterType='Spellcaster' cardColor='fusion'
						cardEffect='When summoned, win duel' cardClicked={false} fullDetails={false}/>;
