import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import backgroundImage from '../images/logo-5.svg';
import GrainEffect from './GrainEffect';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:1812';
console.log('API Base URL:', API_BASE_URL);

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  padding: 20px;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const Card = styled.div`
  width: 392px;
  height: 548px;
  background-color: white;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
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
  }
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const Content = styled.p`
  font-family: Paragon;
  font-size: 20px;
  font-weight: 400;
  color: #000000;
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
  color: #000000;
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
  transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  z-index: 5;

  &:hover {
    background-color: #fff5f5;
    color: #ff4500;
    border-color: #ff4500;
    box-shadow: 0 6px 12px rgba(255, 69, 0, 0.3);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 20px;
`;

const Roleplay = () => {
  const [roleplay, setRoleplay] = useState(null);
  const [error, setError] = useState(null);

  const fetchRandomRoleplay = async () => {
    try {
      setError(null);
      console.log('Fetching roleplay from:', `${API_BASE_URL}/api/roleplay/random`);
      const response = await axios.get(`${API_BASE_URL}/api/roleplay/random`);
      console.log('Roleplay response:', response.data);
      setRoleplay(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du roleplay:', error);
      setError('Impossible de charger le roleplay. Veuillez réessayer.');
    }
  };

  useEffect(() => {
    fetchRandomRoleplay();
  }, []);

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <Button onClick={fetchRandomRoleplay}>Réessayer</Button>
      </PageContainer>
    );
  }

  if (!roleplay) {
    return (
      <SpinnerContainer>
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </SpinnerContainer>
    );
  }

  return (
    <PageContainer>
      <Card>
        <Title>{roleplay.title}</Title>
        <Content>{roleplay.description}</Content>
        <Footer>LoveTogether</Footer>
      </Card>

      <ButtonContainer>
        <Button onClick={fetchRandomRoleplay}>
          <span role="img" aria-label="Another one">🔄</span> Another one
        </Button>
      </ButtonContainer>
      <GrainEffect />
    </PageContainer>
  );
};

export default Roleplay;