import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeCard from './HomeCard';
import styled from 'styled-components';
import { ReactComponent as ChevronLeftIcon } from '../images/assets/icons/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from '../images/assets/icons/chevron-right.svg';

// Import des images
import whiteLogoSvg from '../images/logo-truth.svg';
import whiteLogo10Svg from '../images/logo-role.svg';
import whiteLogo20Svg from '../images/logo-positions.svg';

import background1 from '../images/backgrounds/background-1.png';
import background2 from '../images/backgrounds/background-2.png';
import background3 from '../images/backgrounds/background-3.png';
import background4 from '../images/backgrounds/background-4.png';

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1000;
  width: 100%;
  flex-wrap: nowrap;

  @media (max-width: 800px) {
    overflow: hidden;
    width: 100%;
    gap: 0;
  }
`;

const CardsTrack = styled.div`
  display: flex;
  gap: 20px;
  transition: transform 0.3s ease-in-out;
  
  @media (max-width: 800px) {
    transform: translateX(${props => props.offset}px);
  }
`;

const NavButton = styled.button`
  display: none;
  
  @media (max-width: 800px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #F3F3F3;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1001;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #E8E8E8;
      transform: translateY(-50%) scale(1.05);
    }
    
    &:active {
      transform: translateY(-50%) scale(0.95);
    }
    
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    
    svg {
      width: 20px;
      height: 20px;
      color: #111111;
    }
  }
`;

const PrevButton = styled(NavButton)`
  left: 10px;
`;

const NextButton = styled(NavButton)`
  right: 10px;
`;

const StyledHomeCard = styled(HomeCard)`
  position: relative;
  z-index: 1001;
  width: 300px !important;
  height: 300px !important;
  min-width: 300px;
  min-height: 300px;
  max-width: 300px;
  max-height: 300px;
  transform: ${props => `rotate(${props.rotate})`};
  background-color: #FBF8F1;

  @media (max-width: 800px) {
    width: 280px !important;
    height: 280px !important;
    min-width: 280px;
    min-height: 280px;
    max-width: 280px;
    max-height: 280px;
  }
`;

const CardsWrapper = ({ setLogoSrc, setShowBackgroundImage, currentCardIndex, onCardHover }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(280);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 800;
      setIsMobile(mobile);
      if (mobile) {
        setCardWidth(280);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mettre à jour le label hover quand la card active change sur mobile
  useEffect(() => {
    if (isMobile && onCardHover) {
      const labels = ['Truth or Dare', 'Positions', 'Roleplay', 'Roulette'];
      onCardHover(labels[currentIndex]);
    }
  }, [isMobile, currentIndex, onCardHover]);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(3, prev + 1));
  };

  const getOffset = () => {
    if (!isMobile) return 0;
    const containerWidth = window.innerWidth;
    const cardCenter = containerWidth / 1; // Centre du container
    const gap = 20; // Gap entre les cards
    const cardWithGap = cardWidth + gap;
    // Position du centre de la card actuelle
    const currentCardCenter = (currentIndex * cardWithGap) + (cardWidth / 6);
    // Offset pour centrer la card actuelle
    return cardCenter - currentCardCenter;
  };

  const handleMouseEnter = (logo, label) => {
    // setLogoSrc(logo);
    // setShowBackgroundImage(true);
    if (onCardHover) {
      onCardHover(label);
    }
  };

  const handleMouseLeave = () => {
    // setShowBackgroundImage(false);
    if (onCardHover) {
      onCardHover(null);
    }
  };

  return (
    <CarouselWrapper>
      {isMobile && (
        <PrevButton onClick={handlePrev} disabled={currentIndex === 0}>
          <ChevronLeftIcon />
        </PrevButton>
      )}
      
      <CardsContainer>
        <CardsTrack offset={getOffset()}>
          <StyledHomeCard
            image={background1}
            rotate="0deg"
            label="Truth or Dare"
            onMouseEnter={() => handleMouseEnter(whiteLogoSvg, 'Truth or Dare')}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/action-verite')}
            isMobile={isMobile}
            isActive={isMobile && currentIndex === 0}
          />
          <StyledHomeCard
            image={background2}
            rotate="0deg"
            label="Positions"
            onMouseEnter={() => handleMouseEnter(whiteLogo10Svg, 'Positions')}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/generator')}
            isMobile={isMobile}
            isActive={isMobile && currentIndex === 1}
          />
          <StyledHomeCard
            image={background3}
            rotate="0deg"
            label="Roleplay"
            onMouseEnter={() => handleMouseEnter(whiteLogo20Svg, 'Roleplay')}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/roleplay')}
            isMobile={isMobile}
            isActive={isMobile && currentIndex === 2}
          />
          <StyledHomeCard
            image={background4}
            rotate="0deg"
            label="Roulette"
            onMouseEnter={() => handleMouseEnter(whiteLogo20Svg, 'Roulette')}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/roulette')}
            isMobile={isMobile}
            isActive={isMobile && currentIndex === 3}
          />
        </CardsTrack>
      </CardsContainer>
      
      {isMobile && (
        <NextButton onClick={handleNext} disabled={currentIndex === 3}>
          <ChevronRightIcon />
        </NextButton>
      )}
    </CarouselWrapper>
  );
};

export default CardsWrapper;