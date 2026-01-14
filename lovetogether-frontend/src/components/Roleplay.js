import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import GrainEffect from './GrainEffect';
import PageHeader from './PageHeader';
import { ReactComponent as RefreshIcon } from '../images/assets/icons/refresh.svg';
import backgroundCard1 from '../images/backgrounds/background-card-1.png';
import useButtonSound from '../hooks/useButtonSound';
import { fetchRandomRoleplay as fetchRandomRoleplayFromSupabase } from '../lib/supabaseService';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  padding: 20px;
  background-color: var(--background);
  position: relative;
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Card = styled.div`
  width: 392px;
  height: 548px;
  background-image: url(${backgroundCard1});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  padding: 48px;
  box-shadow: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  text-align: center;
  z-index: 5;

  @media (max-width: 500px) {
    width: 95%;
    height: 60vh;
    overflow-y: scroll;
    transform: scale(0.85);
    transform-origin: center;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }
`;

const pulse = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
`;

const LoadingCard = styled(Card)`
  background-color: #f0f0f0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
  color: #FFFFFF;
`;

const Content = styled.p`
  font-family: Paragon;
  font-size: 22px;
  font-weight: 400;
  color: #FFFFFF;
  margin-bottom: 30px;

  @media (max-width: 500px) {
    font-size: 18px;
  }
`;

const Footer = styled.div`
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 48px;
  display: flex;
  gap: 20px;
  margin-top: 20px;
  z-index: 5;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 22px;
  height: 44px;
  background-color: var(--buttonBackground);
  border: none;
  border-radius: 1000px;
  color: var(--text);
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  z-index: 5;
  transition: all 0.2s ease;
  
  svg {
    stroke: var(--text);
    
    path, line, circle, polyline {
      stroke: var(--text);
    }
  }

  &:hover {
    background-color: var(--buttonBackgroundHover);
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

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 20px;
`;

const Roleplay = () => {
  const [roleplay, setRoleplay] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const playButtonSound = useButtonSound();

  const fetchRandomRoleplay = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await fetchRandomRoleplayFromSupabase();
      setRoleplay(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du roleplay:', error);
      setError('Impossible de charger le roleplay. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomRoleplay();
  }, []);

  if (error) {
    return (
      <PageContainer>
        <PageHeader />
        <ErrorMessage>{error}</ErrorMessage>
        <ButtonContainer>
          <Button onClick={() => { playButtonSound(); fetchRandomRoleplay(); }}>
            Réessayer <RefreshIcon />
          </Button>
        </ButtonContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader />
      {isLoading ? (
        <LoadingCard />
      ) : (
        <Card>
          <Title>{roleplay.title}</Title>
          <Content>{roleplay.description}</Content>
          <Footer>LoveTogether</Footer>
        </Card>
      )}

      <ButtonContainer>
        <Button onClick={() => { playButtonSound(); fetchRandomRoleplay(); }}>
          Another one <RefreshIcon />
        </Button>
      </ButtonContainer>
      <GrainEffect />
    </PageContainer>
  );
};

export default Roleplay;