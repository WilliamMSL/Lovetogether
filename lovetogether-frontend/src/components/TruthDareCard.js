import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  perspective: 1000px;
  perspective-origin: center center;
  width: 392px;
  height: 548px;
  position: absolute;
  cursor: pointer;
  z-index: 5;
  transform-style: preserve-3d;
`;

const CardInner = styled.div`
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  position: relative;
  will-change: transform;
  backface-visibility: hidden;
`;

const CardFace = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  position: absolute;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const CardFront = styled(CardFace)`
  background-image: url(${props => props.image});
`;

const CardBack = styled(CardFace)`
  background-color: #F3F3F3;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  padding: 48px;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const CardText = styled.div`
  color: #333;
  font-family: Paragon;
  font-size: 1.75rem;
  text-align: center;
`;

const Footer = styled.div`
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin-top: 20px;
`;

const TruthDareCard = ({ 
  cardRef, 
  image, 
  onClick, 
  isClicked, 
  currentPlayer, 
  randomText
}) => {
  return (
    <CardWrapper ref={cardRef} onClick={onClick}>
      <CardInner className="inner">
        <CardFront image={image} />
        <CardBack>
          <Title>Truth & Dare</Title>
          <CardText>
            {isClicked && randomText 
              ? `${currentPlayer}, ${randomText}` 
              : currentPlayer}
          </CardText>
          <Footer>LoveTogether</Footer>
        </CardBack>
      </CardInner>
    </CardWrapper>
  );
};

export default TruthDareCard;

