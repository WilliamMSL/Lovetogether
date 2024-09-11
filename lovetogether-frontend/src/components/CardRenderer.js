import React from 'react';
import ActionVerite from './ActionVerite';
import Generator from './Generator';
import Roleplay from './Roleplay';
import { useCard } from './CardContext';

const CardRenderer = () => {
  const { selectedCard } = useCard();

  if (selectedCard === 'ActionVerite') {
    return <ActionVerite />;
  }

  if (selectedCard === 'Generator') {
    return <Generator />;
  }

  if (selectedCard === 'Roleplay') {
    return <Roleplay />;
  }

  return null; // Ou retournez un composant par défaut si aucune carte n'est sélectionnée
};

export default CardRenderer;
