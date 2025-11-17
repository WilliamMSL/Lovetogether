import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GrainEffect from './GrainEffect';
import PageHeader from './PageHeader';
import { ReactComponent as RefreshIcon } from '../images/assets/icons/refresh.svg';
import useButtonSound from '../hooks/useButtonSound';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100vw;
  overflow: hidden;
  background-color: #FFFFFF;
  position: relative; 
  z-index: 5;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
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
  z-index: 5;
  transition: all 0.2s ease;

  &:hover {
    background-color: #E8E8E8;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 48px;
  display: flex;
  gap: 20px;
  z-index: 5;
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

const getRandomPositionId = () => Math.floor(Math.random() * 500) + 1;

const Generator = () => {
  const [number, setNumber] = useState(getRandomPositionId);
  const playButtonSound = useButtonSound();

  const generateNumber = () => {
    setNumber(getRandomPositionId());
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

  return (
    <Container>
      <PageHeader />
      <FrameContainer>
        <div style={{ transform: 'translateY(-120px)' }}>
          <iframe
            src={`https://sexpositions.club/positions/${number}.html`}
            title="Position Generator"
            style={{ width: '100%', height: '1000px', border: 'none'}}
          />
        </div>
      </FrameContainer>
      <ButtonContainer>
        <Button onClick={() => { playButtonSound(); generateNumber(); }}>
          Générer <RefreshIcon />
        </Button>
      </ButtonContainer>
      <GrainEffect />
    </Container>
  );
};

export default Generator;


