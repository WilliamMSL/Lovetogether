import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './navbar/navbar';
import CardsWrapper from './CardsWrapper';
import { useCard } from './CardContext';
import NavbarRight from './navbar/navbarright';
import CardRenderer from './CardRenderer';
import gsap from 'gsap';
import Logo from './Logo'; // Utilisation de Logo ici
import GrainEffect from './GrainEffect';

const BackgroundContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: ${({ bgColor }) => bgColor};
`;

const LogoStyled = styled(Logo)`
  position: absolute;
  top: 0; /* Position initiale en haut */
  left: 50%;
  transform: translateX(-50%); /* Centré horizontalement */
  z-index: 10000011001; /* Z-index élevé pour s'assurer qu'il est au-dessus */
  width: 10%; /* 10% width before animation */
  height: auto; /* Ajustement automatique de la hauteur */
  transition: z-index 0.5s ease; /* Transition pour le changement de z-index */
`;

const StaticLogo = styled.div`
  width: 100%; /* Set width to 100% to adapt to parent container */
  height: auto;
  border: 2px solid black; /* Ajout d'une bordure pour visualiser la div du logo */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardsContainer = styled.div`
  opacity: ${({ opacity }) => opacity};
  transform: translateY(${({ isAnimated }) => (isAnimated ? '0' : '50px')});
  transition: ${({ isAnimated }) => (isAnimated ? 'transform 0.8s ease, opacity 0.8s ease' : 'none')};
  pointer-events: ${({ clickable }) => (clickable ? 'auto' : 'none')};
  z-index: 20;
`;

const GrainContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
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
  top: 70%; /* Position initiale du bouton */
  pointer-events: auto;
  z-index: 10000011002; /* Juste au-dessus du logo */
`;

const Button = styled.button`
  width: 100%; /* Prend toute la largeur */
  max-width: 200px; /* Limite la largeur maximale du bouton */
  padding: 10px;
  font-size: 16px;
  color: #000; /* Correction de la couleur du texte */
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
  opacity: 1;
  transition: opacity 1s ease;
`;

const ImageContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 100000; /* Pour s'assurer qu'il est au-dessus des autres éléments */
`;

const MainContent = ({ backgroundColor, setBackgroundColor }) => {
  const { selectedCard, resetCards } = useCard();
  const [cardsOpacity, setCardsOpacity] = useState(0); // Initial opacity set to 0 for animation
  const [isAnimated, setIsAnimated] = useState(false); // Animation state
  const [cardsClickable, setCardsClickable] = useState(false); // Initial clickability off
  const cardsRef = useRef(null);
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  const logoRef = useRef(null); // Ref to control logo directly

  const handleEnter = () => {

    // Animate the logo size and position increase
    gsap.to(logoRef.current, {
      width: '150px',
      top: '100px',
      duration: 3,
      ease: 'power3.out',
      onComplete: () => {
        // Once the animation is complete, change z-index to 0
        gsap.to(logoRef.current, {
          duration: 0.5, // Adding a duration for the z-index change
        });
      },
    });

    // Animate the button position to top: 50px
    gsap.to(buttonRef.current, {
      duration: 1.5,
      ease: 'power2.in',
    });

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
        setIsAnimated(true);
        setCardsOpacity(1);

        if (cardsRef.current) {
          gsap.to(cardsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.1,
            onComplete: () => {
              setCardsClickable(true);
            },
          });
        }
      },
    });
  };

  const handleXIconClick = () => {
    setBackgroundColor('#FFFFFF');
    setTimeout(() => {
      resetCards();
      setIsAnimated(false);
      setCardsOpacity(1);
      setCardsClickable(true);
      if (cardsRef.current) {
        gsap.set(cardsRef.current, { opacity: 1 });
      }
    }, 0);
  };

  useEffect(() => {
    if (!selectedCard) {
      setBackgroundColor('#FFFFFF');
    }
  }, [selectedCard, setBackgroundColor]);

  return (
    <BackgroundContainer bgColor={backgroundColor}>
      <GrainContainer>
        <GrainEffect />
      </GrainContainer>

      <LogoStyled ref={logoRef} />

      <Navbar />
      <NavbarRight onResetAnimation={handleXIconClick} />

      {!selectedCard && (
        <CardsContainer
          ref={cardsRef}
          opacity={cardsOpacity}
          isAnimated={isAnimated}
          clickable={cardsClickable}
        >
          <CardsWrapper setBackgroundColor={setBackgroundColor} />
        </CardsContainer>
      )}

      {selectedCard && <CardRenderer />}

      <WhiteOverlay ref={overlayRef} />
      <OverlayContainer>
        <ButtonContainer ref={buttonRef}>
          <Button onClick={handleEnter}>Entrer</Button>
        </ButtonContainer>
      </OverlayContainer>

      {/* Ajout du logo statique ici */}
      <ImageContainer>
        <StaticLogo>
          <Logo />
        </StaticLogo>
      </ImageContainer>
    </BackgroundContainer>
  );
};

export default MainContent;



