import React, { useState, useEffect } from 'react';
import LottieAnimation from './LottieAnimation';
import { usePage } from './PageContext';

const NavbarTransitionPage = ({ onComplete, onBack }) => {
  const { currentPage, isLottieVisible, finishAnimation } = usePage();
  const [showNewContent, setShowNewContent] = useState(false);

  useEffect(() => {
    if (!isLottieVisible && currentPage) {
      const timer = setTimeout(() => {
        setShowNewContent(true);
      }, 1000); // Délai de 1 seconde après la fin de l'animation

      return () => clearTimeout(timer);
    }
  }, [isLottieVisible, currentPage]);

  const getLottieData = () => {
    // Logique spécifique aux animations Lottie pour la Navbar
  };

  const getNewContent = () => {
    // Logique pour afficher le contenu après l'animation en fonction de currentPage
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
        <div>
          {getNewContent()}
          <button onClick={onBack}>Back</button>
        </div>
      )}
    </div>
  );
};

export default NavbarTransitionPage;