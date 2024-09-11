import React, { useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import Logo from './Logo';
import CardsWrapper from './CardsWrapper'; // Assurez-vous que CardsWrapper est importé

const BackgroundContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: ${({ bgColor }) => bgColor};
`;

const WhiteOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: white;
  z-index: 100000002;
  pointer-events: none;
`;

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000003;
  pointer-events: none;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 70%;
  pointer-events: auto;
`;

const LogoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center top; /* Définit le point d'origine de la transformation */
`;

const CardsContainer = styled.div`
  opacity: ${({ opacity }) => opacity};
  transform: translateY(${({ isAnimated }) => (isAnimated ? '0' : '50px')});
  transition: ${({ isAnimated }) => (isAnimated ? 'transform 0.8s ease, opacity 0.8s ease' : 'none')};
  pointer-events: ${({ clickable }) => (clickable ? 'auto' : 'none')};
  z-index: 1000; /* Assurez-vous que le z-index des cartes est supérieur à celui de GrainEffect */
`;

const EntranceAnimation = ({ onEnterComplete, setAnimateLogo, setBackgroundColor }) => {
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  const logoRef = useRef(null); // Référence pour le logo
  const cardsRef = useRef(null); // Référence pour les cartes

  const handleEnter = () => {
    setAnimateLogo(true);

    // Animation du logo : réduction et recentrage
    gsap.to(logoRef.current, {
      duration: 1.5,
      scale: 0.2, // Réduire la taille du logo
      y: -logoRef.current.getBoundingClientRect().top + 50, // Déplace le logo vers le haut avec un offset de 50px
      ease: 'power2.inOut',
    });

    // Animation des overlays et du bouton "Entrer"
    gsap.to([overlayRef.current, buttonRef.current], {
      duration: 1,
      opacity: 0,
      ease: 'power2.out',
      onComplete: () => {
        if (overlayRef.current) {
          overlayRef.current.style.display = 'none';
          overlayRef.current.style.pointerEvents = 'none';
        }

        if (buttonRef.current) {
          buttonRef.current.style.pointerEvents = 'none';
        }

        // Animation des cartes
        if (cardsRef.current) {
          gsap.to(cardsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
            delay: 0.1,
          });
        }

        // Réactiver les clics après 1 seconde
        setTimeout(() => {
          if (cardsRef.current) {
            cardsRef.current.style.pointerEvents = 'auto';
          }
        }, 1000);

        onEnterComplete(); // Appel pour indiquer que l'animation est terminée
      },
    });
  };

  return (
    <BackgroundContainer>
      <LogoContainer ref={logoRef}>
        <Logo />
      </LogoContainer>
      <WhiteOverlay ref={overlayRef} />
      <OverlayContainer>
        <ButtonContainer ref={buttonRef}>
          <button onClick={handleEnter}>Entrer</button>
        </ButtonContainer>
      </OverlayContainer>

      {/* Conteneur pour les cartes */}
      <CardsContainer ref={cardsRef} opacity={0} isAnimated={false} clickable={false}>
        <CardsWrapper setBackgroundColor={setBackgroundColor} />
      </CardsContainer>
    </BackgroundContainer>
  );
};

export default EntranceAnimation;
