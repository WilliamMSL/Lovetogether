import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './navbar/navbar';
import CardsWrapper from './CardsWrapper';
import { useCard } from './CardContext';
import NavbarRight from './navbar/navbarright';
import CardRenderer from './CardRenderer';
import gsap from 'gsap';
import Logo from './Logo';
import GrainEffect from './GrainEffect';

// Import des images
import whiteLogoSvg from '../images/logo-5.svg';

const BackgroundContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #FFFFFF;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => props.showBackgroundImage ? `url(${props.logoSrc})` : 'none'};
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: ${props => props.showBackgroundImage ? 0.5 : 0};
    z-index: 1;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }
`;

const LogoStyled = styled(Logo)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 10%;
  height: auto;
  transition: z-index 0.5s ease;
`;

const StaticLogo = styled.div`
  width: 100%;
  height: auto;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardsContainer = styled.div`
  position: relative;
  opacity: ${({ opacity }) => opacity};
  transform: translateY(${({ isAnimated }) => (isAnimated ? '0' : '50px')});
  transition: ${({ isAnimated }) => (isAnimated ? 'transform 0.8s ease, opacity 0.8s ease' : 'none')};
  pointer-events: ${({ clickable }) => (clickable ? 'auto' : 'none')};
  z-index: 1000;
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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000000000000;
  pointer-events: none;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 70%;
  pointer-events: auto;
  z-index: 2000;
`;

const Button = styled.button`
  width: 100%;
  max-width: 200px;
  padding: 10px;
  font-size: 16px;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const WhiteOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1500;
  pointer-events: none;
  opacity: 1;
  transition: opacity 1s ease;
`;

const ImageContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
`;

const MainContent = () => {
  const { selectedCard, resetCards } = useCard();
  const [cardsOpacity, setCardsOpacity] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);
  const [cardsClickable, setCardsClickable] = useState(false);
  const [logoSrc, setLogoSrc] = useState(whiteLogoSvg);
  const [showBackgroundImage, setShowBackgroundImage] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const cardsRef = useRef(null);
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  const logoRef = useRef(null);

  const handleEnter = () => {
    gsap.to(logoRef.current, {
      width: '150px',
      top: '100px',
      duration: 3,
      ease: 'power3.out',
      onComplete: () => {
        gsap.to(logoRef.current, {
          duration: 0.5,
        });
      },
    });

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
        setShowNavbar(true);

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

        gsap.from('.navbar', {
          y: -50,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.5
        });
      },
    });
  };

  const handleXIconClick = () => {
    setLogoSrc(whiteLogoSvg);
    setShowBackgroundImage(false);
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
    if (selectedCard) {
      setShowBackgroundImage(false);
    } else {
      setLogoSrc(whiteLogoSvg);
      setShowBackgroundImage(false);
    }
  }, [selectedCard]);

  return (
    <BackgroundContainer 
      logoSrc={logoSrc} 
      showBackgroundImage={showBackgroundImage}
    >
      <GrainContainer>
        <GrainEffect />
      </GrainContainer>

      <LogoStyled ref={logoRef} />

      {showNavbar && <Navbar className="navbar" />}
      {showNavbar && <NavbarRight className="navbar" onResetAnimation={handleXIconClick} />}

      {!selectedCard && (
        <CardsContainer
          ref={cardsRef}
          opacity={cardsOpacity}
          isAnimated={isAnimated}
          clickable={cardsClickable}
        >
          <CardsWrapper 
            setLogoSrc={setLogoSrc}
            setShowBackgroundImage={setShowBackgroundImage}
          />
        </CardsContainer>
      )}

      {selectedCard && <CardRenderer />}

      <WhiteOverlay ref={overlayRef} />
      <OverlayContainer>
        <ButtonContainer ref={buttonRef}>
          <Button onClick={handleEnter}>Entrer</Button>
        </ButtonContainer>
      </OverlayContainer>

      <ImageContainer>
        <StaticLogo>
          <Logo />
        </StaticLogo>
      </ImageContainer>
    </BackgroundContainer>
  );
};

export default MainContent;