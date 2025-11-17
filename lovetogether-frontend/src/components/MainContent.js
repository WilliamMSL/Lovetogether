import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardsWrapper from './CardsWrapper';
import { useCard } from './CardContext';
import gsap from 'gsap';
import GrainEffect from './GrainEffect';
import HeaderButton from './HeaderButton';
import { ReactComponent as UserIcon } from '../images/assets/icons/user.svg';
import { ReactComponent as SlidersIcon } from '../images/assets/icons/sliders.svg';
import { ReactComponent as XIcon } from '../images/assets/icons/x-square.svg';
import { useSettingsModal } from '../contexts/SettingsModalContext';
import { useUsersModal } from '../contexts/UsersModalContext';

// Import des images
import whiteLogoSvg from '../images/logo-5.svg';
import LoveTogetherLogo from '../images/LoveTogether_logo.svg';

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

const HeaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 50px;
  z-index: 1002;
  pointer-events: none;
  
  @media (max-width: 768px) {
    padding-left: 30px;
    padding-right: 30px;
  }
`;

const LogoContainer = styled.div`
  pointer-events: auto;
  height: 46px;
  display: flex;
  align-items: center;
  
  img {
    height: 100%;
    width: auto;
  }
`;

const HeaderButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  pointer-events: auto;
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${({ opacity }) => opacity};
  transform: translateY(${({ isAnimated }) => (isAnimated ? '0' : '50px')});
  transition: ${({ isAnimated }) => (isAnimated ? 'transform 0.8s ease, opacity 0.8s ease' : 'none')};
  pointer-events: ${({ clickable }) => (clickable ? 'auto' : 'none')};
  z-index: 1000;
  padding-bottom: 100px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const QuestionText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
  text-align: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &.yes {
    background: #191919;
    &:hover {
      background: #2d2d2d;
      transform: translateY(-2px);
    }
  }

  &.no {
    background: #EF4136;
    &:hover {
      background: #d6362a;
      transform: translateY(-2px);
    }
  }
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

const BottomButtonContainer = styled.div`
  position: absolute;
  bottom: 48px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 1001;
`;

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  height: 44px;
  background-color: #F3F3F3;
  border: none;
  border-radius: 1000px;
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover {
    background-color: #E8E8E8;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MainContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetCards } = useCard();
  const { openModal } = useSettingsModal();
  const { openUsersModal } = useUsersModal();
  const [cardsOpacity, setCardsOpacity] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);
  const [cardsClickable, setCardsClickable] = useState(false);
  const [logoSrc, setLogoSrc] = useState(whiteLogoSvg);
  const [showBackgroundImage, setShowBackgroundImage] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [hasAcceptedAge, setHasAcceptedAge] = useState(() => {
    return localStorage.getItem('hasAcceptedAge') === 'true';
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [hoveredCardLabel, setHoveredCardLabel] = useState(null);
  const cardsRef = useRef(null);
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  
  const isHomePage = location.pathname === '/';

  const handleAgeVerification = (accepted) => {
    if (!accepted) {
      // Rediriger vers Google.fr si l'utilisateur n'est pas majeur
      window.location.href = 'https://www.google.fr';
      return;
    }

    // Sauvegarder dans localStorage que l'utilisateur a accepté
    localStorage.setItem('hasAcceptedAge', 'true');
    setHasAcceptedAge(true);

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
      },
    });
  };

  // Si l'utilisateur a déjà accepté, afficher directement le contenu
  useEffect(() => {
    if (hasAcceptedAge) {
      setIsAnimated(true);
      setCardsOpacity(1);
      setShowNavbar(true);
      setCardsClickable(true);
      if (overlayRef.current) {
        overlayRef.current.style.display = 'none';
        overlayRef.current.style.pointerEvents = 'none';
      }
      if (buttonRef.current) {
        buttonRef.current.style.display = 'none';
        buttonRef.current.style.pointerEvents = 'none';
      }
      if (cardsRef.current) {
        gsap.set(cardsRef.current, { opacity: 1, y: 0 });
      }
    }
  }, [hasAcceptedAge]);




  const handleLogoClick = () => {
    navigate('/');
    // Réinitialiser l'état si nécessaire
    resetCards();
    setLogoSrc(whiteLogoSvg);
    setShowBackgroundImage(false);
  };

  return (
    <BackgroundContainer 
      logoSrc={logoSrc} 
      showBackgroundImage={showBackgroundImage}
    >
      <GrainContainer>
        <GrainEffect />
      </GrainContainer>

      {showNavbar && (
        <HeaderContainer>
          <LogoContainer onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src={LoveTogetherLogo} alt="LoveTogether" />
          </LogoContainer>
          <HeaderButtonsContainer>
            <HeaderButton 
              icon={<UserIcon />} 
              onClick={openUsersModal} 
              aria-label="Joueurs"
            />
            <HeaderButton 
              icon={<SlidersIcon />} 
              onClick={openModal} 
              aria-label="Paramètres"
            />
            {showBackgroundImage && (
              <HeaderButton 
                icon={<XIcon />} 
                onClick={() => {
                  setShowBackgroundImage(false);
                  setLogoSrc(whiteLogoSvg);
                }} 
                aria-label="Fermer"
              />
            )}
          </HeaderButtonsContainer>
        </HeaderContainer>
      )}

      {isHomePage && (
        <CardsContainer
          ref={cardsRef}
          opacity={hasAcceptedAge ? cardsOpacity : 0}
          isAnimated={isAnimated}
          clickable={cardsClickable}
        >
          <CardsWrapper 
            setLogoSrc={setLogoSrc}
            setShowBackgroundImage={setShowBackgroundImage}
            currentCardIndex={currentCardIndex}
            onCardHover={setHoveredCardLabel}
          />
          {showNavbar && (
            <BottomButtonContainer>
              <GenerateButton onClick={() => {}}>
                {hoveredCardLabel || 'Sélectionnez une carte'}
              </GenerateButton>
            </BottomButtonContainer>
          )}
        </CardsContainer>
      )}

      {!hasAcceptedAge && (
        <>
          <WhiteOverlay ref={overlayRef} />
          <OverlayContainer>
            <ButtonContainer ref={buttonRef}>
              <QuestionText>Je suis majeur ?</QuestionText>
              <ButtonsWrapper>
                <Button className="yes" onClick={() => handleAgeVerification(true)}>
                  Oui
                </Button>
                <Button className="no" onClick={() => handleAgeVerification(false)}>
                  Non
                </Button>
              </ButtonsWrapper>
            </ButtonContainer>
          </OverlayContainer>
        </>
      )}
    </BackgroundContainer>
  );
};

export default MainContent;