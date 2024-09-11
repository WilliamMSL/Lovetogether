import React, { useState, useEffect, useContext } from 'react';
import LottieAnimation from './LottieAnimation';
import ActionVerite from './ActionVerite';  
import Roleplay from './Roleplay';
import Generator from './Generator';
import { UserProvider, UserContext } from './UserContext'; // Import the provider and context
import { useCard } from './CardContext';

const TransitionPage = () => {
  const { selectedCard, isLottieVisible, finishAnimation } = useCard();
  const [showNewContent, setShowNewContent] = useState(false);

  const { firstName1, firstName2 } = useContext(UserContext); // Consommer les prénoms depuis le contexte

  useEffect(() => {
    if (!isLottieVisible && selectedCard) {
      const timer = setTimeout(() => {
        setShowNewContent(true);
      }, 0); // Délai de 1 seconde après la fin de l'animation

      return () => clearTimeout(timer);
    }
  }, [isLottieVisible, selectedCard]);

  const getLottieData = () => {
    // Utilisation du même fichier Lottie pour toutes les cartes
    return require('../test.json');
  };

  const getNewContent = () => {
    if (!showNewContent) return null;

    switch (selectedCard) {
      case 'card1':
        return <ActionVerite />;
      case 'card2':
        return <Generator />;
      case 'card3':
        return <Roleplay />;
      default:
        return null;
    }
  };

  return (
    <div>
      {isLottieVisible && (
        <LottieAnimation
          animationData={getLottieData()}
          onComplete={finishAnimation}
        />
      )}
      {!isLottieVisible && showNewContent && (
        <div style={{ width: '100vw', height: '100vh' }}>
          {getNewContent()}
        </div>
      )}
    </div>
  );
};

export default TransitionPage;
