import React, { useRef, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardsWrapper from './CardsWrapper';
import { useCard } from './CardContext';
import GrainEffect from './GrainEffect';
import HeaderButton from './HeaderButton';
import { ReactComponent as UserIcon } from '../images/assets/icons/user.svg';
import { ReactComponent as SlidersIcon } from '../images/assets/icons/sliders.svg';
import { ReactComponent as XIcon } from '../images/assets/icons/x-square.svg';
import { useSettingsModal } from '../contexts/SettingsModalContext';
import { useUsersModal } from '../contexts/UsersModalContext';
import { UserContext } from './UserContext';

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

const SettingsButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -45px;
  right: 0;
  transform: translateX(0);
  background-color: #000000;
  color: #FFFFFF;
  padding: 8px 12px;
  border-radius: 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1001;
  pointer-events: none;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: -4px;
    right: 20px;
    transform: translateX(0);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #000000;
  }
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
  const { selectedToys } = useContext(UserContext);
  const [cardsOpacity, setCardsOpacity] = useState(1);
  const [isAnimated, setIsAnimated] = useState(true);
  const [cardsClickable, setCardsClickable] = useState(true);
  const [logoSrc, setLogoSrc] = useState(whiteLogoSvg);
  const [showBackgroundImage, setShowBackgroundImage] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [hoveredCardLabel, setHoveredCardLabel] = useState(null);
  const cardsRef = useRef(null);
  
  const isHomePage = location.pathname === '/';




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
            <SettingsButtonWrapper>
              <HeaderButton 
                icon={<SlidersIcon />} 
                onClick={openModal} 
                aria-label="Paramètres"
              />
              <Tooltip show={!selectedToys || selectedToys.length === 0}>
                Sélectionnez des jouets
              </Tooltip>
            </SettingsButtonWrapper>
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
          opacity={cardsOpacity}
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

    </BackgroundContainer>
  );
};

export default MainContent;