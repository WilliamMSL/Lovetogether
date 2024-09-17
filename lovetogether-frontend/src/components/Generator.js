import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import backgroundImage from '../images/logo-5.svg';
import GrainEffect from './GrainEffect';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100vw;
  overflow: hidden;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative; 
  z-index: 5;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 5;

  &:hover {
    background-color: #fff5f5;
    color: #ff4500;
    border-color: #ff4500;
    box-shadow: 0 6px 12px rgba(255, 69, 0, 0.3);
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 48px;
  display: flex;
  gap: 20px;
  margin-top: 20px;
  z-index: 5;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100vw;
  z-index: 1;
`;

const FrameContainer = styled.div`
  width: 40%;
  height: 630px;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 16px;

  @media (max-width: 1000px) {
    width: 80%;
    height: 60%;
  }
`;

const Generator = () => {
  const [number, setNumber] = useState(() => {
    // Générer un nombre aléatoire entre 1 et 500 lors de l'initialisation
    return Math.floor(Math.random() * 500) + 1;
  });

  const generateNumber = () => {
    const randomNumber = Math.floor(Math.random() * 500) + 1;
    setNumber(randomNumber);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        generateNumber();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        generateNumber();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Container>
      <ContentWrapper>
        <FrameContainer>
          <div style={{ transform: 'translateY(-120px)' }}>
            <iframe
              src={`https://sexpositions.club/positions/${number}.html`}
              title="Position Generator"
              style={{ width: '100%', height: '1000px', border: 'none'}}
            />
          </div>
        </FrameContainer>
      </ContentWrapper>
      <ButtonContainer>
        <Button onClick={generateNumber}>
          <span role="img" aria-label="Tour">👀</span> Générer
        </Button>
      </ButtonContainer>
      <GrainEffect />
    </Container>
  );
};

export default Generator;


