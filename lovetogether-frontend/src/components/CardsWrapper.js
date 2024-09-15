import React from 'react';
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

  @media (max-width: 500px) {
    transform: scale(0.8);
    flex-direction: column;
  }
`;

const StyledHomeCard = styled(HomeCard)`
  position: relative;
  z-index: 1001;
`;

const CardsWrapper = ({ setLogoSrc, setShowBackgroundImage }) => {
  const { selectCard } = useCard();

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

  return (
    <CardsContainer>
      <StyledHomeCard
        image={truthOrDareImage}
        rotate="-5deg"
        onMouseEnter={() => handleMouseEnter(whiteLogoSvg)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleCardClick('ActionVerite')}
        style={{
          width: '30vw',
          height: '40vh',
          transform: 'rotate(-5deg)',
          backgroundColor: '#FBF8F1',
        }}
      />
      <StyledHomeCard
        image={positionsImage}
        rotate="0deg"
        onMouseEnter={() => handleMouseEnter(whiteLogo10Svg)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleCardClick('Generator')}
        style={{
          width: '30vw',
          height: '40vh',
          transform: 'rotate(0deg)',
          backgroundColor: '#FBF8F1',
        }}
      />
      <StyledHomeCard
        image={roleImage}
        rotate="5deg"
        onMouseEnter={() => handleMouseEnter(whiteLogo20Svg)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleCardClick('Roleplay')}
        style={{
          width: '30vw',
          height: '40vh',
          transform: 'rotate(5deg)',
          backgroundColor: '#FBF8F1',
        }}
      />
    </CardsContainer>
  );
};

export default CardsWrapper;