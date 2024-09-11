import React from 'react';
import HomeCard from './HomeCard';
import { useCard } from './CardContext';
import styled from 'styled-components';


const CardsContainer = styled.div`
display: flex;
flex-direction: row;
width: 100vw;
height: 100vh;
justify-Content: center;
align-Items: center;
gap: 20px;

transform: scale(1);

  @media (max-width: 500px) {
    transform: scale(0.8);
    flex-direction: column;
  }
`;



const CardsWrapper = ({ setBackgroundColor }) => {
  const { selectCard } = useCard();
  const defaultBackgroundColor = '#FBF8F1';

  const handleCardClick = (card) => {
    selectCard(card);
  };


  
  return (
<CardsContainer>
      <HomeCard
        image={require('../images/TRUTHORDARE.png')}
        rotate="-5deg"
        onMouseEnter={() => setBackgroundColor('#E6E5FF')}
        onMouseLeave={() => setBackgroundColor(defaultBackgroundColor)}
        onClick={() => handleCardClick('ActionVerite')} // Redirige vers 'ActionVerite'
        style={{
          width: '30vw',
          height: '40vh',
          transform: 'rotate(-5deg)',
          backgroundColor: defaultBackgroundColor,
        }}
      />
      <HomeCard
        image={require('../images/POSITIONS.png')}
        rotate="0deg"
        onMouseEnter={() => setBackgroundColor('#DAB2FF')}
        onMouseLeave={() => setBackgroundColor(defaultBackgroundColor)}
        onClick={() => handleCardClick('Generator')} // Redirige vers 'Generator'
        style={{
          width: '30vw',
          height: '40vh',
          transform: 'rotate(0deg)',
          backgroundColor: defaultBackgroundColor,
        }}
      />
      <HomeCard
        image={require('../images/ROLE.png')}
        rotate="5deg"
        onMouseEnter={() => setBackgroundColor('#FFB2C2')}
        onMouseLeave={() => setBackgroundColor(defaultBackgroundColor)}
        onClick={() => handleCardClick('Roleplay')} // Redirige vers 'Roleplay'
        style={{
          width: '30vw',
          height: '40vh',
          transform: 'rotate(5deg)',
          backgroundColor: defaultBackgroundColor,
        }}
      />
</CardsContainer>
  );
};

export default CardsWrapper;
