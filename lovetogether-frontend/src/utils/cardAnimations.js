import { gsap } from 'gsap';

export const initializeCardPositions = (leftCardRef, rightCardRef) => {
  gsap.set(leftCardRef.current, { x: '-150px', rotation: -10 });
  gsap.set(rightCardRef.current, { x: '150px', rotation: 10 });
};

export const animateCardSelection = (selectedCard, otherCard, isLeftCard) => {
  // Animer la carte sélectionnée vers le centre avec une animation rapide
  gsap.to(selectedCard.current, { 
    duration: 0.4, 
    x: 0, 
    y: 0, 
    rotation: 0, 
    scale: 1,
    ease: 'power2.out'
  });

  // Faire sortir l'autre carte avec une animation rapide
  const exitDirection = isLeftCard ? 1000 : -1000;
  gsap.to(otherCard.current, { 
    duration: 0.4, 
    x: exitDirection, 
    opacity: 0,
    ease: 'power2.in'
  });

  // Note: Le flip sera déclenché séparément après la réponse API
};

export const flipCard = (selectedCard) => {
  // Retourner la carte avec une animation rapide
  gsap.to(selectedCard.current.querySelector('.inner'), { 
    rotationY: 180,
    duration: 0.4,
    ease: 'power2.out'
  });
};

export const resetCardPositions = (leftCardRef, rightCardRef) => {
  gsap.to(leftCardRef.current.querySelector('.inner'), { 
    rotationY: 0,
    duration: 0.4,
    ease: 'power2.out'
  });
  gsap.to(rightCardRef.current.querySelector('.inner'), { 
    rotationY: 0,
    duration: 0.4,
    ease: 'power2.out'
  });
  gsap.to(leftCardRef.current, { 
    duration: 0.4, 
    x: '-150px', 
    rotation: -10, 
    scale: 1, 
    opacity: 1,
    ease: 'power2.out'
  });
  gsap.to(rightCardRef.current, { 
    duration: 0.4, 
    x: '150px', 
    rotation: 10, 
    scale: 1, 
    opacity: 1,
    ease: 'power2.out'
  });
};

