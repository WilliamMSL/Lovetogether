import React, { useState, useEffect } from 'react';
import HomeCard from './HomeCard';
import { useCard } from './CardContext';
import styled from 'styled-components';

// Import des images
import whiteLogoSvg from '../images/logo-truth.svg';
import whiteLogo10Svg from '../images/logo-role.svg';
import whiteLogo20Svg from '../images/logo-positions.svg';

import truthOrDareImage from '../images/TRUTHORDARE.png';
import positionsImage from '../images/POSITIONS.png';
import roleImage from '../images/ROLE.png';

import truthOrDareImageMobile from '../images/TRUTHORDARE-mobile.png';
import positionsImageMobile from '../images/POSITIONS-mobile.png';
import roleImageMobile from '../images/ROLE-mobile.png';

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  gap: 20px;
  transform: scale(1);
  position: relative;
  z-index: 1000;

  @media (max-width: 800px) {
    flex-direction: column;
    transform: scale(0.9);
    gap: 0px;
  }
`;

const StyledHomeCard = styled(HomeCard)`
  position: relative;
  z-index: 1001;
  width: ${props => props.isMobile ? '392px' : '30vw'};
  height: ${props => props.isMobile ? '254px' : '40vh'};
  transform: ${props => `rotate(${props.rotate})`};
  background-color: #FBF8F1;
`;

const CardsWrapper = ({ setLogoSrc, setShowBackgroundImage }) => {
  const { selectCard } = useCard();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = (card) => {
    selectCard(card);
  };

  const handleMouseEnter = (logo) => {
    setLogoSrc(logo);
    setShowBackgroundImage(true);
  };

  const handleMouseLeave = () => {
    setShowBackgroundImage(false);
  };

  const getImage = (desktopImage, mobileImage) => {
    return isMobile ? mobileImage : desktopImage;
  };

  return (
    <CardsContainer>
      <StyledHomeCard
        image={getImage(truthOrDareImage, truthOrDareImageMobile)}
        rotate="-5deg"
        onMouseEnter={() => handleMouseEnter(whiteLogoSvg)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleCardClick('ActionVerite')}
        isMobile={isMobile}
      />
      <StyledHomeCard
        image={getImage(positionsImage, positionsImageMobile)}
        rotate="0deg"
        onMouseEnter={() => handleMouseEnter(whiteLogo10Svg)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleCardClick('Generator')}
        isMobile={isMobile}
      />
      <StyledHomeCard
        image={getImage(roleImage, roleImageMobile)}
        rotate="5deg"
        onMouseEnter={() => handleMouseEnter(whiteLogo20Svg)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleCardClick('Roleplay')}
        isMobile={isMobile}
      />
    </CardsContainer>
  );
};

export default CardsWrapper;